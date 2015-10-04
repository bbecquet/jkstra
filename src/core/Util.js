
jKstra.Util = {
  // taken as-is from Leaflet
  extend: function (dest) { // (Object[, Object, ...]) ->
    var sources = Array.prototype.slice.call(arguments, 1),
        i, j, len, src;

    for (j = 0, len = sources.length; j < len; j++) {
      src = sources[j] || {};
      for (i in src) {
        if (src.hasOwnProperty(i)) {
          dest[i] = src[i];
        }
      }
    }
    return dest;
  },

  isScalar: function(o) {
    return (/boolean|number|string/).test(typeof o);
  },

  propsMatch: function(set, subSet) {
    if(subSet == null) {
      return set == null;
    }

    if(jKstra.Util.isScalar(set)) {
      return jKstra.Util.isScalar(subSet) && set === subSet;
    }

    var match = true;
    for(var p in subSet) {
      if(set.hasOwnProperty(p)) {
        if(!jKstra.Util.propsMatch(set[p], subSet[p]))
          return false;
      } else
        return false;
    }
    return match;
  }
}
