Create table if not exists user
(
    id    		    INTEGER primary key AUTOINCREMENT,
    name    	    TEXT,
	password        TEXT,
    ip		        TEXT,
    mac             TEXT,
    createDate      TEXT,
    updateDate      TEXT
)