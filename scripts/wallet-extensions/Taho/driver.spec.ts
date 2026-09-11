import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	disableTahoTelemetry,
	isTahoPopupPageUrl,
	tahoBlockedObservation,
	tahoDriver,
} from './driver.ts'
import { tahoWalletMatrixScenarios } from './matrix.ts'


test('maps headed Connect chrome to Taho popup.html URLs', () => {
	const extensionId = 'eajafomhmkipbjmfmhebemolkcicgfmd'
	assert.equal(isTahoPopupPageUrl(`chrome-extension://${extensionId}/popup.html`, extensionId), true)
	assert.equal(isTahoPopupPageUrl(`chrome-extension://${extensionId}/popup.html#/`, extensionId), true)
	assert.equal(isTahoPopupPageUrl(`chrome-extension://${extensionId}/tab.html#/onboarding`, extensionId), false)
	assert.equal(isTahoPopupPageUrl(`chrome-extension://${extensionId}/popup.html.evil`, extensionId), false)
	assert.equal(isTahoPopupPageUrl(`https://${extensionId}/popup.html`, extensionId), false)
	assert.equal(isTahoPopupPageUrl(`chrome-extension://other/popup.html`, extensionId), false)
})

test('exposes the Taho WalletDriver contract', () => {
	assert.equal(tahoDriver.kind, 'taho')
	assert.equal(typeof tahoDriver.open, 'function')
	assert.equal(typeof tahoDriver.onboard, 'function')
	assert.equal(typeof tahoDriver.waitForRequest, 'function')
	assert.equal(typeof tahoDriver.approveConnection, 'function')
	assert.equal(typeof tahoDriver.rejectConnection, 'function')
	assert.equal(typeof tahoDriver.selectAccount, 'function')
	assert.equal(typeof disableTahoTelemetry, 'function')
})

test('keeps the Taho account lifecycle shard free of invented blank-add-wallet / recover passes', () => {
	assert.equal(tahoDriver.kind, 'taho')
	assert.deepEqual(tahoWalletMatrixScenarios('0.66.0').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'taho-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'connect-approve',
		},
		{
			id: 'taho-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'blank-add-wallet-tab-blocked',
		},
		{
			id: 'taho-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
})

test('declares Taho blank Add Wallet and recover as explicit blocked matrix cells', async () => {
	const scenarios = tahoWalletMatrixScenarios('0.66.0').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'blank-add-wallet-tab-blocked'
		|| scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => tahoBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'blank-add-wallet-tab-blocked',
					detail: 'Taho 0.66.0 Add Wallet opens a blank tab and does not render its /onboarding/add-wallet route',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Taho recover has no safe fixture material in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'taho',
				run: async (scenario) => tahoBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
			'blocked',
		],
		'taho blank-add-wallet / recover honesty'
	)
})

test('keeps the proven Taho first-account bridge separate from blocked account recovery cells', async () => {
	const scenarios = tahoWalletMatrixScenarios('0.66.0')
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'taho',
				run: async (scenario) => (
					scenario.accountOrdinal === 2 || scenario.initializationFlow === 'recover' ?
						tahoBlockedObservation(scenario)
					:
						{
							outcome: 'unsupported',
							evidence: {
								code: 'real-driver-required',
								detail: 'Compatibility success requires the real Taho extension driver',
								source: 'request-construction-only',
							},
						}
				),
			},
			scenarios,
		}),
		[
			'unsupported',
			'blocked',
			'blocked',
		],
		'taho proven bridge / blocked recovery'
	)
})
