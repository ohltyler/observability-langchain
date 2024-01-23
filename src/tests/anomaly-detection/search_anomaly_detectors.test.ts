/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO fix types
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import fs from 'fs';
import path from 'path';
import { ApiProviderFactory } from '../../providers/factory';
import { QARunner } from '../../runners/qa/qa_runner';
import { OpenSearchTestIndices } from '../../utils/indices';

const provider = ApiProviderFactory.create();
const runner = new (class AnomalyDetectionRunner extends QARunner {
  protected async beforeAll(clusterStateId: string): Promise<void> {
    if (clusterStateId !== 'anomaly-detection') {
      throw new Error('unexpected cluster state id');
    }
    await OpenSearchTestIndices.delete('anomaly-detection');
    await OpenSearchTestIndices.create('anomaly-detection');
  }
})(provider);

const specDirectory = path.join(__dirname, 'specs');
const specFiles = [path.join(specDirectory, 'search_anomaly_detectors_tests.jsonl')];

runner.run(specFiles);
