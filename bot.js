"use strict";

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

console.log("Le bot d'achat démarre...");

try {
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

        await page.goto(parameters.urlShoe);
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch((error) => {
            console.log(error);
        });

        await generateInfoLog('1.Page chargée', parameters.debug);

        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.waitForSelector('.size-grid-dropdown').catch((error) => {
            console.log(error);
        });

        await page.evaluate(() =>
            document.querySelectorAll(".size-grid-dropdown")[0].scrollIntoView()
        );

        await generateInfoLog('2.Des sélecteurs sont apparus', parameters.debug);

        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.evaluate(async (size) => {
            let sizes = await Array.from(document.querySelectorAll(".size-grid-dropdown"));
            let sizeIndex = sizes
                .map((s, i) => (s.innerHTML === size ? i : false))
                .filter(Boolean)[0];
            return sizes[sizeIndex].click();
        }, parameters.size);

        await generateInfoLog('3.Taille trouvée et selectionnée', parameters.debug);

        // Ajout panier
        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.waitForSelector('button[data-qa=add-to-cart]').catch((error) => {
            console.log(error);
        });

        await page.evaluate(() =>
            document.querySelectorAll("button[data-qa=add-to-cart]")[0].scrollIntoView()
        ).catch((error) => {
            console.log(error);
        });

        await generateInfoLog('4.Défilement effectuée jusqu\'au bouton d\'ajout au panier', parameters.debug);

        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.evaluate(() =>
            document.querySelectorAll("button[data-qa=add-to-cart]")[0].click()
        ).catch((error) => {
            console.log(error);
        });

        await generateInfoLog('5.Produit ajouté au panier', parameters.debug);

        // Bouton "Paiement"
        await page.goto(parameters.urlPayment);

        // Connexion
        await page.waitForSelector('.emailAddress').catch((error) => {
            console.log(error);
        });

        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.focus('.emailAddress > input');
        await page.keyboard.type(parameters.user);
        await page.waitFor(200).catch((error) => {
            console.log(error);
        });

        await page.focus('.password > input')
        await page.keyboard.type(parameters.password);
        await page.waitFor(200).catch((error) => {
            console.log(error);
        });

        await page.evaluate(() =>
            document.querySelectorAll(".loginSubmit > input")[0].click()
        ).catch((error) => {
            console.log(error);
        });

        await generateInfoLog('6.Connecté', parameters.debug);

        // Saisie du code de vérification de carte bancaire
        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.waitForSelector('.credit-card-iframe').catch((error) => {
            console.log(error);
        });

        await page.waitForSelector('.credit-card-iframe').catch((error) => {
            console.log(error);
        });

        await page.evaluate(() =>
            document.querySelectorAll(".credit-card-iframe")[0].scrollIntoView()
        ).catch((error) => {
            console.log(error);
        });

        await page.waitFor(200).catch((error) => {
            console.log(error);
        });

        const target_frame = page.frames().find(frame => frame.url().includes('paymentcc.nike.com'));

        await target_frame.evaluate(
            () => (document.getElementById("cvNumber").focus())
        ).catch((error) => {
            console.log(error);
        });

        await target_frame.waitFor(1000).catch((error) => {
            console.log(error);
        });

        await page.keyboard.type(parameters.cv_code, { delay: 10 });

        await generateInfoLog('7.Code de vérification de carte bancaire saisi', parameters.debug);

        // Valider le paiement
        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        await page.waitForSelector('.save-button').catch((error) => {
            console.log(error);
        });

        const buttons = await page.$$('.save-button');

        await buttons[1].click();

        await generateInfoLog('8.Cliqué sur "Enregistrer et continuer"', parameters.debug);

        await page.waitFor(500).catch((error) => {
            console.log(error);
        });

        if (parameters.buy === true) {
            await buttons[2].click();

            await generateInfoLog('9.Commande effectuée', parameters.debug);

            throw ("/!\ ACHAT RÉUSSI !!!");

            await page.waitFor(500).catch((error) => {
                console.log(error);
            });
        }
        else {
            throw ("/!\ Achat non effectué");
        }

        function setLogFolders(page, debug) {
            if (debug === true) {
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
        }

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
} catch (error) {
    console.log(error)
}
