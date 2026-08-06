import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from '../ecosystems.ts'
import assert from 'node:assert/strict'
import test from 'node:test'

import {
	isRabbyNotificationPageUrl,
	rabbyUnsupportedMatrixDriver,
} from './driver.ts'


test('maps headed Connect/sign chrome to Rabby notification.html URLs', () => {
	const extensionId = 'acmacodkjbdgmoleebolmdjonilkdbch'
	assert.equal(isRabbyNotificationPageUrl(`chrome-extension://${extensionId}/notification.html`, extensionId), true)
	assert.equal(isRabbyNotificationPageUrl(`chrome-extension://${extensionId}/notification.html#/approval`, extensionId), true)
	assert.equal(isRabbyNotificationPageUrl(`chrome-extension://${extensionId}/index.html`, extensionId), false)
	assert.equal(isRabbyNotificationPageUrl(`chrome-extension://other/notification.html`, extensionId), false)
})

test('reports explicit secret-free evidence without a Rabby extension directory', async () => {
	const observation = await rabbyUnsupportedMatrixDriver().run({
		id: 'rabby-personal-sign-approve',
		wallet: {
			kind: 'rabby',
			version: 'unavailable',
		},
		ecosystem: WalletHarnessEcosystem.Evm,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
		connectionMethod: 'eth_requestAccounts',
		chain: 'eip155:31337',
		requestMethod: 'personal_sign',
		lifecycleEdgeCase: 'approve',
	})

	assert.deepEqual(observation, {
		outcome: 'unsupported',
		evidence: {
			code: 'rabby-extension-dir-unavailable',
			detail: 'RABBY_EXTENSION_DIR is required for personal_sign',
			source: 'test-environment',
		},
	})
})
