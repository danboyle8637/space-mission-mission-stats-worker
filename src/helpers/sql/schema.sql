CREATE TABLE IF NOT EXISTS mission_stats (
    id SERIAL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    mission_id VARCHAR(20) NOT NULL,
    is_goal1_complete BOOLEAN NOT NULL DEFAULT false,
    is_goal2_complete BOOLEAN NOT NULL DEFAULT false,
    is_goal3_complete BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

INSERT INTO mission_stats
    (user_id, mission_id, status)
VALUES ('123456', 'mars', 'active')
RETURNING user_id, mission_id, is_goal1_complete, is_goal2_complete, is_goal1_complete, status;

UPDATE mission_stats
SET is_goal1_complete = true
WHERE user_id = '654321' AND mission_id = 'mars'
RETURNING user_id, mission_id, is_goal1_complete, is_goal2_complete, is_goal3_complete, status;