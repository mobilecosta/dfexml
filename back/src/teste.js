const Captcha = require("2captcha")

// A new 'solver' instance with our API key
const solver = new Captcha.Solver("6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-")

/* Example ReCaptcha Website 
solver.recaptcha("6LcPrHYUAAAAAFc6TCjw0pq2qDKQ3dzHHlqOh3J9", "https://dfe-portal.svrs.rs.gov.br/MDFESSL/DownloadXMLDFe/")
*/

solver.recaptcha("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/")

.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err.message)
})