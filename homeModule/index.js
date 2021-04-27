const Browser = require('./browser.js')
const puppeterr = require('puppeteer');
var JSSoup = require('jssoup').default;
let fs = require('fs')


async function main() {
  let data = []
  let url = await JSON.parse(await fs.readFileSync('./data/url.json', 'utf8'))
  let a = new Browser()
  await a.initialiseBrowser(false)
  for (let i in url) {
    console.log('=== ' + i + ' ===')
    await a.newPage(`https://www.m.au-coeur-des-chevaux.com/${url[i]['value']}`)
    await a.clickOnLoadMore()
    data.push(await a.getAllMoreInfoButtons())
  }
  await a.closeBrowser()
  a.writeInfoIntoJson(data)

}

async function correct() {
  let res = []
  let data = await JSON.parse(await fs.readFileSync('../data/rawData.json', 'utf8'))
  for (let array in data) {
    for (let i in data[array]) {
      let currentEl = data[array][i]
      let newE = {}
      if (currentEl.Contact != undefined)
        newE.Contact = currentEl.Contact
      if (currentEl.Adresse != undefined)
        newE.Adresse = currentEl.Adresse
      if (currentEl.Code != undefined)
        newE.Code = currentEl.Code
      if (currentEl.Commune != undefined)
        newE.Commune = currentEl.Commune
      if (currentEl.Téléphone != undefined)
        newE.Téléphone = currentEl.Téléphone
      if (currentEl.Mobile != undefined)
        newE.Mobile = currentEl.Mobile
      if (currentEl.Email != undefined)
        newE.Email = currentEl.Email
      if (currentEl.Site != undefined)
        newE.Site = currentEl.Site
      if (!res.includes(newE))
        res.push(newE)
    }
  }
  fs.writeFile('../data/dataParseCorrectly.json', JSON.stringify(res, null, 4), (err) => {
    if (err) console.log(err)
  })
}
//correct().then(res => { })
main().then(res => { })



