import { Enum } from '../../utils/Enum';

export default {
    sex: new Enum().add('female','女',0).add('male','男',1).add('all','未知',2),
    isLeft: new Enum().add('no','否',0).add('yes','是',1).add('all','全部',2)
}