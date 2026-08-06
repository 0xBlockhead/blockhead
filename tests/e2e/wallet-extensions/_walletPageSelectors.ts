import type {
	Locator,
	Page,
} from '@playwright/test'


/**
 * Product-page selectors for `/~/wallets`.
 * Prefer: role+name → label → canonical href/id → data-scroll-marker-label → data-e2e (last; avoid).
 *
 * `walletConnectNameByDriver` keys match PascalCase folders under `scripts/wallet-extensions/<Wallet>/driver.ts`.
 */

export const walletConnectNameByDriver = {
	Ambire: 'Ambire',
	ArgentX: 'Argent X',
	Backpack: 'Backpack',
	Keplr: 'Keplr',
	Lace: 'Lace',
	MetaMask: 'MetaMask',
	Petra: 'Petra',
	PolkadotJs: 'polkadot-js',
	Rabby: 'Rabby',
	Taho: 'Taho',
	Tonkeeper: 'Tonkeeper',
	UniSat: 'UniSat',
	Zerion: 'Zerion',
} as const

export type WalletDriverFolder = keyof typeof walletConnectNameByDriver

export const walletConnectionsStatus = (page: Page) => (
	page.locator('article#wallet-connections').or(
		page.getByRole('article', {
			name: 'Wallet connection status',
		})
	)
)

export const walletConnectionsStatusById = (page: Page) => (
	page.locator('#wallet-connections')
)

export const connectWalletButton = (page: Page, walletName: string) => (
	page.getByRole('button', {
		name: `Connect ${walletName}`,
		exact: true,
	})
)

export const connectWalletButtonForDriver = (
	page: Page,
	driver: WalletDriverFolder
) => (
	connectWalletButton(page, walletConnectNameByDriver[driver])
)

export const walletCandidateCard = (page: Page, walletName: string) => (
	page.getByRole('article').filter({
		has: connectWalletButton(page, walletName),
	})
)

export const walletConnectionCard = (page: Page, walletName: string) => (
	page.getByRole('article').filter({
		has: page.getByRole('link', {
			name: walletName,
			exact: true,
		}).and(page.locator('[href*="/~/wallets/connections/"]')),
	}).filter({
		has: page.getByRole('group', {
			name: 'Active account and network',
		}).or(page.getByRole('radio')),
	})
)

export const walletConnectionCardByNameFallback = (page: Page, walletName: string) => (
	page.getByRole('article').filter({
		has: page.getByRole('link', {
			name: walletName,
			exact: true,
		}),
	})
)

export const selectedWalletAccount = (connection: Locator) => (
	connection.getByRole('radio', {
		checked: true,
	})
)

export const selectedWalletAccountLabel = (connection: Locator) => (
	connection.locator('label:has(input[type="radio"]:checked)')
)

export const walletAccountRadio = (connection: Locator, accountLabel: string | RegExp) => (
	connection.getByRole('radio', {
		name: accountLabel,
	})
)

export const retryConnectionButton = (page: Page) => (
	page.getByRole('button', {
		name: /^Retry (?:connection|connect)$/,
	})
)

export const disconnectWalletButton = (scope: Page | Locator) => (
	scope.getByRole('button', {
		name: /Disconnect (?:wallet|from Blockhead)/,
	})
)

export const messageToSignInput = (connection: Locator) => (
	connection.getByLabel('Message to sign')
)

export const signMessageButton = (connection: Locator) => (
	connection.getByRole('button', {
		name: 'Sign message',
		exact: true,
	})
)

export const walletRequestHistory = (page: Page) => (
	page.locator('#wallet-connections-requests')
)
