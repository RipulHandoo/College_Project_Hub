CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    repo_name VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack TEXT[],
    is_private BOOLEAN NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    direct_link TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
