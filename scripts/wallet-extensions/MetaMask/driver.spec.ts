import assert from 'node:assert/strict'
import test from 'node:test'

import {
	metamaskUiGeneration,
	metamaskUnsupportedEnvironmentEvidence,
} from './driver.ts'


test('version-gates the observed MetaMask semantic UI', () => {
	assert.equal(metamaskUiGeneration('11.0.0'), 'modern')
	assert.equal(metamaskUiGeneration('13.12.0'), 'modern')
	assert.throws(() => metamaskUiGeneration('10.99.0'), /outside the observed/)
	assert.throws(() => metamaskUiGeneration('source-build'), /outside the observed/)
})

test('reports a secret-free unsupported environment', () => {
	assert.deepEqual(metamaskUnsupportedEnvironmentEvidence(), {
		outcome: 'unsupported',
		evidence: {
			code: 'metamask-extension-dir-unavailable',
			source: 'test-environment',
		},
	})
})
