import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	isTonkeeperIndexPageUrl,
	tonkeeperBlockedObservation,
	tonkeeperDriver,
} from './driver.ts'
import { tonkeeperWalletMatrixScenarios } from './matrix.ts'


test('maps headed TonConnect chrome to Tonkeeper index.html URLs', () => {
	const extensionId = 'omaabbefbmiifabbmlbohnckoonlcani'
	assert.equal(isTonkeeperIndexPageUrl(`chrome-extension://${extensionId}/index.html`, extensionId), true)
	assert.equal(isTonkeeperIndexPageUrl(`chrome-extension://${extensionId}/index.html#/`, extensionId), true)
	assert.equal(isTonkeeperIndexPageUrl(`chrome-extension://${extensionId}/background.js`, extensionId), false)
	assert.equal(isTonkeeperIndexPageUrl(`chrome-extension://other/index.html`, extensionId), false)
})

test('keeps the Tonkeeper account lifecycle shard free of invented recover passes', () => {
	assert.equal(tonkeeperDriver.kind, 'tonkeeper')
	assert.deepEqual(tonkeeperWalletMatrixScenarios('26.6.1').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'tonkeeper-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'discover-connect-disconnect',
		},
		{
			id: 'tonkeeper-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'second-account-onboard',
		},
		{
			id: 'tonkeeper-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
})

test('declares Tonkeeper recover as an explicit blocked matrix cell', async () => {
	const scenarios = tonkeeperWalletMatrixScenarios('26.6.1').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => tonkeeperBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Tonkeeper recover has no safe fixture material in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'tonkeeper',
				run: async (scenario) => tonkeeperBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'tonkeeper recover honesty'
	)
})
