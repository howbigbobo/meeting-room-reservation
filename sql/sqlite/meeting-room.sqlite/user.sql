Create table if not exists user
(
    id    		    INTEGER primary key AUTOINCREMENT,
    name    	    TEXT,
	password        TEXT,
    ip		        TEXT,
    mac             TEXT,
    create_date     TEXT,
    update_date     TEXT
)