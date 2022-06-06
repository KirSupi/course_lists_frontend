const SMS = {
    from: 0,
    to: 0,
    text: "",
    timestamp: 1652515430,
    read: false
};
const Phone = {
    number: 0,
    sms: [SMS]
};
const Tower = {
    number: 0,
    phones: [Phone]
};
const SMSCenter = {
    towers: [Tower]
};

export {
    SMS,
    Phone,
    Tower,
    SMSCenter
};