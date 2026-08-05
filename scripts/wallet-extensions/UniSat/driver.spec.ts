import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	unisatOrdinalsPurposeUnsupportedObservation,
	unisatDriver,
} from './driver.ts'
import {
	unisatOrdinalsPurposeUnsupportedScenario,
	unisatWalletMatrixScenarios,
} from './matrix.ts'


test('keeps the UniSat account lifecycle shard free of invented ordinals purpose passes', () => {
	assert.equal(unisatDriver.kind, 'unisat')
	assert.deepEqual(unisatWalletMatrixScenarios('1.0.0').map(({
		id,
		lifecycleEdgeCase,
	}) => ({
		id,
		lifecycleEdgeCase,
	})), [
		{
			id: 'unisat-create-new-1',
			lifecycleEdgeCase: 'reject-retry-approve',
		},
		{
			id: 'unisat-create-new-2',
			lifecycleEdgeCase: 'account-switch-disconnect',
		},
		{
			id: 'unisat-recover-3',
			lifecycleEdgeCase: 'fixture-material-not-provided',
		},
	])
})

test('declares UniSat ordinals purpose as an explicit unsupported matrix cell', async () => {
	const scenario = unisatOrdinalsPurposeUnsupportedScenario('1.0.0')
	assert.equal(scenario.lifecycleEdgeCase, 'ordinals-purpose-not-exposed-by-injected-api')
	assert.deepEqual(unisatOrdinalsPurposeUnsupportedObservation(), {
		outcome: 'unsupported',
		evidence: {
			code: 'ordinals-purpose-not-exposed-by-injected-api',
			detail: 'UniSat injected getAccounts/requestAccounts return unlabeled address strings; Sats Connect payment/ordinals purposes are not available without inventing a role',
			source: 'adapter-contract',
		},
	})

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'unisat',
				run: async () => unisatOrdinalsPurposeUnsupportedObservation(),
			},
			scenarios: [
				scenario,
			],
		}),
		[
			'unsupported',
		],
		'unisat ordinals purpose honesty'
	)
})
