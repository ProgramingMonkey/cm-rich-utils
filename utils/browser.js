// 依赖浏览器运行的工具函数

// 1. 环境相关

// 是否运行在火狐浏览器
function InFirefox () {
    return !!document.getBoxObjectFor || 'mozInnerScreenX' in window
}

// 是否运行在Opera浏览器
function InOpera () {
    return !!window.opera && !!window.opera.toString().indexOf('Opera')
}



// 2. DOM相关

/**
 * @name     获取元素样式
 * @param    { HTMLElement }   elem          元素
 * @param    { String }        name          待获取样式名
 */
function getStyle(elem, name) {
    let val

    if (elem.currentStyle) {
        val = elem.currentStyle[name];
      
        if (name === 'height' && val.search(/px/i) !== 1) {
            let rect = elem.getBoundingClientRect();
            return rect.bottom - rect.top -
                parseFloat(getStyle(elem, 'paddingTop')) -
                parseFloat(getStyle(elem, 'paddingBottom')) + 'px';
        };
    } else {
        val = getComputedStyle(elem, null)[name];
    }

    return val
}

/**
 * @name      元素事件绑定
 * @param     { HTMLDOM }     elem          元素
 * @param     { String }      type          事件类型
 * @param     { Function }    callback      绑定函数
 */
function addEvent(elem, type, callback) {
    elem.addEventListener
        ? elem.addEventListener(type, callback, false)
        : elem.attachEvent('on' + type, callback);
}



// 3. 存储相关

/**
 * @name cookie转字符串
 * @description 将cookie对象转化为字符串
 * 示例：输入
 * {
 *    tid: "761cc83f5f34968c45cdbf4ea7670595; Domain=.yuantutech.com; Path=/",
 *    uid: "997593; Domain=.yuantutech.com; Path=/"
 * }
 * 输出："tid=761cc83f5f34968c45cdbf4ea7670595; Domain=.yuantutech.com; Path=/||uid=997593; Domain=.yuantutech.com; Path=/"
 * @param {*} cookie cookie对象
 * @param {*} splitStr 分隔符
 */
function cookieObjectToString (cookie, splitStr = '||') {
    const cookieStr = getCookieArray(cookie).join(splitStr)
    return cookieStr
  
    function getCookieArray(obj) {
      if (Array.isArray(obj)) return obj

      const cookieArray = []

      Object.entries(obj).forEach(it => {
        cookieArray.push(it.join('='))
      })

      return cookieArray
    }
}
  
/**
 * @name 通过cookie字符串写入cooie
 * @description 通过cookie字符串写入cooie
 * @param {String}   cookieStr      待写入cookie字符串
 * @param {String}   splitStr       两个cookie之间的分隔符
 * @param {Object}   cookieParams   默认额外参数，如 Domain, Path等
 * @param {Array}    allowOldKeys   使用cookie字符串里对应项的额外参数，如 Domain, Path等 (即如果cookie字符串里有，则使用字符串中的)
 * (1) Domain 域名
 * (2) Path 路径
 * @param {Boolean}  useAll         cookie是否应用全部
 */
function writeCookieByStr (
  cookieStr,
  {
      splitStr = '||',
      cookieParams = { Domain: location.hostname, Path: '/'},
      allowOldKeys = [],
      useAll = true
  } = {}
) {
  if (cookieStr) {
  let cookies = cookieStr.split(splitStr);

  cookies.forEach(
      (i) => {
          if (useAll) {
              document.cookie = i
              return
          }

          let cookie = '';
          // 参数数组
          const params = i.split('; ');
      
          cookie += params[0]; // params[0]为主参数
      
          params.slice(1).forEach(it => {
              const [key, value] = it.trim().split('=')
          
              if (allowOldKeys.includes(key) && value) {
                  cookieParams[key] = value
              }
          })
      
          Object.entries(cookieParams).forEach(it => {
              cookie += `; ${it.join('=')}`
          })
      
          document.cookie = cookie;
      })
  }
}

module.exports = {
  InFirefox,
  InOpera,
  getStyle,
  addEvent,
  cookieObjectToString,
  writeCookieByStr
}