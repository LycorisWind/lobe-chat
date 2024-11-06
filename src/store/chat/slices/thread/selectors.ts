import { MESSAGE_THREAD_DIVIDER_ID } from '@/const/message';
import type { ChatStoreState } from '@/store/chat';
import { ThreadType } from '@/types/topic';

import { chatSelectors } from '../message/selectors';

const filterUntilTargetId = (idList: string[], targetId?: string) => {
  if (!targetId) return idList;

  const targetIndex = idList.indexOf(targetId);

  // 如果找到目标id，则截取到该位置（包含该位置）
  // 如果没找到目标id，则返回原数组
  return targetIndex !== -1 ? idList.slice(0, targetIndex + 1) : idList;
};

const threadMessages = (s: ChatStoreState): string[] => {
  // 如果是独立话题模式，则只显示话题开始消息
  if (s.portalNewThreadMode === ThreadType.Standalone)
    return [s.portalThreadStartMessageId, MESSAGE_THREAD_DIVIDER_ID].filter(Boolean) as string[];

  // skip tool message
  const data = chatSelectors.currentChats(s).filter((m) => m.role !== 'tool');

  const items = filterUntilTargetId(
    data.map((i) => i.id),
    s.portalThreadStartMessageId,
  );
  return [...items, MESSAGE_THREAD_DIVIDER_ID];
};

const threadStartMessageIndex = (s: ChatStoreState) => {
  return !s.portalThreadStartMessageId
    ? -1
    : threadMessages(s).indexOf(s.portalThreadStartMessageId);
};

export const threadSelectors = {
  threadMessages,
  threadStartMessageIndex,
};
