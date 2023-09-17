import Vue from 'vue'

Vue.prototype.$isEmpty = function(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

Vue.prototype.$sum = function(items, prop) {
  return items.reduce(function(a, b) {
    return a + b[prop]
  }, 0)
}
