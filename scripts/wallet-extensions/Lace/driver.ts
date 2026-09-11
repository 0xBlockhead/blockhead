import { verifyCardanoCip30SignData } from '$/state/wallets/adapters/cardanoCip30SignData.ts'
import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import {
	openExtensionPage,
	type LoadedWalletExtension,
	type WalletDriver,
} from '../WalletExtensionHarness.ts'


// Types

export type LaceWallet = {
	page: Page
}

type LaceCip30SignDataResponse = Parameters<typeof verifyCardanoCip30SignData>[0]['response']

export type LaceCip30Api = {
	getUsedAddresses(): Promise<readonly string[]>
	signData(address: string, payload: string): Promise<LaceCip30SignDataResponse>
}

export type LaceCip30Provider = {
	enable(): Promise<LaceCip30Api>
	isEnabled(): Promise<boolean>
}

export class LaceCip30SigningLifecycle {
	#active = true
	#generation = 0

	begin() {
		if (!this.#active)
			throw new Error('Lace CIP-30 signing lifecycle is not active')

		return this.#generation
	}

	disconnect() {
		this.#active = false
		this.#generation += 1
	}

	reconnect() {
		this.#generation += 1
		this.#active = true
	}

	stop() {
		this.#active = false
		this.#generation += 1
	}

	isCurrent(generation: number) {
		return this.#active && generation === this.#generation
	}
}


// Functions

const assertCurrentLaceCip30Operation = (
	lifecycle: LaceCip30SigningLifecycle,
	generation: number
) => {
	if (!lifecycle.isCurrent(generation))
		throw new Error('Lace CIP-30 signData operation became stale during lifecycle transition')
}

/**
 * Calls `isEnabled()` before `enable()` so an unconnected provider is rejected.
 * `enable()` remains the required CIP-30 API-acquisition call; identity reads do not avoid it.
 */
export const signLaceCip30Data = async ({
	address,
	lifecycle,
	payload,
	provider,
}: {
	address: string
	lifecycle: LaceCip30SigningLifecycle
	payload: string
	provider: LaceCip30Provider
}) => {
	const generation = lifecycle.begin()
	const enabled = await provider.isEnabled.call(provider)
	assertCurrentLaceCip30Operation(lifecycle, generation)
	if (!enabled)
		throw new Error('Lace CIP-30 provider is not enabled')

	const api = await provider.enable.call(provider)
	assertCurrentLaceCip30Operation(lifecycle, generation)
	const usedAddresses = await api.getUsedAddresses.call(api)
	assertCurrentLaceCip30Operation(lifecycle, generation)
	if (!usedAddresses.includes(address))
		throw new Error('Lace CIP-30 selected account is not available for signData')

	const response = await api.signData.call(api, address, payload)
	assertCurrentLaceCip30Operation(lifecycle, generation)
	const signature = verifyCardanoCip30SignData({
		address,
		payload,
		response,
	})
	assertCurrentLaceCip30Operation(lifecycle, generation)

	return signature
}

const laceSidePanelBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'side-panel-onboarding-blocked' ?
		'Lace 2.2.0 headed expo side-panel create-new onboarding is not reliably executable in unattended automation'
	: lifecycleEdgeCase === 'side-panel-second-account-blocked' ?
		'Lace second-account derivation depends on side-panel onboarding that is not yet reliably executable'
	: lifecycleEdgeCase === 'side-panel-recover-blocked' ?
		'Lace side-panel recover onboarding is not reliably executable in unattended automation'
	:
		'Lace side-panel automation is blocked'
)

export const laceSidePanelBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: laceSidePanelBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/**
 * Lace 2.2.0 CIP-30 Connect chrome surfaces through the expo SPA (`expo/index.html`).
 * The v1 `dappConnector.html` entrypoint is absent from the pinned package.
 */
export const isLaceExpoPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/expo/index.html')
)

const openSidePanel = (
	context: BrowserContext,
	extension: LoadedWalletExtension
) => (
	openExtensionPage(context, extension, 'expo/index.html')
)

export const laceDriver = {
	kind: 'lace',
	open: openSidePanel,
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		const page = await openSidePanel(context, extension)
		await expect(page.getByRole('button', {
			name: /^Create$/i,
		})).toBeVisible()
		await page.getByRole('button', {
			name: /^Create$/i,
		}).click()
		await page.getByRole('button', {
			name: /accept|agree|continue/i,
		}).last().click()
		const analyticsChoice = page.getByRole('button', {
			name: /skip|decline|no thanks/i,
		})
		if (await analyticsChoice.isVisible())
			await analyticsChoice.click()

		await page.getByRole('textbox').first().fill('Blockhead ephemeral Lace')
		const passwordInputs = page.locator('input[type="password"]')
		await passwordInputs.first().fill(password)
		await passwordInputs.last().fill(password)
		await page.getByRole('button', {
			name: /create wallet|continue|next/i,
		}).last().click()

		return page
	},
	createAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	): Promise<LaceWallet> => {
		const page = await laceDriver.onboard(
			context,
			extension,
			password
		)
		await expect(page.getByText(/account 1/i).first()).toBeVisible({
			timeout: 120_000,
		})
		await page.getByRole('button', {
			name: /add account/i,
		}).click()
		await expect(page.getByText(/account 2/i).first()).toBeVisible({
			timeout: 120_000,
		})

		return {
			page,
		}
	},
	approveConnection: async (page: Page) => {
		await page.getByRole('button', {
			name: /connect|allow/i,
		}).last().click()
	},
} as const satisfies WalletDriver<'lace'> & {
	createAccounts: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => Promise<LaceWallet>
}
