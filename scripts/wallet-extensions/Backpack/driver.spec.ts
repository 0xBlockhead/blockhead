import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	backpackBlockedObservation,
	backpackDriver,
} from './driver.ts'
import { backpackWalletMatrixScenarios } from './matrix.ts'


test('keeps the Backpack account lifecycle shard free of invented recover passes', () => {
	assert.equal(backpackDriver.kind, 'backpack')
	assert.deepEqual(backpackWalletMatrixScenarios('0.10.211').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'backpack-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'reject-retry-approve',
		},
		{
			id: 'backpack-watch-only-2',
			initializationFlow: 'watch-only',
			lifecycleEdgeCase: 'account-switch',
		},
		{
			id: 'backpack-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
})

test('declares Backpack recover as an explicit blocked matrix cell', async () => {
	const scenarios = backpackWalletMatrixScenarios('0.10.211').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => backpackBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Backpack recover has no safe fixture material in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'backpack',
				run: async (scenario) => backpackBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'backpack recover honesty'
	)
})
