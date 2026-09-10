import {
	expect,
	type Locator,
	type Page,
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
	Phantom: 'Phantom',
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

export const waitForWalletPageReady = async (
	page: Page,
	timeout = 45_000
) => {
	const walletSurface = walletConnectionsStatusById(page)
	const routeFailure = page.locator('main [role="alert"]')
	await expect(walletSurface.or(routeFailure)).toBeVisible({ timeout })
	if (await routeFailure.isVisible())
		throw new Error('Wallet route failed before provider discovery; inspect structural diagnostics')
	return walletSurface
}

export const connectWalletButton = (page: Page, walletName: string) => (
	page.locator(`[data-wallet-name="${walletName}"][data-wallet-state="candidate"] [data-wallet-action="connect"]`)
)

export const connectWalletButtonForDriver = (
	page: Page,
	driver: WalletDriverFolder
) => (
	connectWalletButton(page, walletConnectNameByDriver[driver])
)

export const walletCandidateCard = (page: Page, walletName: string) => (
	page.locator(`[data-wallet-name="${walletName}"][data-wallet-state="candidate"]`)
)

export const walletConnectionCard = (page: Page, walletName: string) => (
	page.locator(`[data-wallet-name="${walletName}"][data-wallet-state="connection"]`)
)

export const walletConnectionCardById = (page: Page, walletId: string) => (
	page.locator(`[data-wallet-id="${walletId}"][data-wallet-state="connection"]`)
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
	connection.locator('[data-wallet-action="select-account"]:checked')
)

export const selectedWalletAccountLabel = (connection: Locator) => (
	connection.locator('label:has([data-wallet-action="select-account"]:checked)')
)

export const walletAccountRadio = (connection: Locator, accountLabel: string | RegExp) => (
	connection.getByRole('radio', {
		name: accountLabel,
	})
)

export const retryConnectionButton = (page: Page) => (
	page.locator('[data-wallet-action="retry"]')
)

export const disconnectWalletButton = (scope: Page | Locator) => (
	scope.locator('[data-wallet-action="disconnect"]')
)

export const messageToSignInput = (connection: Locator) => (
	connection.locator('[data-wallet-action="sign-message"] input[name="message"]')
)

export const signMessageButton = (connection: Locator) => (
	connection.locator('button[data-wallet-action="sign-message"]')
)

export const walletRequestHistory = (page: Page) => (
	page.locator('#wallet-connections-requests')
)
