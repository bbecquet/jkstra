
// taken as-is from Leaflet
// TODO: replace by Object.assign
export function extend(dest) { // (Object[, Object, ...]) ->
    let sources = Array.prototype.slice.call(arguments, 1),
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
};

function isScalar(o) {
    return (/boolean|number|string/).test(typeof o);
};

export function propsMatch(set, subSet) {
    if(subSet == null) {
        return set == null;
    }

    if(isScalar(set)) {
        return isScalar(subSet) && set === subSet;
    }

    let match = true;
    for(let p in subSet) {
        if(set.hasOwnProperty(p)) {
            if(!propsMatch(set[p], subSet[p])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return match;
};
