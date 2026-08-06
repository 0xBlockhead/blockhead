import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from './ecosystems.ts'
import assert from 'node:assert/strict'
import test from 'node:test'

import { ambireWalletMatrixScenarios } from './Ambire/matrix.ts'
import { backpackBlockedObservation } from './Backpack/driver.ts'
import { backpackWalletMatrixScenarios } from './Backpack/matrix.ts'
import { keplrBlockedObservation } from './Keplr/driver.ts'
import { keplrWalletMatrixScenarios } from './Keplr/matrix.ts'
import { laceSidePanelBlockedObservation } from './Lace/driver.ts'
import { laceWalletMatrixScenarios } from './Lace/matrix.ts'
import { metamaskWalletMatrixScenarios } from './MetaMask/matrix.ts'
import { tahoBlockedObservation } from './Taho/driver.ts'
import { tahoWalletMatrixScenarios } from './Taho/matrix.ts'
import { tonkeeperBlockedObservation } from './Tonkeeper/driver.ts'
import { tonkeeperWalletMatrixScenarios } from './Tonkeeper/matrix.ts'
import { unisatBlockedObservation } from './UniSat/driver.ts'
import { unisatWalletMatrixScenarios } from './UniSat/matrix.ts'
import { zerionTurnstileBlockedObservation } from './Zerion/driver.ts'
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

test('declares distinct Backpack create-new, watch-only, and blocked recover flows', async () => {
	const scenarios = backpackWalletMatrixScenarios('0.10.211')
	assert.deepEqual(scenarios.map(({
		id,
		initializationFlow,
		accountOrdinal,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		accountOrdinal,
		lifecycleEdgeCase,
	})), [
		{
			id: 'backpack-create-new-1',
			initializationFlow: 'create-new',
			accountOrdinal: 1,
			lifecycleEdgeCase: 'reject-retry-approve',
		},
		{
			id: 'backpack-watch-only-2',
			initializationFlow: 'watch-only',
			accountOrdinal: 2,
			lifecycleEdgeCase: 'account-switch',
		},
		{
			id: 'backpack-recover-3',
			initializationFlow: 'recover',
			accountOrdinal: 3,
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
	assert.equal(new Set(scenarios.map(({ initializationFlow }) => initializationFlow)).size, 3)
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'backpack',
				run: async (matrixScenario) => (
					matrixScenario.initializationFlow === 'recover' ?
						backpackBlockedObservation(matrixScenario)
					:
						{
							accountAddress: `solbackpack${matrixScenario.accountOrdinal}`,
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
		'backpack declared blockers'
	)
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
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'lace',
				run: async (matrixScenario) => laceSidePanelBlockedObservation(matrixScenario),
			},
			scenarios,
		}),
		[
			'blocked',
			'blocked',
			'blocked',
		],
		'lace declared blockers'
	)
})

test('records Taho account-2 blank Add Wallet and recover as blocked cells', async () => {
	const scenarios = tahoWalletMatrixScenarios('0.66.0')
	assert.deepEqual(scenarios.map(({ id, lifecycleEdgeCase }) => ({
		id,
		lifecycleEdgeCase,
	})), [
		{
			id: 'taho-create-new-1',
			lifecycleEdgeCase: 'connect-approve',
		},
		{
			id: 'taho-create-new-2',
			lifecycleEdgeCase: 'blank-add-wallet-tab-blocked',
		},
		{
			id: 'taho-recover-3',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'taho',
				run: async (matrixScenario) => (
					matrixScenario.accountOrdinal === 2 || matrixScenario.initializationFlow === 'recover' ?
						tahoBlockedObservation(matrixScenario)
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
	assert.deepEqual(scenarios.map(({ id, lifecycleEdgeCase }) => ({
		id,
		lifecycleEdgeCase,
	})), [
		{
			id: 'zerion-create-new-1',
			lifecycleEdgeCase: 'turnstile-captcha-blocked',
		},
		{
			id: 'zerion-create-new-2',
			lifecycleEdgeCase: 'turnstile-second-account-blocked',
		},
		{
			id: 'zerion-recover-3',
			lifecycleEdgeCase: 'turnstile-recover-blocked',
		},
	])
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'zerion',
				run: async (matrixScenario) => zerionTurnstileBlockedObservation(matrixScenario),
			},
			scenarios,
		}),
		[
			'blocked',
			'blocked',
			'blocked',
		],
		'zerion declared blockers'
	)
})

test('records Keplr recover as an explicit blocked matrix cell', async () => {
	const scenarios = keplrWalletMatrixScenarios('0.13.41')
	assert.deepEqual(scenarios.map(({ id, lifecycleEdgeCase }) => ({
		id,
		lifecycleEdgeCase,
	})), [
		{
			id: 'keplr-create-new-1',
			lifecycleEdgeCase: 'connect-approve',
		},
		{
			id: 'keplr-create-new-2',
			lifecycleEdgeCase: 'account-switch-disconnect-reload',
		},
		{
			id: 'keplr-recover-3',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'keplr',
				run: async (matrixScenario) => (
					matrixScenario.initializationFlow === 'recover' ?
						keplrBlockedObservation(matrixScenario)
					:
						{
							accountAddress: `cosmos1keplr${matrixScenario.accountOrdinal}`,
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
		'keplr declared blockers'
	)
})

test('records Tonkeeper recover as an explicit blocked matrix cell', async () => {
	const scenarios = tonkeeperWalletMatrixScenarios('26.6.1')
	assert.deepEqual(scenarios.map(({ id, lifecycleEdgeCase }) => ({
		id,
		lifecycleEdgeCase,
	})), [
		{
			id: 'tonkeeper-create-new-1',
			lifecycleEdgeCase: 'discover-connect-disconnect',
		},
		{
			id: 'tonkeeper-create-new-2',
			lifecycleEdgeCase: 'second-account-onboard',
		},
		{
			id: 'tonkeeper-recover-3',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'tonkeeper',
				run: async (matrixScenario) => (
					matrixScenario.initializationFlow === 'recover' ?
						tonkeeperBlockedObservation(matrixScenario)
					:
						{
							accountAddress: `tonkeeper-account-${matrixScenario.accountOrdinal}`,
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
		'tonkeeper declared blockers'
	)
})

test('records UniSat recover as an explicit blocked matrix cell', async () => {
	const scenarios = unisatWalletMatrixScenarios('1.7.17')
	assert.deepEqual(scenarios.map(({ id, lifecycleEdgeCase }) => ({
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
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'unisat',
				run: async (matrixScenario) => (
					matrixScenario.initializationFlow === 'recover' ?
						unisatBlockedObservation(matrixScenario)
					:
						{
							accountAddress: `bc1qunisat${matrixScenario.accountOrdinal}`,
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
		'unisat declared blockers'
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
