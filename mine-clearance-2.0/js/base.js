/*
 * @Author: M_King 
 * @Date: 2017-08-17 09:56:43 
 * @Last Modified by: M_King
 * @Last Modified time: 2017-08-28 10:40:47
 */

/*
	方法介绍：
	mobileModel: 移动端基础效果
	getDateDiff: 计算时间差
	tipShow: 显示弹窗
	tipHide: 隐藏弹窗
	ajaxSubmit: ajax提交数据
	getUrlParam: 获取url参数
	activityLink: 添加活动链接
    unique: 数组去重
    randomString: 生成不重复随机字符串
*/

//移动端基础效果
function mobileModel() {
    var winwidth = $(window).width(); //获取窗口宽度
    winwidth = winwidth > 750 ? 750 : winwidth; //判断窗口宽度
    //设置基础字体大小
    $("body,html").css({
        "font-size": winwidth / 30,
        width: winwidth,
        margin: "0 auto"
    });
}

/**
 * 计算时间差
 * 
 * @param {any} startDate 开始时间 (格式：2015-10-10)
 * @param {any} endDate 结束时间 (格式：2015-10-10)
 * @returns 时间差
 */
function getDateDiff(startDate, endDate) {
    //获取时间
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    //计算时间差
    var dates = Math.abs(endTime - startTime) / (1000 * 60 * 60 * 24);
    //返回时间差
    if (startTime > endTime) {
        return -Math.ceil(dates);
    } else {
        return Math.ceil(dates);
    }
}

/**
 * 显示弹窗
 * 
 * @param {any} parm 弹窗参数
 */
function tipShow(parm) {
    /*
        参数说明
        content：弹窗内容
        notClose：是否可关闭，false不可关闭，true可关闭，默认为true
      */
    //初始化参数
    var content = parm[content] || "请输入弹窗内容！"; //初始化内容
    var notClose = parm[notClose] == true ? true : false; //初始化是否关闭

    //如果弹窗不存在，则输出弹窗
    if (!$(".popup_wrap").length) {
        tipStart();
    }
    var $popup = $(".popup_wrap"); //获取弹窗对象
    var $popup_bg = $popup.find(".popup_content"); //获取弹窗背景对象
    var $popup_content = $popup.find(".popup_box"); //获取弹窗内容
    var $popup_close = $popup.find('.popup_close');
    $popup.height($(window).height());

    $popup.hide();
    $popup_content.html(content); //设置弹窗内容
    $popup.show(); //显示弹窗

    //判断是否可关闭
    if (!notClose) {
        $popup_close.show();
        //点击背景关闭
        $popup_bg.on("click", function() {
            tipHide(); //隐藏弹窗
        });
    }
}
//隐藏弹窗
function tipHide() {
    $(".popup_wrap").hide(); //隐藏弹窗
    $(".popup_wrap .popup_content .popup_box").html(""); //清空内容
}
//初始化弹窗
function tipStart() {
    //设置弹窗层
    var temp =
        '<div class="popup_wrap"><div class="popup_bg"></div><div class="popup_content"><div><div class="popup_box"></div></div></div></div>';
    //输出弹窗
    $("body").append(temp);
}

//ajax提交数据
/*
	参数说明
	form：要提交的表单
*/
function ajaxSubmit(form) {
    $.ajax({
        url: "join",
        type: "POST",
        dataType: "json",
        async: false,
        data: form.serialize(),
        beforeSend: function() {
            //提交前
            tipShow({
                content: "正在提交，请稍后...",
                closed: true
            });
        },
        success: function(data) {
            //提交成功
            tipShow({
                content: "提交成功"
            });
        },
        error: function(msg) {
            //提交失败
            tipShow({
                content: "提交失败，请重试"
            });
        }
    });
}

