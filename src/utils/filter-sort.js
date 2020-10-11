export const sortBy = (datas, keys) => {
    var newDatas = [];
    if (keys.length === 1) {
        const key = keys[0];
        datas.sort((a, b) => {
            return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
        });
        newDatas = datas;
    } else if (keys.length === 2) {
        const key = keys[1];
        newDatas = datas.map((data, i) => {
            data.sort((a, b) => {
                return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
            });
            return data;
        });
    }
    return newDatas;
};

// Lebih basic
export const sortByMultiple = (datas, keys) => {
    keys.forEach((key) => {
        datas.sort((a, b) => {
            return a[key.keyName] > b[key.keyName]
                ? 1
                : b[key.keyName] > a[key.keyName]
                ? -1
                : 0;
        });
    });
    return datas;
};

//Lebih basic
export const filterByMultiple = (datas, keyvals) => {
    var newDatas = [];
    keyvals.forEach((keyval, i) => {
        newDatas.splice(
            -1,
            0,
            datas.filter((data) => {
                return data[keyval.key].includes(keyval.value);
            })
        );
    });
    return newDatas;
};

export const filterBy = (datas, keys, keyword) => {
    var newDatas = [];
    if (keys.length === 1) {
        const key = keys[0];
        newDatas = datas.filter((data) => {
            return data[key] == keyword;
        });
        newDatas = datas;
    } else if (keys.length === 2) {
        const key = keys[1];
        newDatas = datas.map((data, i) => {
            data.filter((data) => {
                return data[key] == keyword;
            });
            return data;
        });
    }

    return newDatas;
};
