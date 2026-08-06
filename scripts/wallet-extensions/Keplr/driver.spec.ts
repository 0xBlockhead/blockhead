import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	keplrBlockedObservation,
	keplrDriver,
} from './driver.ts'
import { keplrWalletMatrixScenarios } from './matrix.ts'


test('keeps the Keplr account lifecycle shard free of invented recover passes', () => {
	assert.equal(keplrDriver.kind, 'keplr')
	assert.deepEqual(keplrWalletMatrixScenarios('0.13.41').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'keplr-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'connect-approve',
		},
		{
			id: 'keplr-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'account-switch-disconnect-reload',
		},
		{
			id: 'keplr-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
})

test('declares Keplr recover as an explicit blocked matrix cell', async () => {
	const scenarios = keplrWalletMatrixScenarios('0.13.41').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => keplrBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Keplr recover has no safe fixture material in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'keplr',
				run: async (scenario) => keplrBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'keplr recover honesty'
	)
})
