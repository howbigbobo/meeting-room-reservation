exports.User = function () {
    return {
        table: "user",
        obj: {
            id: 0,
            name: "",
            password: "",
            ip: "",
            mac: "",
            createDate: "",
            updateDate: ""
        }
    };
}

exports.Room = function () {
    return {
        table: "room",
        obj: {
            id: 0,
            name: "",
            address: "",
            description: "",
            status: "A", // A (active), D(disable)
            createDate: "",
            updateDate: ""
        }
    };
}

exports.Reservation = function () {
    return {
        table: "reservation",
        obj: {
            id: 0,
            userId: "",
            userName: "",
            ip:"",
            roomId: "",
            roomName: "",
            date: "",
            startMinute: "",
            endMinute: "",
            createDate: ""
        }
    };
}