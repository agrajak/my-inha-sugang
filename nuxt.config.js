module.exports = {
  head: {
    title: '인하대 시간표 생성기',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '원하는 시간표를 만들어드립니다.' }
    ],
    link: [
        {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css'}
    ],
  },
  router: {
    base: '/my-inha-sugang/'
  }
}