/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardStart } from '../../../src/plugins/dashboard/public';
import { EmbeddableSetup, EmbeddableStart } from '../../../src/plugins/embeddable/public';
import { IMessage, ISuggestedAction } from '../common/types/chat_saved_object_attributes';

// TODO should pair with server side registered output parser
export type ContentRenderer = (content: unknown) => React.ReactElement;
export type ActionExecutor = (params: Record<string, unknown>) => void;
export interface AssistantActions {
  send: (input: IMessage) => void;
  loadChat: (sessionId?: string) => void;
  openChatUI: (sessionId?: string) => void;
  executeAction: (suggestedAction: ISuggestedAction, message: IMessage) => void;
}

export interface AppPluginStartDependencies {
  embeddable: EmbeddableStart;
  dashboard: DashboardStart;
}

export interface SetupDependencies {
  embeddable: EmbeddableSetup;
}

export interface AssistantSetup {
  registerContentRenderer: (contentType: string, render: ContentRenderer) => void;
  registerActionExecutor: (actionType: string, execute: ActionExecutor) => void;
  assistantEnabled: () => Promise<boolean>;
  assistantActions: Omit<AssistantActions, 'executeAction'>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AssistantStart {}
