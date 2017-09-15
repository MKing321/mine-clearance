/*
 * @Author: M_King 
 * @Date: 2017-08-17 09:56:56 
 * @Last Modified by: M_King
 * @Last Modified time: 2017-09-01 16:39:06
 */

function MineClearance(options) {
    options = options || {};
    //默认参数
    var defaults = {
        'width': 10,
        'height': 10,
        'mine_count': 10
    };
    //参数对比
    this.settings = extend(options, defaults);

    console.log('this.settings', this.settings);

    var mine_data = randomDoubleNumber2(this.settings.width, this.settings.height, this.settings.mine_count);

    console.log('mine_data', mine_data);

    var maps = [];
    for (var i = 0; i < this.settings.height; i++) {
        maps.push(new Array(this.settings.width).fill(' '));
    }

    mine_data.forEach(function(element) {
        maps[element[1]][element[0]] = '#';
    });

    maps.forEach(function(element) {
        console.log(element);
    });
}

function randomDoubleNumber2(width, height, count) {
    var result = [];
    var number = [];
    var total = width * height;

    for (var i = 0; i < total; i++) {
        number.push(i);
    }

    var index = number.length;

    for (var i = 0; i < count; i++) {
        var random = parseInt(Math.random() * index);
        index--;

        result.push(number[random]);

        [number[index], number[random]] = [number[random], number[index]];
    }

    console.log('result', result, count);


    // 数字转坐标
    function numberToVector(number) {
        return [number % width, parseInt(number / width)];
    }

    return result;

}


function randomDoubleNumber(width, height, count) {
    var result = [],
        col = [],
        row = [],
        row_data = {};
    for (var i = 0; i < width; i++) {
        col.push(i);
    }

    for (var i = 0; i < height; i++) {
        row.push(i);
        row_data[i] = { 'array': col.concat([]), 'index': width };
    }
    var row_index = row.length;
    for (var i = 0; i < count; i++) {
        var y = row[parseInt(Math.random() * row_index)];

        var array = row_data[y].array;

        var random = parseInt(Math.random() * row_data[y].index);

        var x = row_data[y].array[random];

        row_data[y].index--;

        var last = array[row_data[y].index];

        array[array.index] = x;
        array[random] = last;

        if (row_data[y].index < 1) {
            row_index--;
            var last_row = row[row_index];
            row[row_index] = row[y];
            row[y] = last_row;
        }

        if (typeof x == 'undefined') {
            debugger;
        }

        // console.log('x', x, 'y', y, 'random', random);

        result.push([x, y]);
    }

    // console.log('row', row, row_index);

    return result;
}

function Unit(data) {
    var unit = document.createElement('div');
    unit.classList.add('unit');
}

/**
 * 参数对比
 * 
 * @param {any} data 参数
 * @param {any} defaults 默认值
 * @param {array} exception 例外：['data']
 * @returns 
 */
function extend(data, defaults, exception) {
    exception = exception || [];
    var result = {};
    for (var k in defaults) {
        if (!defaults.hasOwnProperty(k)) {
            continue;
        }
        if (typeof data[k] == 'undefined') {
            result[k] = defaults[k];
        } else if (exception.indexOf(k) > -1) {
            result[k] = data[k];
        } else if (typeof data[k] == 'object' && !(data[k] instanceof Array) && !(data[k] instanceof HTMLElement)) {
            result[k] = extend(data[k], defaults[k]);
        } else {
            result[k] = data[k];
        }
    }
    return result;
}