import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from './ecosystems.ts'
import assert from 'node:assert/strict'
import test from 'node:test'

import { ambireWalletMatrixScenarios } from './Ambire/matrix.ts'
import { backpackWalletMatrixScenarios } from './Backpack/matrix.ts'
import { laceWalletMatrixScenarios } from './Lace/matrix.ts'
import { metamaskWalletMatrixScenarios } from './MetaMask/matrix.ts'
import { tahoWalletMatrixScenarios } from './Taho/matrix.ts'
import { zerionWalletMatrixScenarios } from './Zerion/matrix.ts'
import {
	assertWalletMatrixOutcomes,
	hashWalletAccountAddress,
	runWalletCompatibilityMatrix,
	type WalletMatrixOutcome,
	type WalletMatrixScenario,
} from './WalletCompatibilityMatrix.ts'


const scenario = {
	id: 'petra-create-account-1',
	wallet: {
		kind: 'petra',
		version: '2.5.0',
	},
	ecosystem: WalletHarnessEcosystem.Aptos,
	initializationFlow: 'create-new',
	accountOrdinal: 1,
	connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
	connectionMethod: 'aptos:connect',
	chain: 'aptos:1',
	requestMethod: 'aptos:signMessage',
	lifecycleEdgeCase: 'fresh-profile',
} as const satisfies WalletMatrixScenario

const blockedByLifecycle = async (
	kind: WalletMatrixScenario['wallet']['kind'],
	scenarios: readonly WalletMatrixScenario[],
	outcomeFor: (scenario: WalletMatrixScenario) => WalletMatrixOutcome
) => (
	assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind,
				run: async (matrixScenario) => ({
					outcome: outcomeFor(matrixScenario),
					evidence: {
						code: matrixScenario.lifecycleEdgeCase,
						source: 'declared-blocker',
					},
				}),
			},
			scenarios,
		}),
		scenarios.map((matrixScenario) => outcomeFor(matrixScenario)),
		`${kind} declared blockers`
	)
)


test('declares the proven Ambire lifecycle and blocked signer recovery', () => {
	const scenarios = ambireWalletMatrixScenarios('6.14.4')

	assert.deepEqual(scenarios.map((scenario) => ({
		id: scenario.id,
		initializationFlow: scenario.initializationFlow,
		accountOrdinal: scenario.accountOrdinal,
		lifecycleEdgeCase: scenario.lifecycleEdgeCase,
	})), [
		{
			id: 'ambire-watch-only-1',
			initializationFlow: 'watch-only',
			accountOrdinal: 1,
			lifecycleEdgeCase: 'discover-reject-retry-approve-revoke-disconnect',
		},
		{
			id: 'ambire-watch-only-2',
			initializationFlow: 'watch-only',
			accountOrdinal: 2,
			lifecycleEdgeCase: 'switch-accountsChanged-profile-teardown',
		},
		{
			id: 'ambire-recover-signer-3',
			initializationFlow: 'recover',
			accountOrdinal: 3,
			lifecycleEdgeCase: 'internal-account-derivation-blocked',
		},
	])
})

test('declares distinct Backpack create-new, watch-only, and blocked recover flows', () => {
	const scenarios = backpackWalletMatrixScenarios('0.10.211')
	assert.deepEqual(scenarios.map(({
		id,
		initializationFlow,
		accountOrdinal,
	}) => ({
		id,
		initializationFlow,
		accountOrdinal,
	})), [
		{
			id: 'backpack-create-new-1',
			initializationFlow: 'create-new',
			accountOrdinal: 1,
		},
		{
			id: 'backpack-watch-only-2',
			initializationFlow: 'watch-only',
			accountOrdinal: 2,
		},
		{
			id: 'backpack-recover-3',
			initializationFlow: 'recover',
			accountOrdinal: 3,
		},
	])
	assert.equal(new Set(scenarios.map(({ initializationFlow }) => initializationFlow)).size, 3)
})

test('records Ambire recover as an explicit blocked matrix cell', async () => {
	const scenarios = ambireWalletMatrixScenarios('6.14.4')
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'ambire',
				run: async (matrixScenario) => (
					matrixScenario.initializationFlow === 'recover' ?
						{
							outcome: 'blocked',
							evidence: {
								code: matrixScenario.lifecycleEdgeCase,
								source: 'declared-blocker',
							},
						}
					:
						{
							accountAddress: `0xambire${matrixScenario.accountOrdinal}`,
							outcome: 'pass',
							evidence: {
								code: matrixScenario.lifecycleEdgeCase,
								source: 'declared-blocker',
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
		'ambire declared blockers'
	)
})

test('records Lace side-panel automation as explicit blocked matrix cells', async () => {
	const scenarios = laceWalletMatrixScenarios('2.2.0')
	assert.deepEqual(scenarios.map(({ id, lifecycleEdgeCase }) => ({
		id,
		lifecycleEdgeCase,
	})), [
		{
			id: 'lace-create-new-1',
			lifecycleEdgeCase: 'side-panel-onboarding-blocked',
		},
		{
			id: 'lace-create-new-2',
			lifecycleEdgeCase: 'side-panel-second-account-blocked',
		},
		{
			id: 'lace-recover-3',
			lifecycleEdgeCase: 'side-panel-recover-blocked',
		},
	])
	await blockedByLifecycle(
		'lace',
		scenarios,
		() => 'blocked'
	)
})

test('records Taho account-2 blank Add Wallet and recover as blocked cells', async () => {
	const scenarios = tahoWalletMatrixScenarios('0.66.0')
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'taho',
				run: async (matrixScenario) => (
					matrixScenario.accountOrdinal === 2 || matrixScenario.initializationFlow === 'recover' ?
						{
							outcome: 'blocked',
							evidence: {
								code: matrixScenario.lifecycleEdgeCase,
								source: 'declared-blocker',
							},
						}
					:
						{
							accountAddress: '0xtaho1',
							outcome: 'pass',
							evidence: {
								code: matrixScenario.lifecycleEdgeCase,
								source: 'declared-blocker',
							},
						}
				),
			},
			scenarios,
		}),
		[
			'pass',
			'blocked',
			'blocked',
		],
		'taho declared blockers'
	)
})

