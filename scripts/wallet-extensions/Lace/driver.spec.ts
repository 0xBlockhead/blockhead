import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	laceDriver,
	laceSidePanelBlockedObservation,
} from './driver.ts'
import { laceWalletMatrixScenarios } from './matrix.ts'


test('keeps the Lace account lifecycle shard free of invented side-panel passes', () => {
	assert.equal(laceDriver.kind, 'lace')
	assert.deepEqual(laceWalletMatrixScenarios('2.2.0').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'lace-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'side-panel-onboarding-blocked',
		},
		{
			id: 'lace-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'side-panel-second-account-blocked',
		},
		{
			id: 'lace-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'side-panel-recover-blocked',
		},
	])
})

test('declares Lace side-panel onboarding/recover as explicit blocked matrix cells', async () => {
	const scenarios = laceWalletMatrixScenarios('2.2.0')
	assert.deepEqual(
		scenarios.map((scenario) => laceSidePanelBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'side-panel-onboarding-blocked',
					detail: 'Lace 2.2.0 headed expo side-panel create-new onboarding is not reliably executable in unattended automation',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'side-panel-second-account-blocked',
					detail: 'Lace second-account derivation depends on side-panel onboarding that is not yet reliably executable',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'side-panel-recover-blocked',
					detail: 'Lace side-panel recover onboarding is not reliably executable in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'lace',
				run: async (scenario) => laceSidePanelBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
			'blocked',
			'blocked',
		],
		'lace side-panel honesty'
	)
})
