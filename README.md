Furthering the scope(assuming unbounded time):

1) Contextual chatbot, automatically provides compliance suggestions
2) Automatically make the required changes in supabase with human in the loop verification of all changes using langgraph
3) Better Chatbot UI/UX
4) Adding streaming to the Chatbot
5) KEY: Authenticating with supabase currently is a very ineffecient/inconvenient process. Having an AI browser agent automatically find out the api keys to plug in could help make this experience much easier.

Setup instructions:

To run the following check "Is Row Level Security (RLS) enabled for all tables?"

The following SQL needs to be executed in a project:

CREATE OR REPLACE FUNCTION get_rls_status()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT 
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'schema_name', n.nspname,
                'table_name', c.relname,
                'rls_enabled', c.relrowsecurity
            )
        )
    INTO result
    FROM 
        pg_class c
    JOIN 
        pg_namespace n ON n.oid = c.relnamespace
    WHERE 
        c.relkind = 'r' -- Only include regular tables
        AND n.nspname NOT IN ('pg_catalog', 'information_schema'); -- Exclude system schemas

    RETURN result;
END;
$$ LANGUAGE plpgsql;


Additionally set OPENAI_API_KEY in .env