test('records Zerion Turnstile CAPTCHA onboarding as explicit blocked matrix cells', async () => {
	const scenarios = zerionWalletMatrixScenarios('1.21.0')
	assert.ok(scenarios.every(({ lifecycleEdgeCase }) => lifecycleEdgeCase.includes('blocked')))
	await blockedByLifecycle(
		'zerion',
		scenarios,
		() => 'blocked'
	)
})


test('imports MetaMask matrix module with distinct account initialization flows', () => {
	const scenarios = metamaskWalletMatrixScenarios('13.41.0')

	assert.equal(scenarios.length, 3)
	assert.deepEqual(scenarios.map(({
		id,
		wallet,
		initializationFlow,
		accountOrdinal,
		connectionProtocol,
		connectionMethod,
		chain,
		requestMethod,
		lifecycleEdgeCase,
	}) => ({
		id,
		kind: wallet.kind,
		version: wallet.version,
		initializationFlow,
		accountOrdinal,
		connectionProtocol,
		connectionMethod,
		chain,
		requestMethod,
		lifecycleEdgeCase,
	})), [
		{
			id: 'metamask-create-new-1',
			kind: 'metamask',
			version: '13.41.0',
			initializationFlow: 'create-new',
			accountOrdinal: 1,
			connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
			connectionMethod: 'eth_requestAccounts',
			chain: 'eip155:1',
			requestMethod: 'personal_sign',
			lifecycleEdgeCase: 'reject-retry-approve',
		},
		{
			id: 'metamask-create-new-2',
			kind: 'metamask',
			version: '13.41.0',
			initializationFlow: 'create-new',
			accountOrdinal: 2,
			connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
			connectionMethod: 'eth_requestAccounts',
			chain: 'eip155:1',
			requestMethod: 'personal_sign',
			lifecycleEdgeCase: 'account-switch',
		},
		{
			id: 'metamask-import-private-key-3',
			kind: 'metamask',
			version: '13.41.0',
			initializationFlow: 'import-private-key',
			accountOrdinal: 3,
			connectionProtocol: WalletHarnessConnectionProtocol.Eip6963,
			connectionMethod: 'eth_requestAccounts',
			chain: 'eip155:1',
			requestMethod: 'personal_sign',
			lifecycleEdgeCase: 'disconnect-reload',
		},
	])
	assert.equal(new Set(scenarios.map(({ accountOrdinal }) => accountOrdinal)).size, 3)
})


test('records every matrix dimension while hashing the account address', async () => {
	const address = '0x1234'
	const [result] = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async () => ({
				accountAddress: address,
				outcome: 'pass',
				evidence: {
					code: 'account-visible',
					source: 'semantic-selector',
				},
			}),
		},
		scenarios: [scenario],
	})

	assert.deepEqual(result, {
		id: scenario.id,
		walletKind: 'petra',
		walletVersion: '2.5.0',
		ecosystem: WalletHarnessEcosystem.Aptos,
		initializationFlow: 'create-new',
		accountOrdinal: 1,
		accountAddressHash: hashWalletAccountAddress(address),
		connectionProtocol: WalletHarnessConnectionProtocol.WalletStandard,
		connectionMethod: 'aptos:connect',
		chain: 'aptos:1',
		requestMethod: 'aptos:signMessage',
		lifecycleEdgeCase: 'fresh-profile',
		outcome: 'pass',
		evidence: {
			code: 'account-visible',
			source: 'semantic-selector',
		},
	})
	assert.equal(JSON.stringify(result).includes(address), false)
})

test('retains unsupported and inaccessible cases in the denominator', async () => {
	const results = await runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async ({ initializationFlow }) => ({
				outcome: (
					initializationFlow === 'recover' ?
						'inaccessible'
					:
						'unsupported'
				),
				evidence: {
					code: `${initializationFlow}-not-automatable`,
				},
			}),
		},
		scenarios: [
			{
				...scenario,
				id: 'petra-recover-account-2',
				initializationFlow: 'recover',
				accountOrdinal: 2,
			},
			{
				...scenario,
				id: 'petra-watch-only-account-3',
				initializationFlow: 'watch-only',
				accountOrdinal: 3,
			},
		],
	})

	assert.deepEqual(results.map(({ outcome }) => outcome), [
		'inaccessible',
		'unsupported',
	])
})

test('rejects passing rows without addresses and secret-bearing evidence', async () => {
	await assert.rejects(() => runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async () => ({
				outcome: 'pass',
				evidence: {
					code: 'visible',
				},
			}),
		},
		scenarios: [scenario],
	}), /did not produce an account address/)

	await assert.rejects(() => runWalletCompatibilityMatrix({
		driver: {
			kind: 'petra',
			run: async () => ({
				outcome: 'blocked',
				evidence: {
					code: 'seed-phrase-screen',
				},
			}),
		},
		scenarios: [scenario],
	}), /secret-free/)
})
