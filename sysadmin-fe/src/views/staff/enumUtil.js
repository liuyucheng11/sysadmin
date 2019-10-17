const enumMap = new Map([
    [
        'status',
        [
            {
                key: 0,
                value: "无效"
            },
            {
                key: 1,
                value: "有效"
            }
        ]
    ],
    [
        'sex',
        [
            {
                key: 0,
                value: "女"
            },
            {
                key: 1,
                value: "男"
            }
        ]
    ],
    [
        'selectIsLeft',
        [
            {
                key: 1,
                value: "离职"

            },
            {
                key: 0,
                value: "在职"
            },
            {
                key: 3,
                value: "全部"
            }
        ]
    ],
    [
        'isLeft',
        [
            {
                key: 1,
                value: "是"

            },
            {
                key: 0,
                value: "否"
            },
        ]
    ]
])

/**
 *                                      KEY                 VALUE                              ENTRY            
 * 遍历enum数组A，通过get(type)（sex,status,isLeft）确定遍历的数组对象B，entries返回数组对象B中各对象数据C
 */ 
export const getDictName = (type, code) => {
    if (enumMap.get(type)) {
        for (let [i, entry] of enumMap.get(type).entries()) {
            if (entry.key === code) {
                return entry.value;
            }
        }
    }
}

/**
 *                KEY                 VALUE
 * 通过type（sex,status,isLeft） 获取数组对象
 */ 
export const getEnum = (type) => {
    if (enumMap.get(type)) return enumMap.get(type)
}
