import request from './request'
import md5 from 'js-md5'
import { getStorage, setStorage } from '@/utils/wechat'
var convert = require('xml-js');
const LAST_SUCCESS_LOGIN_INPUT = 'LAST_SUCCESS_LOGIN_INPUT'
const LAST_SUCCESS_LOGIN_TICKET = 'LAST_SUCCESS_LOGIN_TICKET'

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

function checkResponse(data) {
  if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {
    return 1
  } else if (data.Result.ReturnFlag._text == '2' && data.Result.ReturnMsg._text == "ticket overdue") {
    return 2
  }
}

async function getFarmList() {
  let ticket = await getStorage(LAST_SUCCESS_LOGIN_TICKET)
  console.log('ticket', ticket)
  let params = {}
  params.paramStr = JSON.stringify({ ticket: ticket.data.data.ticket })
  console.log('params', json2Form(params))
  let result = await (request.post(`/langrh/mobile/mobileFarm!loadFarms.action`, json2Form(params)))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('farmList', data)
  return data
}
async function getGatewayList({ farmId = '' } = {}) {
  let ticket = await getStorage(LAST_SUCCESS_LOGIN_TICKET)
  let params = {}
  console.log('getGatewayList', farmId)
  params.paramStr = JSON.stringify({ ticket: ticket.data.data.ticket, level: '0', nodeId: farmId })
  console.log('params', json2Form(params))
  let result = await (request.post(`/langrh/mobile/mobileGateway!loadGateway.action`, json2Form(params)))
  let data = JSON.parse(convert.xml2json(result, { compact: true }))
  console.log('getGatewayList', data)
  return data
}

async function loginWithCache() {
  let result = {}
  console('loginWithCache')
  let input = await getStorage(LAST_SUCCESS_LOGIN_INPUT)
  console('loginWithCache', input)
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
      data: { ticket: data.Result.Ticket._text },
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000
    })
    await setStorage(LAST_SUCCESS_LOGIN_INPUT, {
      data: { userName: userName, password: password },
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000
    })
    console.log('saved')
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

/**
 * 获取电影条目信息：
 *  接口地址: subject/:id
 *  要求权限：movie_basic_r
 *  可传参数：
 *    @params {number} id 电影id
 */
export function getMovieData(id) {
  return request.get(`/subject/${id}`)
}
