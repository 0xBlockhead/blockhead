import assert from 'node:assert/strict'
import test from 'node:test'

import { ambireWalletMatrixScenarios } from './Ambire/matrix.ts'
import { argentXWalletMatrixScenarios } from './ArgentX/matrix.ts'
import { backpackWalletMatrixScenarios } from './Backpack/matrix.ts'
import { WalletHarnessConnectionProtocol, WalletHarnessEcosystem } from './ecosystems.ts'
import { keplrWalletMatrixScenarios } from './Keplr/matrix.ts'
import { laceWalletMatrixScenarios } from './Lace/matrix.ts'
import { metamaskWalletMatrixScenarios } from './MetaMask/matrix.ts'
import { petraWalletMatrixScenarios } from './Petra/matrix.ts'
import { polkadotJsWalletMatrixScenarios } from './PolkadotJs/matrix.ts'
import { rabbyWalletMatrixScenarios } from './Rabby/matrix.ts'
import { tahoWalletMatrixScenarios } from './Taho/matrix.ts'
import { tonkeeperWalletMatrixScenarios } from './Tonkeeper/matrix.ts'
import { unisatWalletMatrixScenarios } from './UniSat/matrix.ts'
import {
	formatWalletMatrixReport,
	hashWalletAccountAddress,
	runWalletCompatibilityMatrix,
	runWalletCompatibilityMatrixSuite,
	type WalletMatrixScenario,
} from './WalletCompatibilityMatrix.ts'
import { zerionWalletMatrixScenarios } from './Zerion/matrix.ts'

const scenario = {
	id: 'petra-create-account-1',
	wallet: { kind: 'petra', version: '2.5.0' },
	ecosystem: WalletHarnessEcosystem.Aptos,
	initializationFlow: 'create-new',
	accountOrdinal: 1,
	connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
	connectionMethod: 'aptos:connect',
	chain: 'aptos:1',
	requestMethod: 'aptos:signMessage',
	lifecycleEdgeCase: 'fresh-profile',
} as const satisfies WalletMatrixScenario

const realWalletMatrixDefinitions = [
	['ambire', () => ambireWalletMatrixScenarios('6.14.4')],
	['argent-x', () => argentXWalletMatrixScenarios('5.23.0')],
	['backpack', () => backpackWalletMatrixScenarios('0.10.211')],
	['keplr', () => keplrWalletMatrixScenarios('0.13.41')],
	['lace', () => laceWalletMatrixScenarios('2.2.0')],
	['metamask', () => metamaskWalletMatrixScenarios('13.41.0')],
	['petra', () => petraWalletMatrixScenarios('2.5.0')],
	['polkadot-js', () => polkadotJsWalletMatrixScenarios('0.63.1')],
	['rabby', () => rabbyWalletMatrixScenarios('0.94.1')],
	['taho', () => tahoWalletMatrixScenarios('0.66.0')],
	['tonkeeper', () => tonkeeperWalletMatrixScenarios('26.6.1')],
	['unisat', () => unisatWalletMatrixScenarios('1.7.17')],
	['zerion', () => zerionWalletMatrixScenarios('1.41.2')],
] as const

test('runs every real wallet matrix through the shared denominator', async () => {
	const results = await runWalletCompatibilityMatrixSuite({
		entries: realWalletMatrixDefinitions.map(([kind, createScenarios]) => ({
			driver: {
				kind,
				run: async () => ({
					outcome: 'unsupported' as const,
					evidence: { code: 'shared-matrix-denominator-only' },
				}),
			},
			scenarios: createScenarios(),
		})),
	})

	assert.equal(new Set(results.map(({ walletKind }) => walletKind)).size, realWalletMatrixDefinitions.length)
	assert.equal(results.length, realWalletMatrixDefinitions.reduce((total, [, createScenarios]) => total + createScenarios().length, 0))
	assert.ok(results.every(({ outcome }) => outcome === 'unsupported'))
})

test('rejects empty or duplicate matrix inputs', async () => {
	const driver = {
		kind: 'petra' as const,
		run: async () => ({ outcome: 'unsupported' as const, evidence: { code: 'not-run' } }),
	}
	await assert.rejects(() => runWalletCompatibilityMatrix({ driver, scenarios: [] }), /must not be empty/)
	await assert.rejects(() => runWalletCompatibilityMatrixSuite({ entries: [] }), /must not be empty/)
	await assert.rejects(() => runWalletCompatibilityMatrix({ driver, scenarios: [scenario, scenario] }), /must be unique/)
	assert.throws(() => formatWalletMatrixReport([], { expectedOutcomes: ['unsupported'] }), /must not be empty/)
})

test('records dimensions without exposing account addresses', async () => {
	const address = '0x1234'
	const [result] = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async () => ({
				accountAddress: address,
				outcome: 'pass',
				evidence: { code: 'account-visible', source: 'semantic-selector' },
			}),
		},
		scenarios: [scenario],
	})

	assert.equal(result.accountAddressHash, hashWalletAccountAddress(address))
	assert.equal(result.id, scenario.id)
	assert.equal(result.lifecycleEdgeCase, scenario.lifecycleEdgeCase)
	assert.equal(JSON.stringify(result).includes(address), false)
})

test('rejects invalid outcome evidence', async () => {
	const run = (outcome: 'pass' | 'blocked', accountAddress?: string) => runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async () => ({
				accountAddress,
				outcome,
				evidence: {
					code: outcome === 'blocked' ?
						accountAddress ? 'recover-ui-blocked' : 'seed-phrase-screen'
						:
						'visible',
				},
			}),
		},
		scenarios: [scenario],
	})

	await assert.rejects(() => run('pass'), /did not produce an account address/)
	await assert.rejects(() => run('blocked'), /secret-free/)
	await assert.rejects(() => run('blocked', '0xblocked-account'), /must not produce an account address/)
})
