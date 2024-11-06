import { memo } from 'react';

<<<<<<<< HEAD:src/features/ChatInput/Desktop/InputArea/index.tsx
import { useUserStore } from '@/store/user';
import { preferenceSelectors } from '@/store/user/selectors';
import { isCommandPressed } from '@/utils/keyboard';

import { useAutoFocus } from '../useAutoFocus';

const useStyles = createStyles(({ css }) => {
  return {
    textarea: css`
      resize: none !important;

      height: 100% !important;
      padding-block: 0;
      padding-inline: 24px;

      line-height: 1.5;

      box-shadow: none !important;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});

interface InputAreaProps {
  loading?: boolean;
  onChange: (string: string) => void;
  onSend: () => void;
  value: string;
}

const InputArea = memo<InputAreaProps>(({ onSend, value, loading, onChange }) => {
  const { t } = useTranslation('chat');
  const { styles } = useStyles();
  const ref = useRef<TextAreaRef>(null);
  const isChineseInput = useRef(false);

  const useCmdEnterToSend = useUserStore(preferenceSelectors.useCmdEnterToSend);

  useAutoFocus(ref);

  const hasValue = !!value;

  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (hasValue) {
        // set returnValue to trigger alert modal
        // Note: No matter what value is set, the browser will display the standard text
        e.returnValue = '你有正在输入中的内容，确定要离开吗？';
      }
    };

    window.addEventListener('beforeunload', fn);
    return () => {
      window.removeEventListener('beforeunload', fn);
    };
  }, [hasValue]);

  return (
    <div className={styles.textareaContainer}>
      <TextArea
        autoFocus
        className={styles.textarea}
        onBlur={(e) => {
          onChange?.(e.target.value);
        }}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        onCompositionEnd={() => {
          isChineseInput.current = false;
        }}
        onCompositionStart={() => {
          isChineseInput.current = true;
        }}
        onPressEnter={(e) => {
          if (loading || e.altKey || e.shiftKey || isChineseInput.current) return;

          // eslint-disable-next-line unicorn/consistent-function-scoping
          const send = () => {
            // avoid inserting newline when sending message.
            // refs: https://github.com/lobehub/lobe-chat/pull/989
            e.preventDefault();

            onSend();
          };
          const commandKey = isCommandPressed(e);

          // when user like cmd + enter to send message
          if (useCmdEnterToSend) {
            if (commandKey) send();
          } else {
            // cmd + enter to wrap
            if (commandKey) {
              onChange?.((e.target as any).value + '\n');
              return;
            }

            send();
          }
        }}
        placeholder={t('sendPlaceholder')}
        ref={ref}
        type={'pure'}
        value={value}
      />
    </div>
  );
});

InputArea.displayName = 'DesktopInputArea';

export default InputArea;
========
import InputArea from '@/features/ChatInput/Desktop/InputArea';
import { useSendMessage } from '@/features/ChatInput/useSend';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/slices/message/selectors';

const TextArea = memo<{ onSend?: () => void }>(({ onSend }) => {
  const [loading, value, updateInputMessage] = useChatStore((s) => [
    chatSelectors.isAIGenerating(s),
    s.inputMessage,
    s.updateInputMessage,
  ]);
  const { send: sendMessage } = useSendMessage();

  return (
    <InputArea
      loading={loading}
      onChange={updateInputMessage}
      onSend={() => {
        sendMessage();
        onSend?.();
      }}
      value={value}
    />
  );
});

export default TextArea;
>>>>>>>> e72dd0025 (✨ feat: 初步实现分支话题选择):src/features/ChatInput/Desktop/TextArea.tsx
