/*
 * @Author: M_King 
 * @Date: 2017-08-17 09:56:56 
 * @Last Modified by: M_King
 * @Last Modified time: 2017-09-02 00:40:20
 */

/**
 * 扫雷
 * 
 * @param {any} options 参数
 */
function MineClearance(options) {
    options = options || {};
    //默认参数
    var defaults = {
        'wrap': document.body,
        'width': 10,
        'height': 10,
        'mine_count': 10
    };
    //参数对比
    this.settings = extend(options, defaults);

    console.log('this.settings', this.settings);

    var mine_data = randomDoubleNumber(this.settings.width, this.settings.height, this.settings.mine_count);

    var data = [];
    for (var i = 0; i < this.settings.height; i++) {
        data.push(new Array(this.settings.width).fill(' '));
    }

    //写入地雷
    mine_data.forEach(function(element) {
        data[element[1]][element[0]] = '#';
    });

    var map = [];
    for (var y = 0; y < data.length; y++) {
        var row = [];
        for (var x = 0; x < data[y].length; x++) {
            row.push(new Unit({ 'value': data[y][x], 'x': x, 'y': y }));
        }
        map.push(row);
    }

    this.data = data;
    this.map = map;
}
//生成地图
MineClearance.prototype.drawMap = function() {
    var map = this.map;
    for (var y = 0; y < map.length; y++) {
        var row = document.createElement('div');
        row.classList.add('row');
        for (var x = 0; x < map[y].length; x++) {
            row.appendChild(map[y][x].dom);
        }
        this.settings.wrap.appendChild(row);
    }
};
//显示数据
MineClearance.prototype.showData = function() {
    this.data.forEach(function(element) {
        console.log(element);
    });
};
//生成不重复的随机二维数字
function randomDoubleNumber(width, height, count) {
    var result = [],
        number = [],
        total = width * height;
    //生成数字
    for (var i = 0; i < total; i++) {
        number.push(i);
    }
    var index = number.length;
    //开始换位法随机
    for (var i = 0; i < count; i++) {
        var random = parseInt(Math.random() * index);
        index--;

        result.push(numberToVector(number[random]));
        //交换值
        [number[index], number[random]] = [number[random], number[index]];
    }
    // 数字转坐标
    function numberToVector(number) {
        return [number % width, parseInt(number / width)];
    }
    return result;
}

/**
 * 单元格对象
 * 
 * @param {any} data 单元格数据
 */
function Unit(data) {
    var unit = document.createElement('div');
    unit.classList.add('unit');
    unit.setAttribute('data-x', data.x);
    unit.setAttribute('data-y', data.y);
    var type_data = { '#': '<i class="fa fa-bug" aria-hidden="true"></i>' };
    unit.innerHTML = '<span>' + (type_data[data.value] || '') + '</span>';

    var that = this;

    //绑定事件
    unit.addEventListener('click', unitClick);
    //单元格点击方法
    function unitClick() {
        this.classList.add('show');
        that.show();
        unit.removeEventListener('click', unitClick);
    }

    this.value = data.value;
    this.dom = unit;
}

Unit.prototype.show = function() {
    console.log('unit show');
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