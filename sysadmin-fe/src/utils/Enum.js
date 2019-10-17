export class Enum {
  /**
   * 添加枚举字段
   * field: 枚举字段
   * label: 界面显示
   * value: 枚举值
   */
  add(field, label, value) {
    this[field] = { field, label, value }
    return this
  }

  /**
   * 根据枚举value获取其label
   */
  getLabelByValue(value) {
    // 字段不存在返回‘’
    if (value === undefined || value === null) {
      return ''
    }
    for (const i in this) {
      const e = this[i]
      if (e && e.value === value) {
        return e.label
      }
    }

    return ''
  }

  getValueByFiledName(filedName) {
    // 字段不存在返回‘’
    if (filedName === undefined || filedName === null) {
      return ''
    }
    if (this[filedName]) {
      return this[filedName].value
    }
  }

  getFieldByValue(value) {
    if (value === undefined || value === null) {
      return null
    }
    for (const i in this) {
      const e = this[i]
      if (e && e.value === value) {
        return e.field
      }
    }
  }

  getEnumList() {
    let enumList = []
    for (const i in this) {
      const e = this[i]
      const f = {
        label: e.label,
        value: e.value
      }
      enumList.push(f)
    }
    return enumList
  }
}
