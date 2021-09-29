const fs = require("fs");
const csv = require("csv-parser");
const MaskData = require("maskdata");
const users = [];

const generateUsername = (firstname, surname) =>
  `${firstname[0]}-${surname}`.toLowerCase();

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
  const header = ["Username,FirstName,Roles,Password,Phone,Email"];
  const rows = users.map(
    (user) => `${user.username},${user.firstname},${user.roles},${user.password},${user.phone},${user.email}`
  );
  return header.concat(rows).join("\n");
};

const maskPassword = (password) => {
  const maskPasswordOptions = {
    maskWith: "*",
    maxMaskedCharacters: 20, // To limit the output String length to 20.
    unmaskedStartCharacters: 4,
    unmaskedEndCharacters: 9, // As last 9 characters of the secret key is a meta info which can be printed for debugging or other purpose
  };

  return MaskData.maskPassword(password);
};

const maskPhone = (phone) => MaskData.maskPhone(phone);

const maskEmail = (email) => MaskData.maskEmail2(email);

fs.createReadStream("resources/input.csv")
  .pipe(csv())
  .on("data", (row) => {
    const username = generateUsername(row.Firstname, row.Surname);

    const user = {
      username,
      firstname: row.Firstname,
      surname: row.Surname,
      password: maskPassword(row.Password),
      phone: maskPhone(row.Phone),
      email: maskEmail(row.Email),
      roles: row.Roles,
    };

    users.push(user);
  })
  .on("end", () => {
    console.table(users);
    writeToCSVFile(users);
  });
