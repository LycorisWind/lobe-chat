'use client';

import { memo } from 'react';

import { ActionKeys } from '@/features/ChatInput/ActionBar/config';
import DesktopChatInput from '@/features/ChatInput/Desktop';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import TextArea from './TextArea';

const leftActions = ['stt', 'token'] as ActionKeys[];

const rightActions = [] as ActionKeys[];

const renderTextArea = (onSend: () => void) => <TextArea onSend={onSend} />;

const Desktop = memo(() => {
  const [inputHeight, updatePreference] = useGlobalStore((s) => [
    systemStatusSelectors.threadInputHeight(s),
    s.updateSystemStatus,
  ]);

  return (
    <DesktopChatInput
      footer={{
        saveTopic: false,
      }}
      inputHeight={inputHeight}
      leftActions={leftActions}
      onInputHeightChange={(height) => {
        updatePreference({ threadInputHeight: height });
      }}
      renderTextArea={renderTextArea}
      rightActions={rightActions}
    />
  );
});

export default Desktop;