//获取url参数
/*
	参数说明
	value：获取的参数
*/
function getUrlParam(value) {
    var regexp = new RegExp("(^|&)" + value + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(regexp);
    if (result !== null) return unescape(result[2]);
    return null;
}

//表单验证
/*
	参数说明
	from：验证的表单
	error：错误函数
	success：成功函数
	post:提交函数
*/
function verification(form, error, success, post) {
    //类名数组
    /* is_user:用户名,is_qq:QQ号,is_tell:固话号码,is_mobile:手机号码,is_id:身份证号码,is_email:邮箱,is_pass:密码,is_bank:银行卡,is_num:纯数字,is_ch:纯中文,is_ip:IP*/
    var name = [
        "is_name",
        "is_qq",
        "is_tell",
        "is_mobile",
        "is_id",
        "is_email",
        "is_pass",
        "is_bank",
        "is_num",
        "is_ch",
        "is_empty"
    ];
    //正则表达式数组
    var regex = [
        /[^a-zA-Z0-9]/,
        /^\d{5,11}$/,
        /^0\d{2,3}-{0,1}\d{7,8}$|^\d{7,8}$/,
        /((1[34578][0-9]{1}))\d{8}/,
        /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        /\d+[a-zA-Z]+|[a-zA-Z]+\d+/,
        /^\d{19}$|^\d{12}$|^\d{16}$/,
        /[^0-9]/,
        /[\u4E00-\u9FFF]/,
        /[\u4E00-\u9FFF]/
    ];
    //反向数组
    var rev = [0, 8];
    //获取要验证的对象
    var obj = $("[ver]");
    //ver转换成验证序号
    for (i = 0; i < obj.length; i++) {
        for (j = 0; j < name.length; j++) {
            if (name[j] == obj.eq(i).attr("ver")) {
                obj.eq(i).attr("ver", j);
                break;
            }
        }
    }
    //失去焦点
    obj.bind("blur", function() {
        var val = $(this).val(); //获取当前对象value
        var dat = $(this).attr("ver"); //获取当前对象ver
        //判断value是否为空
        if (val === "") {
            error(this);
            return false;
        }
        //正则验证
        if (test(val, dat)) {
            success(this);
        } else {
            error(this);
        }
    });
    //测试方法
    function test(value, num) {
        var temp = regex[num].test(value); //验证正则表达式
        //判断取反
        for (i = 0; i < rev.length; i++) {
            if (num == rev[i]) {
                temp = !temp;
                break;
            }
        }
        //判断对错
        if (temp) {
            return true;
        } else {
            return false;
        }
    }
    //提交
    form.bind("submit", function() {
        var t = $(this).find("[ver]");
        t.blur(); //触发失去焦点事件
        var err = $(this).find("[error='on']");
        if (err.length) {
            err.eq(0).blur();
        } else {
            //提交
            post();
            return true;
        }
        return false;
    });
}

/**
 * 生成不重复随机字符串
 * 
 * @param {number} count 数量
 * @returns 随机字符串数组
 */
function randomString(count) {
    var array = [];
    for (var i = 0; i < count; i++) {
        var n = "n" + Math.random().toString(36).substr(2, 7);
        //判断生成的字符串是否重复
        if (array.indexOf(n) === -1) {
            array.push(n);
        } else {
            i--;
        }
    }
    return array;
}

/**
 * 删除数组子元素
 * 
 * @param {any} value 要删除的值 (多个值则以数组传递)
 * @param {boolean} all 是否删除全部
 * @returns 删除后的数组
 */
Array.prototype.remove = function(value, all) {
    all = all | false; //参数设置默认值

    var array = this;
    //删除元素
    function removeElement(element) {
        var index = array.indexOf(element);
        while (index !== -1) {
            array.splice(index, 1);
            if (!all) {
                break;
            }
            index = array.indexOf(element);
        }
    }
    //判断参数是否为数组
    if (Array.isArray(value)) {
        value.forEach(function(element) {
            console.log("element", element);
            removeElement(element);
        });
    } else {
        removeElement(value);
    }

    return array;
};

// 数组克隆
Array.prototype.clone = function() {
    return [].concat(this);
};

// 数组去重
Array.prototype.unique = function() {
    var result = [];
    this.forEach(function(element) {
        if (result.indexOf(element) === -1) {
            result.push(element);
        }
    });
    return result;
};

// 数组乱序
Array.prototype.random = function() {
    var array = this.clone(),
        result = [];
    for (var i = array.length; i > 0; i--) {
        var index = parseInt(Math.random() * array.length);
        result.push(array[index]);
        array.remove(array[index]);
    }
    return result;
};
/**
 * 写入样式
 * 
 * @param {any} name 样式名 (可用object)
 * @param {any} value 样式值 (样式名为object时，可不传该值)
 */
HTMLElement.prototype.setStyle = function(name, value) {
    if (typeof name === "object") {
        for (var i in name) {
            this.style[i] = name[i];
        }
    } else {
        this.style[name] = value;
    }
};

/**
 * 获取样式值
 * 
 * @param {string} name 样式名
 * @returns 样式值
 */
HTMLElement.prototype.getStyle = function(name) {
    const win = this.ownerDocument.defaultView;
    return win.getComputedStyle(this, null)[name];
};

HTMLElement.prototype.getHTML = function() {
    return this.innerHTML;
};
HTMLElement.prototype.setHTML = function(html) {
    this.innerHTML = html;
};

//统计代码的运行时间
function Running(action) {
    var start = Date.now();
    action();
    console.log("Runing time", Date.now() - start + "ms");
}

//统计代码的运行时间
function Running(action) {
    var start = Date.now();
    action();
    console.log("Runing time", Date.now() - start + "ms");
}