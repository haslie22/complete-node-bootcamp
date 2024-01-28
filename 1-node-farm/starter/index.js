const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");

// === FILES ===

// 1. Blocking, sync way

// when locating in starter folder:
const textInput = fs.readFileSync(path.join(__dirname, "txt", "input.txt"), "utf-8");
console.log("textInput: ", textInput);

const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${new Date().toLocaleString()}`;
fs.writeFileSync(path.join(__dirname, "txt", "output.txt"), textOutput);
console.log("File written");

// 2. Non-blocking, async way
fs.readFile(path.join(__dirname, "txt", "start.txt"), "utf-8", (err, data) => {
  console.log("data: ", data);
});

fs.readFile(path.join(__dirname, "txt", "start.txt"), "utf-8", (err, data1) => {
  fs.readFile(path.join(__dirname, "txt", `${data1}.txt`), "utf-8", (err, data2) => {
    console.log("data2: ", data2);
    fs.readFile(path.join(__dirname, "txt", "append.txt"), "utf-8", (err, data3) => {
      console.log("data3: ", data3);

      fs.writeFile(path.join(__dirname, "txt", "final.txt"), `${data2}\n${data3}`, "utf-8", () => {
        console.log("Your file has been written! 😁");
      });
    });
  });
});

console.log("will read file");
