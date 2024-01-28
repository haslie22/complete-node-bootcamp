const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// === FILES ===

// 1. Blocking, sync way

// when locating in starter folder:
// const textInput = fs.readFileSync(path.join(__dirname, "txt", "input.txt"), "utf-8");
// console.log("textInput: ", textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${new Date().toLocaleString()}`;
// fs.writeFileSync(path.join(__dirname, "txt", "output.txt"), textOutput);
// console.log("File written");

// 2. Non-blocking, async way
// fs.readFile(path.join(__dirname, "txt", "start.txt"), "utf-8", (err, data) => {
//   console.log("data: ", data);
// });

// fs.readFile(path.join(__dirname, "txt", "start.txt"), "utf-8", (err, data1) => {
//   fs.readFile(path.join(__dirname, "txt", `${data1}.txt`), "utf-8", (err, data2) => {
//     console.log("data2: ", data2);
//     fs.readFile(path.join(__dirname, "txt", "append.txt"), "utf-8", (err, data3) => {
//       console.log("data3: ", data3);

//       fs.writeFile(path.join(__dirname, "txt", "final.txt"), `${data2}\n${data3}`, "utf-8", () => {
//         console.log("Your file has been written! 😁");
//       });
//     });
//   });
// });

// console.log("will read file");

// === SERVER ===

const data = fs.readFileSync(
  path.join(__dirname, 'dev-data', 'data.json'),
  'utf-8'
);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log('slugs: ', slugs);

const templateOverview = fs.readFileSync(
  path.join(__dirname, 'templates', 'template-overview.html'),
  'utf-8'
);
const templateCard = fs.readFileSync(
  path.join(__dirname, 'templates', 'template-card.html'),
  'utf-8'
);
const templateProduct = fs.readFileSync(
  path.join(__dirname, 'templates', 'template-product.html'),
  'utf-8'
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    // reads file each time, when we navigate to /api. Better to read once and store in variable (top-level readFileSync)
    // fs.readFile(path.join(__dirname, "dev-data", "data.json"), "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    //   res.writeHead(200, {
    //     "Content-type": "application/json",
    //   });
    //   res.end(data);
    // });
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log(`Listening to requests on port 8000...`);
});
