import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	ambireBlockedObservation,
	ambireDriver,
} from './driver.ts'
import { ambireWalletMatrixScenarios } from './matrix.ts'


test('keeps the Ambire account lifecycle shard free of invented recover passes', () => {
	assert.equal(ambireDriver.kind, 'ambire')
	assert.deepEqual(ambireWalletMatrixScenarios('6.14.4').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'ambire-watch-only-1',
			initializationFlow: 'watch-only',
			lifecycleEdgeCase: 'discover-reject-retry-approve-revoke-disconnect',
		},
		{
			id: 'ambire-watch-only-2',
			initializationFlow: 'watch-only',
			lifecycleEdgeCase: 'switch-accountsChanged-profile-teardown',
		},
		{
			id: 'ambire-recover-signer-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'internal-account-derivation-blocked',
		},
	])
})

test('declares Ambire recover as an explicit blocked matrix cell', async () => {
	const scenarios = ambireWalletMatrixScenarios('6.14.4').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'internal-account-derivation-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => ambireBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'internal-account-derivation-blocked',
					detail: 'Ambire recover signer derivation depends on internal HD derivation UI that is not reliably executable in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'ambire',
				run: async (scenario) => ambireBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'ambire recover honesty'
	)
})
