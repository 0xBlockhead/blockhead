import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	argentXBlockedObservation,
	argentXDriver,
	isArgentXIndexPageUrl,
} from './driver.ts'
import { argentXWalletMatrixScenarios } from './matrix.ts'


test('maps headed Connect chrome to Argent X index.html URLs', () => {
	const extensionId = 'dlcobpjiigpikoobohmabehhmhfoodbb'
	assert.equal(isArgentXIndexPageUrl(`chrome-extension://${extensionId}/index.html`, extensionId), true)
	assert.equal(isArgentXIndexPageUrl(`chrome-extension://${extensionId}/index.html#/connect`, extensionId), true)
	assert.equal(isArgentXIndexPageUrl(`chrome-extension://${extensionId}/background.js`, extensionId), false)
	assert.equal(isArgentXIndexPageUrl(`chrome-extension://other/index.html`, extensionId), false)
})

test('keeps the Argent X account lifecycle shard free of invented recover passes', () => {
	assert.equal(argentXDriver.kind, 'argent-x')
	assert.deepEqual(argentXWalletMatrixScenarios('5.23.0').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'argent-x-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'reject-retry-approve',
		},
		{
			id: 'argent-x-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'account-switch-disconnect-reload',
		},
		{
			id: 'argent-x-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
})

test('declares Argent X recover as an explicit blocked matrix cell', async () => {
	const scenarios = argentXWalletMatrixScenarios('5.23.0').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => argentXBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Argent X recover has no safe restore fixture in unattended automation; source-available build carries Argent non-commercial licensing terms',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'argent-x',
				run: async (scenario) => argentXBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'argent-x recover honesty'
	)
})
