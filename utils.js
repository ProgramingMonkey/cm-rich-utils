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
 * boolean 布尔值, number 数, string 字符串,
 * undefined, null, array 数组, object 对象,
 * function 函数, symbol, set Set类型, map Map类型
 */
function getDataType (val) {
    const rules = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Array]': 'array',
      '[object Object]': 'object',
      '[object Function]': 'function',
      '[object Symbol]': 'symbol',
      '[object Set]': 'set',
      '[object Map]': 'map'
    }
  
    return rules[Object.prototype.toString.call(val)]
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

module.exports = {
  cloneDeep,
  compare,
  getDataType,
  typeJudge
}