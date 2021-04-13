const puppeteer = require('puppeteer');

var useTor = false;

const ports = [
  9050,
  9052,
  9053,
  9054
];

var nextPortIndex = 0;

exports.screenshot = async (req, res) => {
  const url = req.query.url;
  const paramUseTor = req.query.useTor;

  if (!url) {
    return res.send('Please provide URL as GET parameter, for example: <a href="?url=https://example.com">?url=https://example.com</a>');
  }

  let args = ['--no-sandbox'];
  if (useTor || paramUseTor) {
    args.push(
      `--proxy-server=socks5://127.0.0.1:${ports[nextPortIndex]}`
    );
    nextPortIndex = (nextPortIndex + 1) % ports.length;
  }

  const browser = await puppeteer.launch({
    args: args
  });
  const page = await browser.newPage();
  await page.goto(url);
  const imageBuffer = await page.screenshot();
  const html = await page.content();
  browser.close();
  // res.set('Content-Type', 'image/png');
  // res.send(imageBuffer);
  res.set('Content-Type', 'text/html');
  let json = {
    image: imageBuffer.toString('base64'),
    text: html,
  }

  res.send(JSON.stringify(json, null, 2));
};