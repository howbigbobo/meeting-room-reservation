Create table if not exists room
(
    id       		INTEGER primary key AUTOINCREMENT,
    name    	    TEXT,
	address         TEXT,
    description     TEXT,
    create_date     TEXT,
    update_date     TEXT
)