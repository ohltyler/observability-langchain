/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiTextArea } from '@elastic/eui';
import autosize from 'autosize';
import React, { useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { IMessage } from '../../../../common/types/chat_saved_object_attributes';
import { useChatContext } from '../../../contexts/chat_context';
import { useChatActions } from '../../../hooks/use_chat_actions';

interface ChatInputControlsProps {
  disabled: boolean;
}

export const ChatInputControls: React.FC<ChatInputControlsProps> = (props) => {
  const chatContext = useChatContext();
  const { send } = useChatActions();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffectOnce(() => {
    if (inputRef.current) {
      autosize(inputRef.current);
    }
  });

  const onSubmit = async () => {
    if (props.disabled || !inputRef.current) return;

    const userInput = inputRef.current.value.trim();
    if (!userInput) return;

    const inputMessage: IMessage = {
      type: 'input',
      content: userInput,
      contentType: 'text',
      context: {
        appId: chatContext.appId,
      },
    };
    inputRef.current.value = '';
    inputRef.current.style.height = '40px';
    send(inputMessage);
  };

  return (
    <EuiFlexGroup gutterSize="m" alignItems="flexEnd" justifyContent="spaceEvenly">
      <EuiFlexItem grow={false} />
      <EuiFlexItem>
        <EuiTextArea
          fullWidth
          rows={1}
          compressed
          autoFocus
          placeholder="Ask me anything..."
          inputRef={inputRef}
          style={{ minHeight: 40, maxHeight: 400 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          aria-label="send"
          size="m"
          display="fill"
          iconType="sortRight"
          onClick={onSubmit}
          isDisabled={props.disabled}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false} />
    </EuiFlexGroup>
  );
};
