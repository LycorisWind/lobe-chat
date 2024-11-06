/* eslint-disable sort-keys-fix/sort-keys-fix, typescript-sort-keys/interface */
// Disable the auto sort key eslint rule to make the code more logic and readable
import isEqual from 'fast-deep-equal';
import { StateCreator } from 'zustand/vanilla';

import { ChatStore } from '@/store/chat/store';
import { setNamespace } from '@/utils/storeDebug';

import { toggleBooleanList } from '../../utils';

const n = setNamespace('thd');

export interface ChatThreadAction {
  // create
  addAIMessage: () => Promise<void>;
  // update
  updateThreadInputMessage: (message: string) => void;
  toggleMessageEditing: (id: string, editing: boolean) => void;
}

export const chatThreadMessage: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatThreadAction
> = (set, get) => ({
  addAIMessage: async () => {
    const { internal_createMessage, updateInputMessage, activeTopicId, activeId, inputMessage } =
      get();
    if (!activeId) return;

    await internal_createMessage({
      content: inputMessage,
      role: 'assistant',
      sessionId: activeId,
      // if there is activeTopicId，then add topicId to message
      topicId: activeTopicId,
    });

    updateInputMessage('');
  },
  toggleMessageEditing: (id, editing) => {
    set(
      { messageEditingIds: toggleBooleanList(get().messageEditingIds, id, editing) },
      false,
      'toggleMessageEditing',
    );
  },
  updateThreadInputMessage: (message) => {
    if (isEqual(message, get().threadInputMessage)) return;

    set({ threadInputMessage: message }, false, n(`updateThreadInputMessage`, message));
  },
});
