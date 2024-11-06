import { Input } from 'antd';
import { Flexbox } from 'react-layout-kit';

import Chat from '../Chat';

const ThreadBody = () => {
  return (
    <Flexbox flex={1}>
      <Flexbox paddingInline={12}>
        <Input placeholder={'在这里输入子话题名称（Optional）'} variant={'filled'} />
      </Flexbox>
      <Chat />
    </Flexbox>
  );
};

export default ThreadBody;
