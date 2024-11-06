import isEqual from 'fast-deep-equal';
import React, { memo, useCallback } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItem, VirtualizedList } from '@/features/Conversation';
import { useChatStore } from '@/store/chat';
import { threadSelectors } from '@/store/chat/selectors';

interface ConversationProps {
  mobile?: boolean;
}

const Conversation = memo(({ mobile }: ConversationProps) => {
  const data = useChatStore(threadSelectors.threadMessages, isEqual);
  const threadStartMessageIndex = useChatStore(threadSelectors.threadStartMessageIndex);

  const itemContent = useCallback(
    (index: number, id: string) => (
      <ChatItem
        hideActionBar={index <= threadStartMessageIndex}
        id={id}
        index={index}
        showThreadDivider
      />
    ),
    [mobile, threadStartMessageIndex],
  );

  return (
    <Flexbox
      flex={1}
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
      }}
      width={'100%'}
    >
      <VirtualizedList dataSource={data} hideActionBar itemContent={itemContent} mobile={mobile} />
    </Flexbox>
  );
});

export default Conversation;
