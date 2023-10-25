/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GradingConfig } from 'promptfoo';
import { assertions } from 'promptfoo';
import { PROVIDERS } from './providers/constants';
import { ApiProviderFactory } from './providers/provider_factory';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchSemanticSimilarity(expected: string, threshold?: number): Promise<R>;
      toPassLLMRubric(expected: string, gradingConfig: GradingConfig): Promise<R>;
    }
  }
}

const { matchesSimilarity, matchesLlmRubric } = assertions;

export function installJestMatchers() {
  expect.extend({
    async toMatchSemanticSimilarity(
      received: string,
      expected: string,
      threshold: number = 0.8,
    ): Promise<jest.CustomMatcherResult> {
      const result = await matchesSimilarity(received, expected, threshold, undefined, {
        provider: ApiProviderFactory.create(PROVIDERS.ML_COMMONS),
      });
      const pass = received === expected || result.pass;
      if (pass) {
        return {
          message: () => `expected ${received} not to match semantic similarity with ${expected}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to match semantic similarity with ${expected}, but it did not. Reason: ${result.reason}`,
          pass: false,
        };
      }
    },

    async toPassLLMRubric(
      received: string,
      expected: string,
      gradingConfig: GradingConfig,
    ): Promise<jest.CustomMatcherResult> {
      const gradingResult = await matchesLlmRubric(expected, received, {
        provider: ApiProviderFactory.create(PROVIDERS.ML_COMMONS),
        ...gradingConfig,
      });
      if (gradingResult.pass) {
        return {
          message: () => `expected ${received} not to pass LLM Rubric with ${expected}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to pass LLM Rubric with ${expected}, but it did not. Reason: ${gradingResult.reason}`,
          pass: false,
        };
      }
    },
  });
}