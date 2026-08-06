import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	backpackBlockedObservation,
	backpackDriver,
	isBackpackPopupPageUrl,
} from './driver.ts'
import { backpackWalletMatrixScenarios } from './matrix.ts'


test('maps headed Connect chrome to Backpack popup.html URLs', () => {
	const extensionId = 'aflkmfhebedbjioipglgcbcmnbpgliof'
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://${extensionId}/popup.html`, extensionId), true)
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://${extensionId}/popup.html#/`, extensionId), true)
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://${extensionId}/options.html`, extensionId), false)
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://other/popup.html`, extensionId), false)
})

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

test('keeps proven Backpack create-new and watch-only bridges separate from blocked recover', async () => {
	const scenarios = backpackWalletMatrixScenarios('0.10.211')
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'backpack',
				run: async (scenario) => (
					scenario.initializationFlow === 'recover' ?
						backpackBlockedObservation(scenario)
					:
						{
							accountAddress: `solbackpack${scenario.accountOrdinal}`,
							outcome: 'pass',
							evidence: {
								code: scenario.lifecycleEdgeCase,
								source: 'unit-bridge-contract',
							},
						}
				),
			},
			scenarios,
		}),
		[
			'pass',
			'pass',
			'blocked',
		],
		'backpack proven bridge / blocked recovery'
	)
})
