const request = require('request');
const puppeteer = require('puppeteer');

const API_KEY = "6f2a14d2ecb747ff87bfc9e887bd0ef0"

async function curl(options) {
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if(err)
                return reject(err);
            resolve(body);
        });
    });
}

async function sleep(sec) {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
        }, sec * 1000);
    });
}

async function resolve_captcha_v2(google_key, site_url) {
    
    let unparsed_captcha_id = await curl({
        method : 'GET',
        url: `https://2captcha.com/in.php?key=${API_KEY}&method=userrecaptcha&googlekey=${google_key}&pageurl=${site_url}&json=true`
    });

    let parsed_captcha_id = JSON.parse(unparsed_captcha_id);
    let captcha_id = parsed_captcha_id.request;

    console.log(parsed_captcha_id);

    while(1) {

        await sleep(10);
        console.log('verificando se o captcha está pronto...');
        let captcha_ready = await curl({
            method: 'GET',
            url: `https://2captcha.com/res.php?key=${API_KEY}&action=get&id=${captcha_id}&json=true`
        });

        let parsed_captcha_ready = JSON.parse(captcha_ready);
        console.log(parsed_captcha_ready);
        if(parsed_captcha_ready.status == 1)
            return parsed_captcha_ready.request;
        else if(parsed_captcha_ready.request != "CAPCHA_NOT_READY")
            return false;

    }

}

async function run () {

    const browser = await puppeteer.launch({
        headless : false
    });
    const page = await browser.newPage();

    // let site_key = '6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-';
    // let site_url = 'https://www.google.com/recaptcha/api2/demo';

	let site_url = 'https://dfe-portal.svrs.rs.gov.br/MDFESSL/DownloadXMLDFe';
	let site_key = '6LcPrHYUAAAAAFc6TCjw0pq2qDKQ3dzHHlqOh3J9';

    await page.goto(site_url);

    let captcha_token = await resolve_captcha_v2(site_key, site_url);
    if(!captcha_token)
        return console.log("Falha ao obter o TOKEN 😤");

    let navigation_promise = page.waitForNavigation();
    await page.evaluate((inside_token) => {
        document.querySelector('#g-recaptcha-response').innerHTML = inside_token;
		console.log(inside_token);
        document.querySelector('#recaptcha-demo-submit').click();
    }, captcha_token);
    await navigation_promise;

    let success = await page.$('.recaptcha-success');
    if(success)
        return console.log("Captcha QUEBRADOOO 😍");

    return console.log('FALHOU AO QUEBRAR O CAPTCHA');
    

}

run ();