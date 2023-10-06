const whitelist = ['http:/127:0:0:1:5500',
                 'http://localhost:3000']
const corsOption = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1    || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowd by Cors'));
        }
    }, optionSuccessStatus: 200
}

module.exports = corsOption;