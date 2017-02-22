module.exports = function(stringifiedArr, cb) {
    var ids = JSON.parse(stringifiedArr);
    var promiseArr = [];
    for(let i = 0; i < ids.length; i++) {
        promiseArr.push(promisify(cb, ids[i]));
    }
    return promiseArr;
};


function promisify(fn,id) {
    return function() {
        return fn(id);
    }
}

