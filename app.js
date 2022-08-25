const puppeteer = require('puppeteer')
const moment = require('moment')
const $ = require('./selectors')

const {
  TARGET_URL,
  USER_EMAIL,
  USER_PASSWORD,
} = process.env

// set timezone on system via nodejs
// also it'll change the Chromium's javascript date object timezone
process.env.TZ = 'Asia/Seoul'

// day of week on number,
// return 0 to 6, 0: Sun. 1: Mon. ... 6: Sat.
const now = moment().weekday()

const main = async () => {
  if (TARGET_URL === '' || USER_EMAIL === '' || USER_PASSWORD === '') {
    console.log(
      `⚠️ No Env Settings, URL: ${TARGET_URL}, USER_EMAIL: ${USER_EMAIL} ...`)
    return process.exit(1)
  }

  const browser = await puppeteer.launch()
  console.log(`💻 Try to logging at ${TARGET_URL}, with ${USER_EMAIL}`)
  console.log(`📌 Date: ${moment()}`)

  // do not run at weekend
  switch (now) {
    case 0:
    case 6:
      console.log('📌 Today is weekend.')
      return process.exit(0)
  }

  try {
    const page = await browser.newPage()
    await page.goto(TARGET_URL)

    await page.type($.email, USER_EMAIL)
    await page.type($.password, USER_PASSWORD)
    await page.click($.signinButton)

    // after slack login → redirect to client url with random string
    // wait for redirect complete on random url
    await page.waitForTimeout(20 * 1000) // 20 sec to wait

    // check body container exists
    await page.waitForSelector($.bodyContainer, { timeout: 60 * 1000 })
      .catch(err => {
        console.log(
          `login was success but didn't load main page of slack: ${err}`)
        throw err
      })

    // click the user button on right nav
    await page.$eval($.userButton, btn => btn.click())
      .catch(err => {
        console.log(
          `could not found the user button on right nav: ${err}`)
        throw err
      })
    // click the status list
    await page.$eval($.statusListButton, btn => btn.click())
      .catch(err => {
        console.log(`the status list on user's menu, not found : ${err}`)
        throw err
      })

    // delete user status if exists
    await page.$eval($.removeUserStatusButton, btn => btn.click())
      .catch(() => console.log('📌 Empty User status → 변경 예정'))

    switch (now) {
      // on tue, thu
      case 2:
      case 4:
        // 사무실 근무
        await page.$eval($.workAtOfficeButton, btn => btn.click())
          .catch(err => {
            console.log(`custom user status item 사무실 근무 📶, not found: ${err}`)
            throw err
          })
        console.log('📌 Set status → 사무실 근무 📶')
        break

      // on mon, wed, fri
      case 1:
      case 3:
      case 5:
        // work at home
        await page.$eval($.workAtHomeButton, btn => btn.click())
          .catch(err => {
            console.log(`custom user status item 재택 근무 🏡, not found: ${err}`)
            throw err
          })
        console.log('📌 Set status → 재택 근무 🏡')
        break
    }

    // push the save button
    await page.$eval($.saveButton, btn => btn.click())
      .catch(() => console.log('📌 슬랙 상태가 동일 했음.'))
  } catch (e) {
    process.exit(1)
  } finally {
    await browser.close()
  }
}

main().then(() => console.log('📌 Done.'))
