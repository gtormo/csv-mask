const fs = require("fs");
const csv = require("csv-parser");
const MaskData = require("maskdata");
const crypto = require("crypto");

const users = [];
const _input = [];

const encrypt = (str) => {
  const publicKey = fs.readFileSync('certificates/public_key.pem', 'utf8');

  const encryptedText = crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
      passphrase: ''
    }, Buffer.from(str));

  return encryptedText.toString('base64');  
}

const writeToCSVFile = (users) => {
  const filename = "resources/output.csv";
  fs.writeFile(filename, extractAsCSV(users), (err) => {
    if (err) {
      console.log("Error writing to csv file", err);
    } else {
      console.log(`saved as ${filename}`);
    }
  });
};

const extractAsCSV = (users) => {
  const header = ["firstName,surname,age,roles,phone,email"];
  const rows = users.map(
    (user) => `${user.firstname},${user.surname},${user.age},${user.roles},${user.phone},${user.email}`
  );
  return header.concat(rows).join("\n");
};

const maskPhone = (phone) => MaskData.maskPhone(phone);

const maskStr = (str) => MaskData.maskString(str, { maskAll: true });

fs.createReadStream("resources/input.csv")
  .pipe(csv())
  .on("data", (row) => {
    const email = encrypt(row.email);

    const user = {
      firstname: maskStr(row.firstname),
      surname: maskStr(row.surname),
      age: row.age,
      phone: maskPhone(row.phone),
      email,
      roles: maskStr(row.roles)
    };

    _input.push(row);
    users.push(user);
  })
  .on("end", () => {
    console.table(_input);
    console.table(users);
    writeToCSVFile(users);
  });
