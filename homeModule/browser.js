const puppeterr = require('puppeteer');
var JSSoup = require('jssoup').default;
let fs = require('fs')

class Browser {
    constructor() {
        this.browser = null
        this.pages = null
    }

    async initialiseBrowser(headless) {
        try {
            if (this.browser == null)
                this.browser = await puppeterr.launch(headless ? { headless: true } : { headless: false })
                this.pages = await this.browser.newPage()
        } catch (error) {
            console.error(error)
        }

    }

    async wait(millisecond) {
        try {
            await this.pages.waitForTimeout(millisecond)
        } catch (error) {
            console.error(error)
        }

    }

    async closeBrowser() {
        try {
            if (this.browser != null)
                this.browser.close()
        } catch (error) {
            console.error(error)
        }

    }

    async newPage(url) {
        try {
            
            await this.pages.goto(url)
        } catch (error) {
            console.error(error)
        }

    }

    async clickOnLoadMore() {
        try {
            const selector = 'a[id*=buttonafficherplus]'
            let arrayButton = await this.pages.$$(selector)
            let stillLoadButtonAvailable = true
            while (stillLoadButtonAvailable) {
                await arrayButton[arrayButton.length - 1].click()
                await this.pages.waitForTimeout(1000)
                arrayButton = await this.pages.$$(selector)
                if (await arrayButton[arrayButton.length - 1].boundingBox() == null) {
                    stillLoadButtonAvailable = false;
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getAllMoreInfoButtons() {
        let res = []
        const selector = 'a[class*=adressefichecss]'
        let buttons = await this.pages.$$(selector)
        for (let index in buttons) {
            try {
                if (await buttons[index].boundingBox() != null) {
                    await buttons[index].click()
                    await this.wait(1000)
                    let info = await this.pages.evaluate(() => {
                        return (document.querySelector('div.spgficheetscontent').innerHTML)
                    })
                    res.push(this.parseModalDiv(info))
                    await this.pages.click('span.pgmodalclose')
                }
            } catch (error) {
                continue
            }
        }
        return res
    }

    parseModalDiv(html) {
        try {
            let table = new JSSoup(html)
            let resModal = {}
            let tableTrs = table.findAll('tr')
            for (let i in tableTrs) {
                let tableTds = tableTrs[i].findAll('td')
                let string = (tableTds[0].text + ' ' + tableTds[1].text).split('\n').join('').split(' ')
                for (let j = 0; j < string.length; j++) {
                    if (j == 1)
                        resModal[string[0]] = string[j] + " "
                    else
                        resModal[string[0]] += string[j] + " "
                }
            }
            return resModal;
        } catch (error) { console.error(error) }
    }

    async retrieveUrl() {
        let select = null;
        let dic = [];
        try {
            select = await this.page.evaluate(() => {
                return { select: document.querySelector('select#pgvr101nodeptacdc').innerHTML }
            });
            let soup = new JSSoup(select.select).findAll('option')
            for (let element in soup) {
                dic.push(soup[element].attrs)
            }
            fs.writeFile('url.json', JSON.stringify(dic, null, 4), (err) => {
                if (err) console.log(err)
            });
        } catch (Exception) {
            console.error(Exception)
        }
    }

    writeInfoIntoJson(data) {
        fs.writeFile('./dataTEST.json', JSON.stringify(data, null, 4), (err) => {
            if (err) console.log(err)
        })
    }

    static async retrieveUrl() {
        const browser = await puppeterr.launch()
        let page = await browser.newPage()
        await page.goto('https://www.m.au-coeur-des-chevaux.com/l-annuaire.php?page=l-annuaire-les-centres-equestres')

        let select = null;
        let dic = [];
        try {
            select = await page.evaluate(() => {
                return { select: document.querySelector('select#pgvr101nodeptacdc').innerHTML }
            });
            let soup = new JSSoup(select.select).findAll('option')
            for (let element in soup) {
                dic.push(soup[element].attrs)
            }
            fs.writeFile('url.json', JSON.stringify(dic, null, 4), (err) => {
                if (err) console.log(err)
            });
        } catch (Exception) {
            console.error(Exception)
        }
    }
}

module.exports = Browser
