// 1. 数据处理

/**
 * @name 数据深拷贝
 * @description 数据深拷贝
 * @param {*} obj 待拷贝数据
 * @returns {*} 拷贝数据
 */
function cloneDeep (obj) {
    // 基本数据类型或函数
    if (typeof obj !== 'object' || obj === null) return obj
  
    const type = getDataType(obj)
  
    // Set
    if (type === 'set') {
      const result = new Set()
      obj.forEach(val => {
        result.add(cloneDeep(val))
      })
      return result
    }
  
    // Map
    if (type === 'map') {
      const result = new Map()
      obj.forEach((val, key) => {
        result.set(key, cloneDeep(val))
      })
      return result
    }
    
    // 对象 / 数组
    const result = Array.isArray(obj) ? [] : {}
  
    for (var k in obj) {
      // 只要自身属性
      if (obj.hasOwnProperty(k)) {
        result[k] = cloneDeep(obj[k])
      }
    }
  
    return result
}

/**
 * @name 两值比较
 * @param {*} obj1 值1
 * @param {*} obj2 值2
 * @returns {Boolean} true 相等 false 不等
 */
function compare (obj1, obj2) {
    const type = getDataType(obj1)
    if (type !== getDataType(obj2)) return false
  
    if (typeof obj1 !== 'object' || obj1 === null) return obj1 === obj2
  
    // Set类型, Map类型, 转化为数组
    if (type === 'set' || type === 'map') {
      obj1 = Array.from(obj1)
      obj2 = Array.from(obj2)
    }
  
    const obj1_keys = Object.keys(obj1)
    const obj2_keys = Object.keys(obj2)
    if (obj1_keys.length !== obj2_keys.length) return false
    
    return obj1_keys.every(k =>  compare(obj1[k], obj2[k]))
}

/**
 * @name 获取数据类型
 * @param {*} val 数据
 * @returns {String} 数据类型
 * boolean 布尔值,  number 数,  string 字符串,
 * undefined    ,  null     ,  array   数组,  object 对象,
 * function 函数 ,  symbol   ,  set  Set类型,  map Map类型
 */
function getDataType (val) {
  const type = Object.prototype.toString.call(val)
  return type.slice(7, -1).toLowerCase()
}

/**
 * @name 类型判断
 * @param {*} val 
 * @returns {String} base 基础数据类型, object (数组, 对象), func 函数, hash (Set, Map)
 */
function typeJudge (val) {
    const type = getDataType(val)
    const rules = {
      boolean: 'base',
      number: 'base',
      string: 'base',
      undefined: 'base',
      null: 'base',
      symbol: 'base',
      array: 'object',
      object: 'object',
      set: 'hash',
      map: 'hash',
      function: 'func'
    }
  
    return rules[type]
}


// 2. 日期处理

/**
 * @name 日期数组转化为日期字符串
 * @param   { Array }     dateArr     日期数组
 * @param   { String }    connect     连接符, 默认为 -
 * @returns { String }    日期字符串
 */
function dateArrToStr (dateArr, connect = '-') {
  let str = ''

  dateArr.forEach((data, index) => {
      if (index === 0) {
          str += data
          return
      }

      str += `${connect}${data.toString().padStart(2, '0')}`
  })

  return str
}

/**
 * @name 修改日期字符串单位并返回日期信息
 * @param { String }  dateString    日期字符串, 如'1天2小时3分钟'
 * @param { Array }   transferArr   转化规则对象数组, 注: 规则数组需与字符串顺序保持一致
 * unit       必选    转化前单位, 如天
 * unitNew    可选    转化后单位, 如day, 无需转化时, 可不填写
 * time       必选    单位时间所占毫秒数, 如 1000 * 60 * 60 * 24
 * @returns { Object }
 * dateArr      转化后的日期对象数组, { num: 数量, unit: 单位 }, 如 [{ num: 1, unit: 'day' }]
 * dateString   转化后的日期字符串, 如 '1day2hour3min'
 * tatal        总时间, 单位ms
 */
function getInfoByDateStr (dateString = '', transferArr = []) {
  let dateArr = []
  let dateStringNew = ''
  let total = 0

  transferArr.forEach(({ unit, unitNew, time }) => {
    const index = dateString.indexOf(unit)

    // 前面应有数量信息，故大于0
    if (index > 0) {
      const num = Number(dateString.slice(0, index))

      if (num) {
        total += num * time
        dateStringNew += `${ num }${ unitNew || unit }`
        dateArr.push({
          num,
          unit: unitNew || unit
        })
      }

      dateString = dateString.slice(index + unit.length)
    }
  })

  return { dateArr, dateStringNew, total }
}

// 3. 地址处理
/**
 * @name 地址参数处理
 * @param { String } url        必选    待处理地址
 * @param { Object }
 * （1）removeArr   { Array }   可选    待移除参数数组
 * （2）reserveArr  { Array }   可选    待保存参数数组
 * 注: removeArr、reserveArr 不应同时定义
 * @returns { String } 处理后地址
 */
function updateUrlParams (url, { removeArr = [], reserveArr=[] } = {}) {
  // 模式，remove 移除参数，reserve 保留参数
  const mode = removeArr.length ? 'remove' : 'reserve'
  const [ baseUrl, params ] = url.split('?')
  let newParams = ''

  params && params.split('&').forEach(v => {
      const [key] = v.split('=')

      if (mode === 'reserve') {
          reserveArr.includes(key) && reserveParam()
      } else {
          !removeArr.includes(key) && reserveParam()
      }

      function reserveParam () {
          newParams += (newParams ? '&' : '') + v
      }
  })

  newParams = newParams && `?${newParams}`

  return `${baseUrl}${newParams}`
}


// 4. 事件处理
/**
 * @name 获取设置特定规则的起始事件
 * @param   { Number }  min     最小时间间隔, 单位ms
 * @returns { Object } 
 * (1) startEvent   { Function }    开始事件, function (func) {}
 * (2) endEvent     { Function }    结束始事件, function (func) {}
 *     运行后返回值: Promise
 */
function getEventsWithRules ({ min = 0 } = {}) {
  let startTime = 0

  // 开始事件
  function startEvent (func) {
      // 设置开始时间
      startTime = dayjs()
      func && func()
  }

  // 结束事件
  function endEvent (func) {
      // 获取结束时间
      const endTime = dayjs()
      // 间隔时间
      const interval = endTime - startTime

      // 起始时间小于最小时间间隔, 最小间隔时间后触发
      if (interval < min) {
          const delay = min - interval

          return new Promise(resolve => {
              setTimeout(() => {
                  func && func()
                  resolve()
              }, delay)
          })
      } else {
          func && func()
          return Promise.resolve()
      }
  }

  return { startEvent, endEvent }
}

module.exports = {
  cloneDeep,
  compare,
  getDataType,
  typeJudge,
  dateArrToStr,
  getInfoByDateStr,
  updateUrlParams,
  getEventsWithRules
}