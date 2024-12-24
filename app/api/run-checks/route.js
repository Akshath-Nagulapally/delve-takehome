import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import axios from 'axios';

export async function POST(req) {
  const { apiKey, projectId, accessToken } = await req.json()

  function logAction(status, description) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] - Status: "${status.toUpperCase()}", Description: "${description}"`);
  }

  if (!apiKey || !projectId) {
    return NextResponse.json({ error: "API key, project ID and access token are required" }, { status: 400 });
  }

  const supabase = createClient(`https://${projectId}.supabase.co`, apiKey)

  const results = []

  // Check MFA
  try {
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    const mfaResult = {
      name: "Multi-Factor Authentication (MFA)",
      status: "pass",
      details: [],
    }

    if(data?.users){
    for (const user of data.users) {
      if (!user.factors || user.factors.length === 0) {
        mfaResult.status = "fail"
        logAction("fail", `User ${user.email} does not have MFA enabled` ); // Log failure
        mfaResult.details.push(`User ${user.email} does not have MFA enabled`)
      }
    }
  }

    if (mfaResult.status === "pass") {
      mfaResult.details.push("All users have MFA enabled")
      logAction("success", "All users have MFA enabled"); // Log success
    }
    results.push(mfaResult)
  } catch (error) {
    console.error("Error checking MFA:", error)
    logAction("fail", "failed to check MFA"); // Log success

    results.push({
      name: "Multi-Factor Authentication (MFA)",
      status: "fail",
      details: ["Error checking MFA status"],
    })
  }

  // Check RLS
  try {
    const { data: tables, error } = await supabase.rpc("get_rls_status")
    if (error) throw error

    const rlsResult = {
      name: "Row Level Security (RLS)",
      status: "pass",
      details: [],
    }

    for (const table of tables) {
      if (!table.rls_enabled) {
        rlsResult.status = "fail"
        rlsResult.details.push(`Table ${table.table_name} does not have RLS enabled`)
        logAction("fail", `Table ${table.table_name} does not have RLS enabled`); 

      }
    }

    if (rlsResult.status === "pass") {
      rlsResult.details.push("All tables have RLS enabled")
      logAction("success", "All tables have RLS enabled"); 

    }
    results.push(rlsResult)
  } catch (error) {
    console.error("Error checking RLS:", error)
    logAction("fail", "failed to check RLS across tables");

    results.push({
      name: "Row Level Security (RLS)",
      status: "fail",
      details: ["Error checking RLS status"],
    })
  }

  // Check PITR
  try {

    const API_BASE_URL = 'https://api.supabase.com/v1/projects';
    
    const fetchSupabaseProjects = async () => {
      try {
        // Fetch all projects
        const projectsResponse = await axios.get(API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        const projects = projectsResponse.data;
        const activeProjects = projects.filter(project => project.status !== 'INACTIVE');

    
        for (const project of activeProjects) {

          const ref = project.id; // Extract project ref
    
          // Fetch PITR status for each project
          const pitrResponse = await axios.get(`${API_BASE_URL}/${ref}/database/backups`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
    
          const { pitr_enabled, backups } = pitrResponse.data;
          return [pitr_enabled, backups];
        }
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    };
    
    const [status_enabled, backups] = await fetchSupabaseProjects();
    

    const pitrResult = {
      name: "Point in Time Recovery (PITR)",
      status: status_enabled ? "pass" : "fail",
      details: [
        status_enabled
          ? "PITR is enabled for this project"
          : "PITR is not enabled for this project",
      ],
    }
    results.push(pitrResult)
  } catch (error) {
    console.error("Error checking PITR:", error)
    results.push({
      name: "Point in Time Recovery (PITR)",
      status: "fail",
      details: ["Error checking PITR status"],
    })
  }

  return NextResponse.json({ results });
}

