
function isScalar(o) {
    return (/boolean|number|string/).test(typeof o);
};

export function propsMatch(set, subSet) {
    if(subSet === null) {
        return set === null;
    }

    if(isScalar(set)) {
        return isScalar(subSet) && set === subSet;
    }

    for(let p in subSet) {
        if(set.hasOwnProperty(p)) {
            if(!propsMatch(set[p], subSet[p])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};
