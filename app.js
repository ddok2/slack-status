const puppeteer = require('puppeteer')
const moment = require('moment-timezone')

const {
  TARGET_URL,
  USER_EMAIL,
  USER_PASSWORD,
} = process.env

const now = moment()

const isEnv = () => {
  return TARGET_URL !== '' && USER_EMAIL !== '' && USER_PASSWORD !== ''
}

const main = async () => {
  if (!isEnv) {
    console.log(
      `⚠️ No Env Settings, URL: ${TARGET_URL}, USER_EMAIL: ${USER_EMAIL} ...`)
    return
  }

  const browser = await puppeteer.launch()

  now.tz('Asia/Seoul')
  console.log(`💻 Try to logging at ${TARGET_URL}, with ${USER_EMAIL}`)
  console.log(`📌 Date: ${now}`)

  try {
    const page = await browser.newPage()
    await page.goto(TARGET_URL)

    await page.type('#email', USER_EMAIL)
    await page.type('#password', USER_PASSWORD)
    await Promise.all([
      page.click('#signin_btn'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])

    await page.waitForSelector(
      'body > div.p-client_container > div > ' +
      'div.p-top_nav > div.p-top_nav__right',
      { timeout: 50 * 1000 },
    )

    await page.$eval(
      'button[data-qa="user-button"]',
      btn => btn.click(),
    )
    await page.$eval(
      'button[data-qa="main-menu-custom-status-item"]',
      btn => btn.click(),
    )

    // delete user status if exists
    const deleteUserStatusSelector = 'body > div.c-sk-modal_portal > div > div > ' +
      'div.c-sk-modal_content.p-custom_status_modal__content > div > ' +
      'div.c-scrollbar__hider > div > div > div:nth-child(1) ' +
      '> div > div > div > div.p-custom_status_modal__input_action > button'
    await page.$eval(
      deleteUserStatusSelector,
      btn => btn.click(),
    ).catch(() => console.log('📌 Empty User status → 변경 예정'))

    switch (now.weekday()) {
      // on tue, thu
      case 2:
      case 4:
        // 사무실 근무
        await page.$eval(
          'body > div.c-sk-modal_portal > div > div > ' +
          'div.c-sk-modal_content.p-custom_status_modal__content ' +
          '> div > div.c-scrollbar__hider > div > div > fieldset:nth-child(2) ' +
          '> div > div:nth-child(1) > button',
          btn => btn.click(),
        )
        console.log('📌 Set status → 사무실 근무 📶')
        break

      default:
        await page.$eval(
          'body > div.c-sk-modal_portal > div > div > ' +
          'div.c-sk-modal_content.p-custom_status_modal__content ' +
          '> div > div.c-scrollbar__hider > div > div > fieldset:nth-child(2) ' +
          '> div > div:nth-child(2) > button',
          btn => btn.click(),
        )
        console.log('📌 Set status → 재택 근무 🏡')
        break
    }

    // custom expiration setting → 다음 이후로 지우지 않음 으로 설정
    await page.$eval(
      'body > div.c-sk-modal_portal > div > div > ' +
      'div.c-sk-modal_content.p-custom_status_modal__content > div > ' +
      'div.c-scrollbar__hider > div > div > div.c-sk-modal_content_section.margin_top_75 > ' +
      'div.p-custom_status_modal__expiration_default.c-basic-select > div',
      div => div.click(),
    ).catch(err => console.log(`📌 Custom expiration setting Err: ${err}`))

    await page.waitForSelector(
      'body > div.ReactModalPortal > div > div',
      { timeout: 10 * 1000 },
    ).catch(err => console.log(`📌 Custom expiration setting Err: ${err}`))

    // no expiration 으로 설정
    await page.$eval(
      'body > div.ReactModalPortal > div > div > div > ' +
      'div > div > div > div > div:nth-child(1) > span',
      span => span.click(),
    ).catch(err => console.log(`📌 Custom expiration setting Err: ${err}`))

    // 저장
    await page.$eval(
      'body > div.c-sk-modal_portal > div > div > ' +
      'div.c-sk-modal_footer > div > ' +
      'button.c-button.c-button--primary.c-button--medium',
      btn => btn.click(),
    ).catch(() => console.log('📌 슬랙 상태가 동일 했음.'))
  } catch (e) {
    throw e
  } finally {
    console.log('📌 Done.')
    await browser.close()
  }
}

main().catch(err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
})
