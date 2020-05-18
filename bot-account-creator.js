"use strict";

const request = require("request");
const fs = require('fs');
const parameters = require('./const');
const puppeteer = require('puppeteer-extra');
const slugify = require('slugify');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const { installMouseHelper } = require('./mouse-helper');
puppeteer.use(pluginStealth());

const html_path = parameters.htmlPath;
const screenshot_path = parameters.screenshotPath;
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'logs/' + 'bot.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
        args: [
            '--proxy-server=' + parameters.proxy,
        ]
    };
let html = '';

var emailVal = parameters.emailPrefix + (Math.floor((Math.random() * 9000) + 1000)).toString() + '@gmail.com';
var smsEmail = parameters.smsEmail;
var token = parameters.token;
var passwordVal = parameters.passwordToCreateAccount;
var fNameVal = parameters.name;
var sNameVal = parameters.surname;
var info;
var themessage;

//GET DOM TRAVERSAL VALUES
const AcceptCookies = '#cookie-settings-layout > div > div > div > div.ncss-row.mt5-sm.mb7-sm > div:nth-child(2) > button';
const loginBtn = 'li.member-nav-item.d-sm-ib.va-sm-m > button';
const registerBtn = '.loginJoinLink.current-member-signin > a';
const email = 'input[type="email"]';
const password = 'input[type="password"]';
const fName = '.firstName.nike-unite-component.empty > input[type="text"]';
const sName = '.lastName.nike-unite-component.empty > input[type="text"]';
const dob = 'input[type="date"]';
const gender = 'li:nth-child(1) > input[type="button"]';
const submit = '.joinSubmit.nike-unite-component > input[type="button"]';
const phone = 'div.sendCode > div.mobileNumber-div > input';
const sendNum = '#nike-unite-progressiveForm > div > div > input[type="button"]';
const enterTheValue = 'input[type="number"]';
const storedSubmit = '#nike-unite-progressiveForm > div > input[type="button"]';

//Create Sleep function to use in Async/Await function
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

//callback for phone number request
function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        info = body;
        console.log("Phone Number: " + info);
    }
}

//values for phone number request
const options = {
    url: 'http://www.getsmscode.com/vndo.php?action=getmobile&username='+smsEmail+'&token='+token+'&cocode=uk&pid=462',
    headers: {'User-Agent': 'request'}
};

//callback for text message response
function callbacktwo(error, response, body) {
    if (!error && response.statusCode == 200) {
        themessage = body;
        console.log("Message: " + themessage);
    }
}

console.log("Le bot de création de compte démarre...");

(async () => {
	// Ouverture du navigateur
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true,
        executablePath: process.env.CHROMIUM_PATH,
        args: [
            '--proxy-server=http=' + parameters.proxy,
            '--no-sandbox',
        ]
    });
    
    const page = await browser.newPage();

    let log = SimpleNodeLogger.createSimpleFileLogger(opts);

        // Création des répertoires qui contiennent les logs
        if (parameters.debug === true) {
            installMouseHelper(page);

            let dir = 'htmls';
            if (!fs.existsSync(dir)) {
                try {
                    fs.mkdirSync(dir);
                }
                catch (error) {
                    console.log('Error : ' + error);
                }
            }

            dir = 'screenshots';
            if (!fs.existsSync(dir)) {
                try {
                    fs.mkdirSync(dir);
                }
                catch (error) {
                    console.log('Error : ' + error);
                }
            }

            dir = 'logs';
            if (!fs.existsSync(dir)) {
                try {
                    fs.mkdirSync(dir);
                }
                catch (error) {
                    console.log('Error : ' + error);
                }
            }

            log.setLevel('info');
        }

    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(parameters.urlLaunch);

    await page.waitFor(1000);

    await generateInfoLog('1.Page chargée', parameters.debug);

    await page.click(loginBtn);
    console.log("Login Button Clicked...")

    await page.click(registerBtn);
    console.log("Register Button Clicked");

    await page.waitFor(2000);
 
    console.log("email: " + emailVal);
    await page.type(email, emailVal);
    console.log("entered email");

    await page.type(password, passwordVal);

    await page.type(fName, fNameVal);

    await page.type(sName, sNameVal);

    await page.type(dob, '01/05/19'+(Math.floor((Math.random() * (99-55)) + 55)).toString());

    await page.click(gender);

    console.log("waiting 0.5s");
    await page.waitFor(500);
    console.log("waiting done");

    await page.click(submit);
    console.log("submitted");

    await generateInfoLog("2.Formulaire d'inscription rempli", parameters.debug);

  browser.close();
  process.exit();

  function generateInfoLog(info, debug) {
    if (debug === true) {
        log.info(info);
        html = page.content();

        let fileName = slugify(info, {
            replacement: '-',
            lower: true
        });

        try {
            fs.writeFileSync(html_path + fileName + Math.floor(new Date() / 1000) + ".html", html);
            page.screenshot({ path: screenshot_path + fileName + Math.floor(new Date() / 1000) + '.png' });
        }
        catch (error) {
            console.log(error);
        }
    }
}

})();