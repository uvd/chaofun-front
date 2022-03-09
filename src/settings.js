module.exports = {
  title: '炒饭 - 世界那么大',
  logo: 'https://i.chao.fun/biz/08a2d3a676f4f520cb99910496e48b4e.png',
  styles: {
    // type 'open-close'
    navbarStyle: {
      type: 'open',
      background: 'rgba(255,255,255)',
      // opacity: .8,
      // backgroundImage: 'url("http://pic.vjshi.com/2018-12-15/cca8e23f5a35e6c83932224c00eb336c/00001.jpg?x-oss-process=style/watermark")',
      // backgroundImage: '-webkit-linear-gradient(top, rgba(255, 255, 255, 0.1) 0%, rgba(201, 12, 12, 0.1) 40%, rgba(196, 51, 51, 0.2) 98%, #FFFFFF 100%)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      fontColor: {
        color: '#fff !important',
      },
    },
    sidebarStyle: {
      type: 'close',
      background: 'rgba(255,255,255,0.8)',
      // backgroundImage: '-webkit-linear-gradient(top, rgba(255, 255, 255, 0.1) 0%, rgba(201, 12, 12, 0.1) 40%, rgba(196, 51, 51, 0.2) 98%, #FFFFFF 100%)',
      // opacity: .6,
      // backgroundImage: 'url("https://img.tukuppt.com//ad_preview/00/12/53/5dc3d33980758.jpg!/fw/980")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      fontColor: {
        color: '#fff !important',
      },
    },
    contentStyle: {
      type: 'open',
      background: '#f7f7f7',
      opacity: 1,
      // backgroundImage: 'url("https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3250306861,1149128633&fm=15&gp=0.jpg")',
      // backgroundRepeat: 'repeat',
      // backgroundPosition: 'center',
      // backgroundSize: 'cover',
      fontColor: {
        color: '#fff !important',
      },
    },
    bodyStyle: {
      type: 'close',
      backgroundImage:
        'url("https://img.tukuppt.com//ad_preview/00/12/53/5dc3d33980758.jpg!/fw/980")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
  },
  theme: {
    backgroundColor: 'pink',
    backgroundImage: 'url("")',
    theme: '',
  },

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
}
