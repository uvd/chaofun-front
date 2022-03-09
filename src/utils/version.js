import axios from 'axios'
// 版本检查
const version = async () => {
  const timestamp = Date.now()
  const res = await axios.get(`./config.json?t=${timestamp}`)
  console.log('// 版本检查--')
  console.log(res)
  const oldVersion = localStorage.getItem('BBCC_Version')
  if (res && res.data && res.data.version) {
    const VERSION = res.data.version
    if (!oldVersion) localStorage.setItem('BBCC_Version', VERSION)
    else if (VERSION !== oldVersion) {
      localStorage.setItem('BBCC_Version', VERSION)
      location.reload()
    }
  }
}

module.exports = { version }
