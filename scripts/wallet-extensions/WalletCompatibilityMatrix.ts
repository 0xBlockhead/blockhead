import { createHash } from 'node:crypto'

import type { RealWalletKind } from './WalletExtensionHarness.ts'
import {
	WalletHarnessConnectionProtocol,
	WalletHarnessEcosystem,
} from './ecosystems.ts'


// Types

export type WalletInitializationFlow =
	| 'create-new'
	| 'hardware-simulation'
	| 'import-private-key'
	| 'recover'
	| 'social-or-passkey'
	| 'watch-only'

export type WalletMatrixOutcome = 'blocked' | 'inaccessible' | 'pass' | 'unsupported'

export type WalletMatrixScenario = {
	id: string
	wallet: {
		kind: RealWalletKind
		version: string
	}
	ecosystem: WalletHarnessEcosystem
	initializationFlow: WalletInitializationFlow
	accountOrdinal: 1 | 2 | 3
	connectionProtocol: WalletHarnessConnectionProtocol
	connectionMethod: string
	chain: string
	requestMethod: string
	lifecycleEdgeCase: string
}

export type WalletMatrixEvidence = {
	code: string
	detail?: string
	source?: string
}

export type WalletMatrixObservation = {
	accountAddress?: string
	outcome: WalletMatrixOutcome
	evidence: WalletMatrixEvidence
}

export type WalletMatrixResult = Omit<WalletMatrixScenario, 'wallet'> & {
	walletKind: RealWalletKind
	walletVersion: string
	accountAddressHash?: string
	outcome: WalletMatrixOutcome
	evidence: WalletMatrixEvidence
}

export type WalletMatrixDriver = {
	kind: RealWalletKind
	run: (scenario: WalletMatrixScenario) => Promise<WalletMatrixObservation>
}


// Functions

export const hashWalletAccountAddress = (address: string) => (
	`sha256:${createHash('sha256').update(address.trim().toLowerCase()).digest('hex')}`
)

const assertEvidenceIsSecretFree = (evidence: WalletMatrixEvidence) => {
	const serialized = JSON.stringify(evidence)
	if (/(mnemonic|private.?key|recovery.?phrase|seed.?phrase|secret)/i.test(serialized))
		throw new Error('Wallet matrix evidence must use secret-free codes and metadata')
}

export const runWalletCompatibilityMatrix = async ({
	driver,
	scenarios,
	step = async (_name, run) => run(),
}: {
	driver: WalletMatrixDriver
	scenarios: readonly WalletMatrixScenario[]
	step?: <_Result>(name: string, run: () => Promise<_Result>) => Promise<_Result>
}) => {
	const results: WalletMatrixResult[] = []
	for (const scenario of scenarios)
		results.push(await step(scenario.id, async () => {
			if (scenario.wallet.kind !== driver.kind)
				throw new Error(`Wallet matrix scenario ${scenario.id} requires ${scenario.wallet.kind}, not ${driver.kind}`)

			const {
				accountAddress,
				evidence,
				outcome,
			} = await driver.run(scenario)
			assertEvidenceIsSecretFree(evidence)

			if (outcome === 'pass' && !accountAddress)
				throw new Error(`Passing wallet matrix scenario ${scenario.id} did not produce an account address`)

			return {
				id: scenario.id,
				walletKind: scenario.wallet.kind,
				walletVersion: scenario.wallet.version,
				ecosystem: scenario.ecosystem,
				initializationFlow: scenario.initializationFlow,
				accountOrdinal: scenario.accountOrdinal,
				...(accountAddress && {
					accountAddressHash: hashWalletAccountAddress(accountAddress),
				}),
				connectionProtocol: scenario.connectionProtocol,
				connectionMethod: scenario.connectionMethod,
				chain: scenario.chain,
				requestMethod: scenario.requestMethod,
				lifecycleEdgeCase: scenario.lifecycleEdgeCase,
				outcome,
				evidence,
			}
		}))

	return results
}

export const summarizeWalletMatrixResults = (results: readonly WalletMatrixResult[]) => {
	const byOutcome = {
		blocked: 0,
		inaccessible: 0,
		pass: 0,
		unsupported: 0,
	} satisfies Record<WalletMatrixOutcome, number>

	for (const { outcome } of results)
		byOutcome[outcome] += 1

	return {
		total: results.length,
		byOutcome,
		results,
	}
}

export const formatWalletMatrixReport = (
	results: readonly WalletMatrixResult[],
	{
		label,
		expectedOutcomes,
	}: {
		label?: string
		expectedOutcomes?: readonly WalletMatrixOutcome[]
	} = {}
) => {
	const summary = summarizeWalletMatrixResults(results)
	const unexpected = (
		expectedOutcomes == null ?
			[]
		:
			results.filter(({ outcome }) => !expectedOutcomes.includes(outcome))
	)

	return {
		...(label != null && {
			label,
		}),
		total: summary.total,
		byOutcome: summary.byOutcome,
		...(expectedOutcomes != null && {
			expectedOutcomes: [
				...expectedOutcomes,
			],
			unexpectedCount: unexpected.length,
			unexpected: unexpected.map(({
				id,
				outcome,
				evidence,
			}) => ({
				id,
				outcome,
				evidence,
			})),
		}),
		results: summary.results,
	}
}

export const logWalletMatrixResults = (
	results: readonly WalletMatrixResult[],
	options?: {
		label?: string
		expectedOutcomes?: readonly WalletMatrixOutcome[]
	}
) => {
	const report = formatWalletMatrixReport(results, options)
	console.log(JSON.stringify(report, null, 2))
	return report
}

export const assertWalletMatrixOutcomes = (
	results: readonly WalletMatrixResult[],
	expectedOutcomes: readonly WalletMatrixOutcome[],
	label?: string
) => {
	const report = formatWalletMatrixReport(results, {
		label,
		expectedOutcomes,
	})
	if (report.unexpectedCount !== 0)
		throw new Error(`Wallet matrix outcomes mismatched:\n${JSON.stringify(report, null, 2)}`)

	return report
}
