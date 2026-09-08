import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import { walletExtensionSurfaceCheckpointFromSnapshots } from '../WalletExtensionRequestCheckpoint.ts'
import {
	isTonkeeperConnectionRequestSurface,
	isTonkeeperIndexPageUrl,
	tonkeeperBlockedObservation,
	tonkeeperConnectionRequestSurfaceIndex,
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

test('owns only a phase-specific Tonkeeper connection surface', () => {
	const extensionId = 'omaabbefbmiifabbmlbohnckoonlcani'
	const url = `chrome-extension://${extensionId}/index.html#/`
	const classify = (
		headingNames: readonly string[],
		buttonNames: readonly string[]
	) => isTonkeeperConnectionRequestSurface({
		buttonNames,
		extensionId,
		headingNames,
		url,
	})

	assert.equal(classify(['Wallet'], ['Receive', 'Send']), false)
	assert.equal(classify(['Connect to Blockhead'], ['Cancel', 'Connect wallet']), true)
	assert.equal(classify(['So, let’s check'], ['Continue', 'Cancel']), true)
	assert.equal(classify(['So, let’s check', 'Enter password'], ['Confirm', 'Cancel']), true)
	assert.equal(classify(['Wallet', 'Enter password'], ['Confirm', 'Cancel']), false)
	assert.equal(classify(['Wallet'], ['Continue', 'Cancel']), false)
})

test('selects only the Tonkeeper-owned connection request from a safe checkpoint', () => {
	// Fault: wallet home or another extension's modal is returned as connection authority.
	// Owner: Tonkeeper connection-phase selector. Observable: exact owned surface index.
	const extensionId = 'omaabbefbmiifabbmlbohnckoonlcani'
	const checkpoint = walletExtensionSurfaceCheckpointFromSnapshots([
		{
			buttonNames: ['Receive', 'Send'],
			headingNames: ['Wallet'],
			inputIds: [],
			url: `chrome-extension://${extensionId}/index.html#/wallet`,
		},
		{
			buttonNames: ['Cancel', 'Continue'],
			headingNames: ['So, let’s check'],
			inputIds: [],
			url: `chrome-extension://${extensionId}/index.html#/connect?request=secret`,
		},
		{
			buttonNames: ['Cancel', 'Continue'],
			headingNames: ['So, let’s check'],
			inputIds: [],
			url: 'chrome-extension://other/index.html#/connect',
		},
	])

	assert.equal(tonkeeperConnectionRequestSurfaceIndex({
		checkpoint,
		extensionId,
	}), 1)
	assert.equal(JSON.stringify(checkpoint).includes('request=secret'), false)
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

	assertWalletMatrixOutcomes(
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
