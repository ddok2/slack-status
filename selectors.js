module.exports = {
  email: '#email',

  password: '#password',

  signinButton: '#signin_btn',

  bodyContainer: 'body > div.p-client_container > div',

  userButton: 'button[data-qa="user-button"]',

  statusListButton: 'button[data-qa="main-menu-custom-status-item"]',

  removeUserStatusButton: 'body > div.c-sk-modal_portal > div > div > ' +
    'div.c-sk-modal_content.p-custom_status_modal__content > div > ' +
    'div.c-scrollbar__hider > div > div > div:nth-child(1) ' +
    '> div > div > div > div.p-custom_status_modal__input_action > button',

  workAtOfficeButton: 'body > div.c-sk-modal_portal > div > div > ' +
    'div.c-sk-modal_content.p-custom_status_modal__content ' +
    '> div > div.c-scrollbar__hider > div > div > fieldset:nth-child(2) ' +
    '> div > div:nth-child(1) > button',

  workAtHomeButton: 'body > div.c-sk-modal_portal > div > div > ' +
    'div.c-sk-modal_content.p-custom_status_modal__content ' +
    '> div > div.c-scrollbar__hider > div > div > fieldset:nth-child(2) ' +
    '> div > div:nth-child(2) > button',

  saveButton: 'body > div.c-sk-modal_portal > div > div > ' +
    'div.c-sk-modal_footer > div > ' +
    'button.c-button.c-button--primary.c-button--medium',
}
