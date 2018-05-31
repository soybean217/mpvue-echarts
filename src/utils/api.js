import request from './request'
import md5 from 'js-md5'
import { getStorage, setStorage } from '@/utils/wechat'
var convert = require('xml-js');
const LAST_SUCCESS_LOGIN_INPUT = 'LAST_SUCCESS_LOGIN_INPUT'
const LAST_SUCCESS_LOGIN_TICKET = 'LAST_SUCCESS_LOGIN_TICKET'
const GATEWAY_CONFIG_PREFIX = 'GC_'

export function userLogin({ userName = '测试账户', password = '888888' } = {}) {
  // var formData = new FormData();
  // formData.append('account',userName)
  // formData.append('Password',md5(password))
  // let params = {}
  // params.account = userName
  // // params.Password = password
  // params.Password = md5(password)
  // console.log('params', json2Form(params))
  // return request.post(`/langrh/mobile/mobile!login.action`, json2Form(params))
  return login({ userName: userName, password: password })
}
export async function farmList() {
  // var formData = new FormData();
  // formData.append('account',userName)
  // formData.append('Password',md5(password))
  let data = await getFarmList()
  if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {
    return data
  } else if (data.Result.ReturnFlag._text == '2' && data.Result.ReturnMsg._text == "ticket overdue") {
    console.log('ticket overdue')
    let r = await loginWithCache()
  }
  console.log('ticket overdue')
}
export async function gatewayList({ farmId = '' } = {}) {
  // var formData = new FormData();
  // formData.append('account',userName)
  // formData.append('Password',md5(password))
  let data = await getGatewayList(arguments[0])
  let check = checkResponse(data)
  if (check == 1) {
    return data
  } else if (check == 2) {
    console.log('ticket overdue')
    let r = await loginWithCache()
  }
}
// export async function gatewayConfig({ gatewayId = '' } = {}) {
//   let data = await getGatewayConfig(arguments[0])
//   let check = checkResponse(data)
//   if (check == 1) {
//     return data
//   } else if (check == 2) {
//     console.log('ticket overdue')
//     let r = await loginWithCache()
//   }
// }
export async function gatewayDetail({ gatewayId = '' } = {}) {
  let data = await getGatewayDetail(arguments[0])
  let check = checkResponse(data)
  if (check == 1) {
    return data
  } else if (check == 2) {
    console.log('ticket overdue')
    let r = await loginWithCache()
  }
}
export async function syncGatewaysConfig({ gateways = [] } = {}) {
  console.log('syncGatewaysConfig')
  for (var gateway of gateways) {
    console.log('syncGatewaysConfig', gateway)
    cacheGatewayConfig({ gateway: gateway })
  }
}
export async function checkLoginStatus() {

}


async function getGatewayDetail({ gatewayId = '' } = {}) {
  console.log('getGatewayDetail', gatewayId)
  let ticket = getLastSuccessTicket()
  let params = {}
  params.ticket = ticket.data.ticket
  params.gatewayid = gatewayId
  let result = await (request.post(`/langrh/mobile/mobile!getShackStatusAndDatas.action`, json2Form(params)))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('getGatewayDetail', data)
  return data
}
async function cacheGatewayConfig({ gateway = {} } = {}) {
  try {
    var cache = wx.getStorageSync(GATEWAY_CONFIG_PREFIX + gateway._attributes.Id)
    if (cache) {
      console.log('value', cache)
      if (cache._attributes.Version != gateway._attributes.Version) {
        let tmp = await getGatewayConfig({ gatewayId: gateway._attributes.Id })
        return tmp
      } else {
        return cache
      }
    }
  } catch (e) {
    console.log('catch', e)
  }
}
async function initGatewaysConfig() {
  await setStorage(GATEWAY_CONFIG_PREFIX, {
    data: {},
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000
  })
  console.log('initGatewaysConfig saved')
}
async function getGatewayConfig({ gatewayId = '' } = {}) {
  let ticket = getLastSuccessTicket()
  let params = {}
  params.ticket = ticket.data.ticket
  params.gatewayid = gatewayId
  let result = await (request.post(`/langrh/mobile/mobile!config.action`, json2Form(params)))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('getGatewayConfig', data)
  try {
    wx.setStorageSync(GATEWAY_CONFIG_PREFIX + data.Result.Gateway._attributes.Id, data.Result.Gateway)
  } catch (e) {
    console.log(e)
  }
  return data.Result.Gateway
}

function checkResponse(data) {
  if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {
    return 1
  } else if (data.Result.ReturnFlag._text == '2' && data.Result.ReturnMsg._text == "ticket overdue") {
    return 2
  }
}

async function getFarmList() {
  let ticket = getLastSuccessTicket()
  console.log('getFarmList')
  let params = {}
  params.paramStr = JSON.stringify({ ticket: ticket.data.ticket })
  let result = await request.post(`/langrh/mobile/mobileFarm!loadFarms.action`, json2Form(params))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('farmList', data)
  return data
}
async function getGatewayList({ farmId = '' } = {}) {
  let ticket = getLastSuccessTicket()
  let params = {}
  console.log('getGatewayList', farmId)
  params.paramStr = JSON.stringify({ ticket: ticket.data.ticket, level: '0', nodeId: farmId })
  let result = await (request.post(`/langrh/mobile/mobileGateway!loadGateway.action`, json2Form(params)))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('getGatewayList', data)
  return data
}

function getLastSuccessTicket() {
  try {
    let value = wx.getStorageSync(LAST_SUCCESS_LOGIN_TICKET)
    if (value) {
      return value
    } else {
      loginWithCache()
    }
  } catch (e) {
    console.log('getLastSuccessTicket catch', e)
    loginWithCache()
  }
}


async function loginWithCache() {
  try {
    let value = wx.getStorageSync(LAST_SUCCESS_LOGIN_INPUT)
    console.log('loginWithCache', value)
    if (value) {
      return value
    } else {
      login()
    }
  } catch (e) {
    console.log('loginWithCache catch', e)
  }
  return result
}

async function login({ userName = '测试账户', password = '888888' } = {}) {
  let params = {}
  params.account = userName
  // params.Password = password
  params.Password = md5(password)
  let result = await request.post(`/langrh/mobile/mobile!login.action`, json2Form(params))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('login', data)
  if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {
    await setStorage(LAST_SUCCESS_LOGIN_TICKET, {
      data: { ticket: data.Result.Ticket._text }
    })
    await setStorage(LAST_SUCCESS_LOGIN_INPUT, {
      userName: userName,
      password: password
    })
    console.log('saved')
    return data.Result.Ticket._text
  } else {

  }
  return data
}

function json2Form(json) {

  var str = [];

  for (var p in json) {

    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));

  }

  return str.join("&");

}
