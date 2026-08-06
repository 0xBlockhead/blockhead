import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	isPetraPromptPageUrl,
	petraBlockedObservation,
	petraDriver,
} from './driver.ts'
import { petraWalletMatrixScenarios } from './matrix.ts'


test('keeps the Petra account lifecycle shard free of invented recover / key-import passes', () => {
	assert.equal(petraDriver.kind, 'petra')
	assert.deepEqual(petraWalletMatrixScenarios('2.5.0').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'petra-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'discover-connect-approve',
		},
		{
			id: 'petra-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'second-account-connect-or-headed-approve',
		},
		{
			id: 'petra-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
	assert.equal(
		petraWalletMatrixScenarios('2.5.0').some(({ initializationFlow }) => (
			initializationFlow === 'import-private-key'
		)),
		false,
		'Petra must not invent an import-private-key pass while fixture material is unavailable'
	)
})

test('maps headed Connect chrome to Petra prompt.html URLs', () => {
	const extensionId = 'ejjladinnckdgjemekebdpeokbikhfci'
	assert.equal(isPetraPromptPageUrl(`chrome-extension://${extensionId}/prompt.html`, extensionId), true)
	assert.equal(isPetraPromptPageUrl(`chrome-extension://${extensionId}/prompt.html#/`, extensionId), true)
	assert.equal(isPetraPromptPageUrl(`chrome-extension://${extensionId}/index.html`, extensionId), false)
	assert.equal(isPetraPromptPageUrl(`chrome-extension://other/prompt.html`, extensionId), false)
	assert.equal(typeof petraDriver.waitForRequest, 'function')
	assert.equal(typeof petraDriver.approveConnection, 'function')
	assert.equal(typeof petraDriver.rejectConnection, 'function')
	assert.equal(typeof petraDriver.decideConnection, 'function')
})

test('declares Petra recover as an explicit blocked matrix cell', async () => {
	const scenarios = petraWalletMatrixScenarios('2.5.0').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => petraBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Petra recover and key-import flows have no safe fixture material in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'petra',
				run: async (scenario) => petraBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'petra recover / key-import honesty'
	)
})

test('keeps proven Petra create-new bridges separate from blocked recover', async () => {
	const scenarios = petraWalletMatrixScenarios('2.5.0')
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'petra',
				run: async (scenario) => (
					scenario.initializationFlow === 'recover' ?
						petraBlockedObservation(scenario)
					:
						{
							accountAddress: `0xpetra${scenario.accountOrdinal}`,
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
		'petra proven bridge / blocked recovery'
	)
})
