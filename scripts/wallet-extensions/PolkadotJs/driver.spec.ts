import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	polkadotJsBlockedObservation,
	polkadotJsDriver,
} from './driver.ts'
import { polkadotJsWalletMatrixScenarios } from './matrix.ts'


test('keeps the polkadot-js account lifecycle shard free of invented recover passes', () => {
	assert.equal(polkadotJsDriver.kind, 'polkadot-js')
	assert.deepEqual(polkadotJsWalletMatrixScenarios('0.63.1').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'polkadot-js-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'authorize-enumerate-candidate-connect-product-gap',
		},
		{
			id: 'polkadot-js-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'account-switch-disconnect-reload-product-gap',
		},
		{
			id: 'polkadot-js-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'rejection-retry-third-flow-unavailable',
		},
	])
})

test('declares polkadot-js account-3 recover as an explicit blocked matrix cell', async () => {
	const scenarios = polkadotJsWalletMatrixScenarios('0.63.1').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'rejection-retry-third-flow-unavailable'
	))
	assert.deepEqual(
		scenarios.map((scenario) => polkadotJsBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'rejection-retry-third-flow-unavailable',
					detail: 'polkadot-js account-3 recover is not independently available as a third initialization flow in this shard',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'polkadot-js',
				run: async (scenario) => polkadotJsBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'polkadot-js recover honesty'
	)
})
