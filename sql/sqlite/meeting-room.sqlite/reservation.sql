Create table if not exists reservation
(
    id       		INTEGER primary key AUTOINCREMENT,
	userId			INTEGER,
    userName   	    TEXT,
	roomId          INTEGER,
	roomName		TEXT,
	date			TEXT,
    startMinute     INTEGER,
    endMinute       INTEGER,
    createDate      TEXT
)