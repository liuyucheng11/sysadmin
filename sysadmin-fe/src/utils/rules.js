var QQV = (rule, value, callback) => {
    debugger
    if (value === '') {
        callback(new Error('输入QQ号'))
    } else if (/^[1-9][0-9]{4,10}$/.test(value)) {
        callback()
    } else {
        callback(new Error('输入正确的QQ号'))
    }
}

// 类似金钱,首位不为0,最多2位小数
export function checkNumPot2(rule, value, callback) {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    if (!value) {
        return callback(new Error('请填写数字'))
    } else if (!reg.test(value)) {
        return callback(new Error('请填写数字,最多2位小数'))
    } else {
        callback()
    }
}

// 身份证
export function checkIdNum(rule, value, callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!value) {
        return callback(new Error('证件号码不能为空'))
    } else if (!reg.test(value)) {
        return callback(new Error('证件号码不正确'))
    } else {
        callback()
    }
}

// 整数
export function checkInterNum(rule, value, callback) {
    const reg = /^[0-9]*[1-9][0-9]*$/
    if (!value) {
        return callback(new Error('请填写整数'))
    } else if (!reg.test(value)) {
        return callback(new Error('请输入整数'))
    } else {
        callback()
    }
}

export default {
    // QQTrue: [{ required: true, validator: QQV, trigger: 'blur' }],
    phoneTrue: [
        { required: true, message: " 必填", trigger: 'blur' },
        { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: "blur"},
        { min: 11, max: 11, message: " 手机号为11位", trigger: "blur" }
    ],
    NumberTrue: [
        { required: true, validator: checkInterNum, trigger: 'blur' },
        { min: 1, max: 20, message: " 编号长度为1-20位", trigger: "blur" }
    ],
    nameTrue: [
        { required: true, message: " 必填", trigger: 'blur' },
        { min: 1, max: 30, message: "姓名长度为1-30位", trigger: "blur" }
    ],
    requiredTrue:[
        { required: true, message: " 必填", trigger: "change" }
    ],

    // QQFalse: [{ required: false, validator: QQV, trigger: 'blur' }],
    emailFalse: [
        { required: false, message: " 必填", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        { min: 1, max: 30, message: "邮箱长度为1-30位", trigger: "blur" }
    ],
    remark:[
        { required: false, trigger: "change" },
        { min: 1, max: 200, message: "备注长度为1-200", trigger: "blur" }
    ]

}
