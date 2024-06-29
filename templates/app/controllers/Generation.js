const crypto = require('crypto');

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Tạo secret key mới và in ra console (chỉ thực hiện một lần)
const secretKey = generateSecretKey();
//console.log(secretKey);

var fs = require('fs')

fs.writeFile('.env','SECRET_KEY='+secretKey, function (err){
    if(err) {
        return console.error(err);
    }
    console.log("Ghi file thành công");
});
