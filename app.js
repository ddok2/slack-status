const puppeteer = require('puppeteer')
const moment = require('moment')

const URL = process.env.TARGET_URL,
  USER_EMAIL = process.env.USER_EMAIL,
  USER_PW = process.env.USER_PASSWORD

const main = async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page.goto(URL)

  console.log(`try to logging at ${URL}, with ${USER_EMAIL}`)

  await page.type('#email', USER_EMAIL)
  await page.type('#password', USER_PW)

  await Promise.all([
    page.click('#signin_btn'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ])

  await page.waitForSelector(
    'body > div.p-client_container > div > div.p-top_nav > div.p-top_nav__right')

  await page.$eval('button[data-qa="user-button"]', btn => btn.click())
  await page.$eval('button[data-qa="main-menu-custom-status-item"]',
    btn => btn.click())

  // delete user status if exists
  const deleteUserStatusSelector = 'body > div.c-sk-modal_portal > div > div > div.c-sk-modal_content.p-custom_status_modal__content > div > div.c-scrollbar__hider > div > div > div:nth-child(1) > div > div > div > div.p-custom_status_modal__input_action > button'
  await page.$eval(deleteUserStatusSelector, btn => btn.click())
    .catch(() => console.log('empty user status.'))

  const now = moment()
  now.locale('ko')

  switch (now.weekday()) {
    case 2:
    case 4:
      // 사무실 근무
      await page.$eval(
        'body > div.c-sk-modal_portal > div > div > div.c-sk-modal_content.p-custom_status_modal__content > div > div.c-scrollbar__hider > div > div > fieldset:nth-child(2) > div > div:nth-child(1) > button',
        btn => btn.click())
      console.log('set status → 사무실 근무')
      break

    default:
      await page.$eval(
        'body > div.c-sk-modal_portal > div > div > div.c-sk-modal_content.p-custom_status_modal__content > div > div.c-scrollbar__hider > div > div > fieldset:nth-child(2) > div > div:nth-child(2) > button',
        btn => btn.click())
      console.log('set status → 재택 근무')
      break
  }

  // 저장
  await page.$eval(
    'body > div.c-sk-modal_portal > div > div > div.c-sk-modal_footer > div > button.c-button.c-button--primary.c-button--medium',
    btn => btn.click()).catch(() => console.log('슬랙 상태가 동일 했음.'))
  await browser.close()
}

main().catch(err => console.log(err))
