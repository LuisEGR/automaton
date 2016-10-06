
  function _flat(target, opts) {
    opts = opts || {}

    var delimiter = opts.delimiter || '→'
    var maxDepth = opts.maxDepth
    var output = {}

    function step(object, prev, currentDepth) {
      currentDepth = currentDepth ? currentDepth : 1
      Object.keys(object).forEach(function(key) {
        var value = object[key]
        var isarray = Array.isArray(value)
        var type = Object.prototype.toString.call(value)

        var isobject = (
          type === "[object Object]" ||
          type === "[object Array]"
        )

        var newKey = prev
          ? prev + delimiter + key
          : key

        if (!isarray && isobject && Object.keys(value).length) {
          return step(value, newKey, currentDepth + 1)
        }

        output[newKey] = value
      })
    }

    step(target)

    return output
  }
