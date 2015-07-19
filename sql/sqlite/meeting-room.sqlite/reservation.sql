Create table if not exists reservation
(
    id       		INTEGER primary key AUTOINCREMENT,
    user_id    	    INTEGER,
	room_id         INTEGER,
	date			TEXT,
    start_minute    INTEGER,
    end_minute      INTEGER,
    create_date     TEXT
)