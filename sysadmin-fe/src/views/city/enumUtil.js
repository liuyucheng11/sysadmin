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
   ],
  [
    'type',[{
    key: 1,
    value: "省份"

    },
    {
      key: 2,
      value: "城市"
    },
    {
    key: 3,
    value: "区县"
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

export const getEnum = (type) => {
  if(enumMap.get(type)) return enumMap.get(type)
}
