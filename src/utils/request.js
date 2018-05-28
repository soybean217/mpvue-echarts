import wx from 'wx'
import Fly from 'flyio'

const request = new Fly()

request.config.timeout = 10 * 1000
request.config.baseURL = 'http://wlwhkq.loongk.com:8080' 

request.interceptors.request.use((request) => {
  wx.showLoading({ title: '联网中...' })
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideLoading()
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideLoading()
    wx.showToast({
      title: err.message,
      icon: 'none'
    })
    return promise.resolve()
  }
)

export default request
