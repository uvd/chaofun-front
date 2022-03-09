import { ElMessageBox as MessageBox } from 'element-plus'
import piexif from 'piexifjs'

const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export default (file, $createElement) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      try {
        const exif = piexif.load(reader.result)

        if (Object.keys(exif.GPS).length > 0) {
          console.log(exif.GPS)
          console.log(piexif.GPSIFD.GPSLatitude)
          const lng = exif.GPS[piexif.GPSIFD.GPSLongitude]
          const lngRef = exif.GPS[piexif.GPSIFD.GPSLongitudeRef]
          const lat = exif.GPS[piexif.GPSIFD.GPSLatitude]
          const latRef = exif.GPS[piexif.GPSIFD.GPSLongitudeRef]
          // 检测成功，提示
          if (lat && latRef && lng && lngRef) {
            const realLng = piexif.GPSHelper.dmsRationalToDeg(lng, lngRef)
            const realLat = piexif.GPSHelper.dmsRationalToDeg(lat, latRef)
            const h = $createElement
            const content = h('div', null, [
              h(
                'div',
                {
                  class: 'msg-lnglat-box',
                },
                [
                  h('p', null, ['经度：', h('strong', null, realLng)]),
                  h('p', null, ['纬度：', h('strong', null, realLat)]),
                ]
              ),
              h(
                'p',
                null,
                '请注意保护您的个人隐私。在您选择之前，我们将不会上传照片'
              ),
              h('p', null, '如需取消上传，请点击右上角关闭按钮或空白处！'),
            ])

            let result = false
            MessageBox({
              title: '您的照片含有GPS定位信息，是否需要清除？',
              message: content,
              showCancelButton: true,
              confirmButtonText: '清除并上传',
              cancelButtonText: '保留并上传',
              distinguishCancelAndClose: true,
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  result = dataURLtoFile(
                    piexif.remove(reader.result),
                    file.name
                  )
                } else if (action === 'cancel') {
                  result = true
                } else if (action === 'close') {
                  result = false
                }
                done()
              },
            })
              .then(() => {
                resolve.log(result)
              })
              .catch(() => {
                resolve(result)
              })
          }
          return
        }
      } catch (error) {
        console.log(error)
      }

      // 通过检测
      resolve(true)
    }
  })
}
