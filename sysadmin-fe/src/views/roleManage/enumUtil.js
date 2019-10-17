const enumMap = new Map([
  [
    'status',[{
    key: 0,
    value: "无效"
    },
    {
      key: 1,
      value: "有效"
    }]
  ]
])

export const getDictName = (type, code) => {
  if(enumMap.get(type)){
    for(let[i, entry] of enumMap.get(type).entries()){
      if(entry.key === code){
        return entry.value;
      }
    }
  }
}

