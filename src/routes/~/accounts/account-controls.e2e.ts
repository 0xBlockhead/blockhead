import { expect, test } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

import {
	expectMainAttached,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

declare global {
	interface Window {
		emitAptosAccountChange(accountAddress: string | null): void
		emitAptosNetworkChange(chainId: string): void
		emitBitcoinAccountChange(accountAddress: string): void
		emitBitcoinDisconnect(): void
		emitBitcoinNetworkChange(network: string): void
		emitPolkadotAccountsChange(accountAddresses: string[]): void
		emitStarknetAccountsChange(accountAddresses: string[]): void
		emitStarknetNetworkChange(chainId: string, accountAddresses: string[]): void
		completeWalletControlAccountRequest(): void
		emitWalletControlAccountsChanged(accountAddresses: string[]): void
		emitWalletControlChainChanged(chainId: string): void
		emitWalletProtocolAccountsChanged(protocol: 'tron' | 'wallet-standard', accountAddresses: string[]): void
		emitWalletProtocolChainChanged(protocol: 'tron' | 'wallet-standard', chainId: string): void
		setWalletControlProviderAvailable(available: boolean): void
		setKeplrAccountAddress(accountAddress: string): void
		walletControlAccountRequestCount: number
	}

	interface WindowEventMap {
		'wallet-standard:app-ready': CustomEvent<{
			register(...wallets: object[]): () => void
		}>
	}
}

test.setTimeout(180_000)

const installIsolatedLocalDatabase = async (
	page: Page,
	testInfo: TestInfo,
	label: string
) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-${label}-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
}

test('reject retry provider events disappearance restore removal and account composition lifecycle', async ({ page }, testInfo) => {
	await installIsolatedLocalDatabase(page, testInfo, 'eip1193-wallet')
	await page.addInitScript(() => {
		const providerAvailabilityKey = 'blockhead-e2e-wallet-control-provider-available'
		let accountAddresses = [
			'0x1111111111111111111111111111111111111111',
			'0x2222222222222222222222222222222222222222',
		]
		let chainId = '0x1'
		const listeners = new Map<string, ((payload: string | string[]) => void)[]>()
		let accountRequestCount = 0
		let completeAccountRequest = () => {}
		if (window.localStorage.getItem(providerAvailabilityKey) == null)
			window.localStorage.setItem(providerAvailabilityKey, 'true')

		window.walletControlAccountRequestCount = 0
		window.completeWalletControlAccountRequest = () => completeAccountRequest()
		window.emitWalletControlAccountsChanged = (nextAccountAddresses) => {
			accountAddresses = nextAccountAddresses
			for (const listener of listeners.get('accountsChanged') ?? [])
				listener(nextAccountAddresses)
		}
		window.emitWalletControlChainChanged = (nextChainId) => {
			chainId = nextChainId
			for (const listener of listeners.get('chainChanged') ?? [])
				listener(nextChainId)
		}
		window.setWalletControlProviderAvailable = (available) => {
			window.localStorage.setItem(providerAvailabilityKey, String(available))
		}
		const detail = {
			info: {
				uuid: 'wallet-control-e2e',
				name: 'Wallet control test provider',
				icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
				rdns: 'test.blockhead.wallet-control',
			},
			provider: {
				request: async ({ method }: { method: string }) => {
					if (method === 'eth_requestAccounts') {
						accountRequestCount += 1
						window.walletControlAccountRequestCount = accountRequestCount
						if (accountRequestCount === 1)
							throw new Error('User rejected the wallet request')

						await new Promise<void>((resolve) => {
							completeAccountRequest = resolve
						})
						return accountAddresses
					}
					if (method === 'eth_chainId')
						return chainId

					throw new Error(`Unexpected wallet method: ${method}`)
				},
				on: (
					event: string,
					listener: (payload: string | string[]) => void
				) => {
					listeners.set(event, [
						...(listeners.get(event) ?? []),
						listener,
					])
				},
				removeListener: (
					event: string,
					listener: (payload: string | string[]) => void
				) => {
					listeners.set(
						event,
						(listeners.get(event) ?? []).filter((candidate) => candidate !== listener)
					)
				},
			},
		}
		window.addEventListener('eip6963:requestProvider', () => {
			if (window.localStorage.getItem(providerAvailabilityKey) !== 'true')
				return

			window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
				detail,
			}))
		})
	})

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	const walletStatus = page.locator('article#wallet-connections[data-card][data-scroll-container]')
	await expect(walletStatus).toContainText('Active connections: 0. Saved connections: 0. Providers detected: 1.')
	await expect(page.getByText('No wallet connected.')).toHaveCount(0)

	await page.getByRole('button', {
		name: 'Connect Wallet control test provider',
	}).click()
	await expect(page.getByText('User rejected the wallet request')).toBeAttached({
		timeout: 120_000,
	})
	expect(diagnostics.issues, 'rejected request must remain a resolved wallet state').toEqual([])

	await page.getByRole('button', {
		name: 'Retry connection',
	}).click()
	await expect(page.getByText('connecting', {
		exact: true,
	}).first()).toBeAttached()
	await expect(page.locator('#main').getByText('Wallet control test provider')).toHaveCount(1)
	expect(await page.evaluate(() => window.walletControlAccountRequestCount)).toBe(2)
	await page.evaluate(() => window.completeWalletControlAccountRequest())
	await expect(page.getByText('connected', {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(walletStatus).toContainText('Active connections: 1. Saved connections: 1. Providers detected: 1.')
	expect(diagnostics.issues, 'connected wallet authority must precede visible state').toEqual([])

	const secondAccount = page.getByRole('radio', {
		name: /0x2222222222222222222222222222222222222222/,
	})
	await secondAccount.check()
	await expect(secondAccount).toBeChecked()
	await expect(secondAccount.locator('..').getByText('eip155:1')).toBeAttached()
	await expect(page.getByText('0x1111111111111111111111111111111111111111', {
		exact: true,
	}).first()).toBeAttached()
	await expect(page.getByText('0x2222222222222222222222222222222222222222', {
		exact: true,
	}).first()).toBeAttached()
	await expect(page.getByRole('heading', {
		name: 'Accounts',
	})).toContainText('Accounts (2)')

	const changedAccount = '0x3333333333333333333333333333333333333333'
	await page.evaluate((accountAddress) => {
		window.emitWalletControlAccountsChanged([accountAddress])
	}, changedAccount)
	await expect(page.getByRole('radio', {
		name: new RegExp(changedAccount),
	})).toBeChecked({
		timeout: 120_000,
	})
	await expect(page.getByRole('radio', {
		name: /0x1111111111111111111111111111111111111111/,
	})).toHaveCount(0)

	await page.evaluate(() => window.emitWalletControlChainChanged('0x89'))
	await expect(page.getByRole('radio', {
		name: new RegExp(changedAccount),
	}).locator('..').getByText('eip155:137')).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#blockhead-accounts').getByText(`eip155:137:${changedAccount}`, {
		exact: true,
	})).toBeAttached()

	await page.evaluate(() => window.setWalletControlProviderAvailable(false))
	await page.reload({ waitUntil: 'load' })
	await expect(page.getByText('Provider unavailable. This saved connection is read-only.')).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.getByRole('button', {
		name: 'Disconnect from Blockhead',
	})).toHaveCount(0)
	await expect(page.locator('#blockhead-accounts').getByText(`eip155:137:${changedAccount}`, {
		exact: true,
	})).toBeAttached()

	await page.evaluate(() => window.setWalletControlProviderAvailable(true))
	await page.reload({ waitUntil: 'load' })
	await expect(page.getByRole('button', {
		name: 'Disconnect from Blockhead',
	})).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByRole('radio', {
		name: new RegExp(changedAccount),
	})).toBeChecked()

	await page.evaluate(() => window.emitWalletControlAccountsChanged([]))
	await expect(page.getByText('disconnected', {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.getByRole('button', {
		name: 'Retry connect',
	})).toBeVisible()

	await expect(page.locator('#main').getByText('Wallet control test provider')).toHaveCount(1)

	await page.reload({ waitUntil: 'load' })
	await expect(page.locator('#blockhead-accounts').getByText('eip155:1:0x1111111111111111111111111111111111111111', {
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#blockhead-accounts').getByText('eip155:1:0x2222222222222222222222222222222222222222', {
		exact: true,
	})).toBeAttached()
	await expect(page.locator('#blockhead-accounts').getByText(`eip155:137:${changedAccount}`, {
		exact: true,
	})).toBeAttached()
	await expect(page.getByRole('button', {
		name: 'Retry connect',
	})).toBeVisible()
	await expect(page.getByText('User rejected the wallet request')).toHaveCount(0)
	expect(diagnostics.issues, 'restored disconnected facts must remain authoritative').toEqual([])
	await page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'Wallet control test provider',
			exact: true,
		}),
	}).getByRole('button', {
		name: 'Remove connection',
	}).click()
	await expect(page.getByRole('button', {
		name: 'Connect Wallet control test provider',
	})).toBeVisible()
	await expect(walletStatus).toContainText('Active connections: 0. Saved connections: 0. Providers detected: 1.')
	await expect(page.locator('#blockhead-accounts').getByText('eip155:1:0x1111111111111111111111111111111111111111', {
		exact: true,
	})).toBeAttached()
	await page.reload({ waitUntil: 'load' })
	await expect(page.getByRole('button', {
		name: 'Connect Wallet control test provider',
	})).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'Wallet control test provider',
			exact: true,
		}),
	}).getByRole('button', {
		name: 'Remove connection',
	})).toHaveCount(0)
	expect(diagnostics.issues).toEqual([])
})

test('connects and restores Cosmos signer accounts into the public transaction aggregate', async ({ page }, testInfo) => {
	const firstAccount = 'cosmos1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnrql8a'
	const secondAccount = 'cosmos1llllllllllllllllllllllllllllllllll8j5q'
	const transactionHash = 'B4A9D8C4319136E5C2BD96C78E165827820E051703D3F50D7C42D25A93691E3B'
	const accountStorageKey = 'blockhead-e2e-keplr-account'
	const transactionEvents = new Set<string>()

	await installIsolatedLocalDatabase(page, testInfo, 'cosmos-wallet')
	await page.addInitScript(({
		accountStorageKey,
		firstAccount,
	}) => {
		if (window.localStorage.getItem(accountStorageKey) == null)
			window.localStorage.setItem(accountStorageKey, firstAccount)

		window.setKeplrAccountAddress = (accountAddress) => {
			window.localStorage.setItem(accountStorageKey, accountAddress)
			window.dispatchEvent(new Event('keplr_keystorechange'))
		}
		Object.assign(window, {
			keplr: {
				enable: async (chainId: string) => {
					if (chainId !== 'cosmoshub-4')
						throw new Error(`Unexpected Keplr chain: ${chainId}`)
				},
				getOfflineSignerAuto: async (chainId: string) => {
					if (chainId !== 'cosmoshub-4')
						throw new Error(`Unexpected Keplr signer chain: ${chainId}`)

					return {
						getAccounts: async () => [{
							address: window.localStorage.getItem(accountStorageKey) ?? firstAccount,
							pubkey: new Uint8Array(),
							algo: 'secp256k1',
						}],
					}
				},
			},
		})
	}, {
		accountStorageKey,
		firstAccount,
	})
	await installChainlistRpcsJsonStub(page)
	await page.route(/^https:\/\/rest\.cosmos\.directory\/cosmoshub\/cosmos\/tx\/v1beta1\/txs\?/, async (route) => {
		const url = new URL(route.request().url())
		expect(route.request().method()).toBe('GET')
		expect(url.searchParams.get('order_by')).toBe('ORDER_BY_DESC')
		expect(url.searchParams.get('page')).toBe('1')
		expect(url.searchParams.get('limit')).toBe('24')
		const event = url.searchParams.get('events')
		if (event == null)
			throw new Error('Cosmos transaction request is missing its event filter')
		expect([
			`message.sender='${firstAccount}'`,
			`transfer.recipient='${firstAccount}'`,
			`message.sender='${secondAccount}'`,
			`transfer.recipient='${secondAccount}'`,
		]).toContain(event)
		transactionEvents.add(event)
		const hasTransaction = event === `message.sender='${secondAccount}'`

		await route.fulfill({
			json: {
				txs: hasTransaction ? [{}] : [],
				tx_responses: (
					hasTransaction ?
						[{
							height: '23000000',
							txhash: transactionHash,
							code: 0,
							gas_wanted: '200000',
							gas_used: '112233',
							raw_log: '[]',
						}]
					:
						[]
				),
				total: hasTransaction ? '1' : '0',
			},
		})
	})

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await page.getByRole('button', {
		name: 'Connect Keplr',
	}).click()
	const connection = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'Keplr',
			exact: true,
		}),
	})
	await expect(connection.getByText('cosmos:cosmoshub-4', {
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(connection.getByRole('radio', {
		name: new RegExp(firstAccount),
	})).toBeChecked()
	await expect(page.locator('#blockhead-accounts').getByText(`cosmos:cosmoshub-4:${firstAccount}`, {
		exact: true,
	})).toBeAttached()

	await page.evaluate((accountAddress) => window.setKeplrAccountAddress(accountAddress), secondAccount)
	await expect(connection.getByRole('radio', {
		name: new RegExp(secondAccount),
	})).toBeChecked({
		timeout: 120_000,
	})
	await expect(connection.getByRole('radio', {
		name: new RegExp(firstAccount),
	})).toHaveCount(0)
	await expect(page.locator('#blockhead-accounts').getByText(`cosmos:cosmoshub-4:${secondAccount}`, {
		exact: true,
	})).toBeAttached()

	await page.reload({ waitUntil: 'load' })
	const restoredConnection = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'Keplr',
			exact: true,
		}),
	})
	await expect(restoredConnection.getByRole('radio', {
		name: new RegExp(secondAccount),
	})).toBeChecked({
		timeout: 120_000,
	})
	await expect(restoredConnection.getByText('cosmos:cosmoshub-4', {
		exact: true,
	})).toBeAttached()

	await page.goto('/~/accounts/transactions', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	const transactions = page.locator('#account-cosmos-transaction[data-card][data-scroll-container]')
	await expect(transactions.locator('li[data-list-item]')).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(transactions.getByRole('button', {
		name: transactionHash,
	})).toBeAttached()
	await expect(transactions.getByText('112233', {
		exact: true,
	})).toBeAttached()
	await expect.poll(() => [...transactionEvents].sort()).toEqual([
		`message.sender='${firstAccount}'`,
		`message.sender='${secondAccount}'`,
		`transfer.recipient='${firstAccount}'`,
		`transfer.recipient='${secondAccount}'`,
	])
	await expect(page.locator('[data-resource-state="pending"]')).toHaveCount(0)
	await expect(page.locator('[data-resource-state="failed"]')).toHaveCount(0)
	expect(diagnostics.issues).toEqual([])
})

test('connects Cardano CIP-30 accounts, selects one, and disconnects only from Blockhead', async ({ page }, testInfo) => {
	const firstAddress = 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x'
	const secondAddress = 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywffqrdnl0n'

	await installIsolatedLocalDatabase(page, testInfo, 'cardano-wallet')
	await page.addInitScript(() => {
		Object.assign(window, {
			cardano: {
				nami: {
					name: 'Nami',
					icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
					enable: async (options: {
						extensions: {
							cip: number
						}[]
					}) => {
						if (options.extensions[0]?.cip !== 142)
							throw new Error('CIP-142 was not requested')

						return {
							getNetworkId: async () => 1,
							getUsedAddresses: async () => [
								'019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
							],
							getUnusedAddresses: async () => [
								'019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47252',
							],
						}
					},
				},
			},
		})
	})
	await installChainlistRpcsJsonStub(page)

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await page.getByRole('button', {
		name: 'Connect Nami',
	}).click()

	const connection = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'Nami',
			exact: true,
		}),
	})
	await expect(connection.getByText('connected', {
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(connection.getByText('cip34:1-764824073', {
		exact: true,
	})).toHaveCount(2)
	await expect(connection.getByRole('radio', {
		name: new RegExp(firstAddress),
	})).toBeChecked()
	const secondAccount = connection.getByRole('radio', {
		name: new RegExp(secondAddress),
	})
	await secondAccount.check()
	await expect(secondAccount).toBeChecked()
	await expect(page.locator('#blockhead-accounts').getByText(`cip34:1-764824073:${firstAddress}`, {
		exact: true,
	})).toBeAttached()
	await expect(page.locator('#blockhead-accounts').getByText(`cip34:1-764824073:${secondAddress}`, {
		exact: true,
	})).toBeAttached()
	await expect(connection.getByRole('button', {
		name: 'Disconnect wallet',
	})).toHaveCount(0)
	await connection.getByRole('button', {
		name: 'Disconnect from Blockhead',
	}).click()
	await expect(connection.getByText('disconnected', {
		exact: true,
	})).toBeAttached()
	await expect(connection.getByRole('button', {
		name: 'Retry connect',
	})).toBeVisible()
	await expect(page.locator('#blockhead-accounts').getByText(`cip34:1-764824073:${firstAddress}`, {
		exact: true,
	})).toBeAttached()
	await expect(page.locator('#blockhead-accounts').getByText(`cip34:1-764824073:${secondAddress}`, {
		exact: true,
	})).toBeAttached()
	expect(diagnostics.issues).toEqual([])
})

test('verifies Wallet Standard and TRON provider lifecycles', async ({ page }, testInfo) => {
	const providers = [
		{
			protocol: 'wallet-standard',
			name: 'Wallet Standard test wallet',
			account: '11111111111111111111111111111111',
			changedAccount: 'SysvarRent111111111111111111111111111111111',
			chain: 'solana:mainnet',
			changedChain: 'solana:devnet',
		},
		{
			protocol: 'tron',
			name: 'TRON test provider',
			account: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
			changedAccount: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
			chain: 'tron:0x2b6653dc',
			changedChain: 'tron:0xcd8690dc',
		},
	] as const

	await installIsolatedLocalDatabase(page, testInfo, 'protocol-wallets')
	await page.addInitScript((providerFixtures) => {
		const listeners = new Map<string, Set<(payload: object | string[]) => void>>()
		const storageKey = (protocol: string, field: string) => `blockhead-e2e-${protocol}-${field}`
		for (const fixture of providerFixtures) {
			if (window.localStorage.getItem(storageKey(fixture.protocol, 'account')) == null)
				window.localStorage.setItem(storageKey(fixture.protocol, 'account'), fixture.account)
			if (window.localStorage.getItem(storageKey(fixture.protocol, 'chain')) == null)
				window.localStorage.setItem(storageKey(fixture.protocol, 'chain'), fixture.chain)
		}

		const listenersFor = (protocol: string, event: string) => {
			const key = `${protocol}:${event}`
			const eventListeners = listeners.get(key) ?? new Set()
			listeners.set(key, eventListeners)
			return eventListeners
		}
		window.emitWalletProtocolAccountsChanged = (protocol, accountAddresses) => {
			window.localStorage.setItem(storageKey(protocol, 'account'), accountAddresses[0] ?? '')
			for (const listener of listenersFor(protocol, protocol === 'wallet-standard' ? 'change' : 'accountsChanged'))
				listener(protocol === 'wallet-standard' ? {
					accounts: accountAddresses.map((address) => ({
						address,
						chains: [window.localStorage.getItem(storageKey(protocol, 'chain')) ?? ''],
						features: ['standard:signMessage'],
					})),
				} : accountAddresses)
		}
		window.emitWalletProtocolChainChanged = (protocol, chainId) => {
			window.localStorage.setItem(storageKey(protocol, 'chain'), chainId)
			if (protocol === 'wallet-standard') {
				window.emitWalletProtocolAccountsChanged(protocol, [window.localStorage.getItem(storageKey(protocol, 'account')) ?? ''])
				return
			}

			for (const listener of listenersFor(protocol, 'chainChanged'))
				listener({ chainId: chainId.slice(chainId.indexOf(':') + 1) })
		}

		const walletStandard = providerFixtures[0]
		window.addEventListener('wallet-standard:app-ready', (event) => {
			event.detail.register({
				name: walletStandard.name,
				icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
				features: {
					'standard:connect': {
						version: '1.0.0',
						connect: async () => {
							if (window.localStorage.getItem(storageKey(walletStandard.protocol, 'rejected')) == null) {
								window.localStorage.setItem(storageKey(walletStandard.protocol, 'rejected'), 'true')
								throw new Error('Wallet Standard request rejected')
							}

							return {
								accounts: [{
									address: window.localStorage.getItem(storageKey(walletStandard.protocol, 'account')),
									chains: [window.localStorage.getItem(storageKey(walletStandard.protocol, 'chain'))],
									features: ['standard:signMessage'],
								}],
							}
						},
					},
					'standard:events': {
						version: '1.0.0',
						on: (_event: string, listener: (payload: object | string[]) => void) => {
							listenersFor(walletStandard.protocol, 'change').add(listener)
							return () => listenersFor(walletStandard.protocol, 'change').delete(listener)
						},
					},
					'standard:disconnect': {
						version: '1.0.0',
						disconnect: async () => {},
					},
				},
			})
		})

		const tron = providerFixtures[1]
		const tronProvider = {
			request: async ({ method }: { method: string }) => {
				if (method === 'eth_accounts' || method === 'eth_requestAccounts')
					return [window.localStorage.getItem(storageKey(tron.protocol, 'account'))]
				if (method === 'eth_chainId')
					return window.localStorage.getItem(storageKey(tron.protocol, 'chain'))?.slice('tron:'.length)

				throw new Error(`Unexpected TRON method: ${method}`)
			},
			on: (event: string, listener: (payload: object | string[]) => void) => listenersFor(tron.protocol, event).add(listener),
			removeListener: (event: string, listener: (payload: object | string[]) => void) => listenersFor(tron.protocol, event).delete(listener),
		}
		window.addEventListener('TIP6963:requestProvider', () => window.dispatchEvent(new CustomEvent('TIP6963:announceProvider', {
			detail: {
				info: {
					uuid: 'tron-e2e',
					name: tron.name,
					icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
					rdns: 'test.blockhead.tron',
				},
				provider: tronProvider,
			},
		})))
	}, providers)

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	const walletStatus = page.locator('article#wallet-connections[data-card][data-scroll-container]')
	await expect(walletStatus).toContainText('Providers detected: 2.')
	for (const provider of providers)
		await expect(page.getByRole('button', {
			name: `Connect ${provider.name}`,
		})).toBeVisible()

	await page.getByRole('button', {
		name: `Connect ${providers[0].name}`,
	}).click()
	await expect(page.getByText('Wallet Standard request rejected')).toBeAttached({
		timeout: 120_000,
	})
	await page.getByRole('button', {
		name: 'Retry connection',
	}).click()
	await page.getByRole('button', {
		name: `Connect ${providers[1].name}`,
	}).click()
	await expect(walletStatus).toContainText('Active connections: 2. Saved connections: 2. Providers detected: 2.', {
		timeout: 120_000,
	})

	for (const provider of providers) {
		const connection = page.locator('article[data-card][data-scroll-container]').filter({
			has: page.getByRole('link', {
				name: provider.name,
				exact: true,
			}),
		})
		await expect(connection.getByRole('radio', {
			name: new RegExp(provider.account),
		})).toBeChecked()
		await expect(connection.getByText(provider.chain, {
			exact: true,
		})).toBeAttached()
		await expect(page.locator('#blockhead-accounts').getByText(`${provider.chain}:${provider.account}`, {
			exact: true,
		})).toBeAttached()

		await page.evaluate(({ protocol, changedAccount }) => window.emitWalletProtocolAccountsChanged(protocol, [changedAccount]), provider)
		await page.evaluate(({ protocol, changedChain }) => window.emitWalletProtocolChainChanged(protocol, changedChain), provider)
		await expect(connection.getByRole('radio', {
			name: new RegExp(provider.changedAccount),
		})).toBeChecked({
			timeout: 120_000,
		})
		await expect(connection.getByText(provider.changedChain, {
			exact: true,
		})).toBeAttached()
		await expect(page.locator('#blockhead-accounts').getByText(`${provider.changedChain}:${provider.changedAccount}`, {
			exact: true,
		})).toBeAttached()
	}

	await page.reload({ waitUntil: 'load' })
	await expect(walletStatus).toContainText('Active connections: 2. Saved connections: 2. Providers detected: 2.', {
		timeout: 120_000,
	})
	for (const provider of providers)
		await expect(page.getByRole('radio', {
			name: new RegExp(provider.changedAccount),
		})).toBeChecked()

	for (const [index, provider] of providers.entries()) {
		const connection = page.locator('article[data-card][data-scroll-container]').filter({
			has: page.getByRole('link', {
				name: provider.name,
				exact: true,
			}),
		})
		await connection.getByRole('button', {
			name: index === 0 ? 'Disconnect wallet' : 'Disconnect from Blockhead',
		}).click()
		await expect(connection.getByText('disconnected', {
			exact: true,
		})).toBeAttached()
	}
	await expect(walletStatus).toContainText('Active connections: 0. Saved connections: 2. Providers detected: 2.')
	for (const provider of providers)
		await expect(page.locator('#blockhead-accounts').getByText(`${provider.changedChain}:${provider.changedAccount}`, {
			exact: true,
		})).toBeAttached()
	expect(diagnostics.issues).toEqual([])
})

test('verifies Aptos, Sats Connect, Starknet, and Polkadot wallet lifecycles', async ({ page }, testInfo) => {
	const wallets = {
		aptos: {
			name: 'Petra',
			account: `0x${'1'.repeat(64)}`,
			changedAccount: `0x${'2'.repeat(64)}`,
			chain: 'aptos:1',
			changedChain: 'aptos:2',
		},
		bitcoin: {
			name: 'Xverse',
			account: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
			changedAccount: 'tb1qfm3g8vl9t2y0e0eq6y8t5c6v4r3n2m1k0j9h8g',
			chain: 'bip122:000000000019d6689c085ae165831e93',
			changedChain: 'bip122:000000000933ea01ad0ee984209779ba',
		},
		starknet: {
			name: 'Argent X',
			account: '0x1234',
			changedAccount: '0x5678',
			chain: 'starknet:SN_MAIN',
			changedChain: 'starknet:SN_SEPOLIA',
		},
		polkadot: {
			name: 'polkadot-js',
			account: '15oF4uVJwmo4w4uUeZVqWTFu9vQh7Z4pYtM7mYx2zY7bK2nT',
			changedAccount: '14Gjs1TDhV3DkWJYw4cWzM8G3qN2F6bY9pP7xR5tU2vA8sC',
			chain: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		},
	} as const

	await installIsolatedLocalDatabase(page, testInfo, 'remaining-protocol-wallets')
	await page.addInitScript((fixtures) => {
		const key = (protocol: string, field: string) => `blockhead-e2e-${protocol}-${field}`
		for (const [protocol, fixture] of Object.entries(fixtures)) {
			if (window.localStorage.getItem(key(protocol, 'account')) == null)
				window.localStorage.setItem(key(protocol, 'account'), fixture.account)
			if (window.localStorage.getItem(key(protocol, 'chain')) == null)
				window.localStorage.setItem(
					key(protocol, 'chain'),
					protocol === 'bitcoin' ?
						'mainnet'
					: protocol === 'starknet' ?
						'0x534e5f4d41494e'
					:
						fixture.chain.slice(fixture.chain.indexOf(':') + 1)
				)
		}

		let aptosAccountChange = (_account: { address: string, publicKey: string } | null) => {}
		let aptosNetworkChange = (_network: { name: string, chainId: string }) => {}
		let bitcoinRejected = false
		const bitcoinListeners = new Map<string, Set<() => void>>()
		let polkadotAccountsChange = (_accounts: { address: string, genesisHash: string }[]) => {}
		const starknetListeners = new Map<string, Set<(...values: (string | string[])[]) => void>>()

		window.emitAptosAccountChange = (accountAddress) => {
			window.localStorage.setItem(key('aptos', 'account'), accountAddress ?? '')
			aptosAccountChange(accountAddress == null ? null : {
				address: accountAddress,
				publicKey: '0x01',
			})
		}
		window.emitAptosNetworkChange = (chainId) => {
			window.localStorage.setItem(key('aptos', 'chain'), chainId)
			aptosNetworkChange({ name: 'test', chainId })
		}
		window.emitBitcoinAccountChange = (accountAddress) => {
			window.localStorage.setItem(key('bitcoin', 'account'), accountAddress)
			for (const listener of bitcoinListeners.get('accountChange') ?? []) listener()
		}
		window.emitBitcoinNetworkChange = (network) => {
			window.localStorage.setItem(key('bitcoin', 'chain'), network)
			for (const listener of bitcoinListeners.get('networkChange') ?? []) listener()
		}
		window.emitBitcoinDisconnect = () => {
			for (const listener of bitcoinListeners.get('accountDisconnected') ?? []) listener()
		}
		window.emitStarknetAccountsChange = (accountAddresses) => {
			window.localStorage.setItem(key('starknet', 'account'), accountAddresses[0] ?? '')
			for (const listener of starknetListeners.get('accountsChanged') ?? []) listener(accountAddresses)
		}
		window.emitStarknetNetworkChange = (chainId, accountAddresses) => {
			window.localStorage.setItem(key('starknet', 'chain'), chainId)
			window.localStorage.setItem(key('starknet', 'account'), accountAddresses[0] ?? '')
			for (const listener of starknetListeners.get('networkChanged') ?? []) listener(chainId, accountAddresses)
		}
		window.emitPolkadotAccountsChange = (accountAddresses) => {
			window.localStorage.setItem(key('polkadot', 'account'), accountAddresses[0] ?? '')
			polkadotAccountsChange(accountAddresses.map((address) => ({
				address,
				genesisHash: `0x${fixtures.polkadot.chain.slice('polkadot:'.length)}${'0'.repeat(32)}`,
			})))
		}

		Object.assign(window, {
			aptos: {
				get account() {
					const address = window.localStorage.getItem(key('aptos', 'account'))
					return address ? { address, publicKey: '0x01' } : null
				},
				connect: async () => {
					const address = window.localStorage.getItem(key('aptos', 'account')) ?? fixtures.aptos.account
					return { address, publicKey: '0x01' }
				},
				disconnect: async () => {},
				getNetwork: async () => ({
					name: 'test',
					chainId: window.localStorage.getItem(key('aptos', 'chain')) ?? '1',
				}),
				onAccountChange: (listener: typeof aptosAccountChange) => {
					aptosAccountChange = listener
				},
				onNetworkChange: (listener: typeof aptosNetworkChange) => {
					aptosNetworkChange = listener
				},
			},
			XverseProviders: {
				BitcoinProvider: {
					request: async (method: string) => {
						if (method === 'wallet_connect' && !bitcoinRejected) {
							bitcoinRejected = true
							throw new Error('Sats Connect request rejected')
						}
						if (method === 'wallet_disconnect') return null
						if (method !== 'wallet_connect' && method !== 'wallet_getAccount')
							throw new Error(`Unexpected Sats Connect method: ${method}`)

						return {
							status: 'success',
							result: {
								addresses: [{
									address: window.localStorage.getItem(key('bitcoin', 'account')),
									network: window.localStorage.getItem(key('bitcoin', 'chain')),
									purpose: 'payment',
								}],
							},
						}
					},
					addListener: (event: string, listener: () => void) => {
						const listeners = bitcoinListeners.get(event) ?? new Set()
						listeners.add(listener)
						bitcoinListeners.set(event, listeners)
						return () => listeners.delete(listener)
					},
				},
			},
			starknet_argentX: {
				name: fixtures.starknet.name,
				request: async ({ type }: { type: string }) => {
					if (type === 'wallet_requestAccounts') {
						const address = window.localStorage.getItem(key('starknet', 'account'))
						return address ? [address] : []
					}
					if (type === 'wallet_requestChainId')
						return window.localStorage.getItem(key('starknet', 'chain'))

					throw new Error(`Unexpected Starknet method: ${type}`)
				},
				on: (event: string, listener: (...values: (string | string[])[]) => void) => {
					const listeners = starknetListeners.get(event) ?? new Set()
					listeners.add(listener)
					starknetListeners.set(event, listeners)
				},
				off: (event: string, listener: (...values: (string | string[])[]) => void) => starknetListeners.get(event)?.delete(listener),
			},
			injectedWeb3: {
				'polkadot-js': {
					enable: async () => ({
						accounts: {
							get: async () => [{
								address: window.localStorage.getItem(key('polkadot', 'account')),
								genesisHash: `0x${fixtures.polkadot.chain.slice('polkadot:'.length)}${'0'.repeat(32)}`,
							}],
							subscribe: (listener: typeof polkadotAccountsChange) => {
								polkadotAccountsChange = listener
								return () => {}
							},
						},
					}),
				},
			},
		})
	}, wallets)

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	const walletStatus = page.locator('article#wallet-connections[data-card][data-scroll-container]')
	await expect(walletStatus).toContainText('Providers detected: 4.')
	for (const wallet of Object.values(wallets))
		await expect(page.getByRole('button', {
			name: `Connect ${wallet.name}`,
		})).toBeVisible()

	await page.getByRole('button', { name: `Connect ${wallets.bitcoin.name}` }).click()
	await expect(page.getByText('Sats Connect request rejected')).toBeAttached({ timeout: 120_000 })
	await page.getByRole('button', { name: 'Retry connection' }).click()
	await expect(page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', { name: wallets.bitcoin.name, exact: true }),
	}).getByText('connected', { exact: true })).toBeAttached({ timeout: 120_000 })
	for (const wallet of [wallets.aptos, wallets.starknet, wallets.polkadot]) {
		await page.getByRole('button', { name: `Connect ${wallet.name}` }).click()
		await expect(page.locator('article[data-card][data-scroll-container]').filter({
			has: page.getByRole('link', { name: wallet.name, exact: true }),
		}).getByText('connected', { exact: true })).toBeAttached({ timeout: 120_000 })
	}
	await expect(walletStatus).toContainText('Active connections: 4. Saved connections: 4. Providers detected: 4.', {
		timeout: 120_000,
	})

	for (const wallet of Object.values(wallets)) {
		const connection = page.locator('article[data-card][data-scroll-container]').filter({
			has: page.getByRole('link', { name: wallet.name, exact: true }),
		})
		await expect(connection.getByRole('radio', { name: new RegExp(wallet.account) })).toBeChecked()
		await expect(connection.getByText(wallet.chain, { exact: true })).toBeAttached()
		await expect(page.locator('#blockhead-accounts').getByText(`${wallet.chain}:${wallet.account}`, { exact: true })).toBeAttached()
	}

	await page.evaluate((account) => window.emitAptosAccountChange(account), wallets.aptos.changedAccount)
	await page.evaluate((chain) => window.emitAptosNetworkChange(chain.slice(chain.indexOf(':') + 1)), wallets.aptos.changedChain)
	await page.evaluate((account) => window.emitBitcoinAccountChange(account), wallets.bitcoin.changedAccount)
	await page.evaluate(() => window.emitBitcoinNetworkChange('testnet'))
	await page.evaluate(({ account, chain }) => window.emitStarknetNetworkChange(
		`0x${[...chain.slice(chain.indexOf(':') + 1)].map((character) => character.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`,
		[account]
	), {
		account: wallets.starknet.changedAccount,
		chain: wallets.starknet.changedChain,
	})
	await page.evaluate((account) => window.emitPolkadotAccountsChange([account]), wallets.polkadot.changedAccount)
	for (const wallet of Object.values(wallets)) {
		await expect(page.getByRole('radio', { name: new RegExp(wallet.changedAccount) })).toBeChecked({ timeout: 120_000 })
		await expect(page.locator('#blockhead-accounts').getByText(`${wallet.changedChain ?? wallet.chain}:${wallet.changedAccount}`, {
			exact: true,
		})).toBeAttached()
	}

	await page.evaluate(() => window.emitStarknetAccountsChange([]))
	await page.evaluate(() => window.emitPolkadotAccountsChange([]))
	await expect(walletStatus).toContainText('Active connections: 2. Saved connections: 4. Providers detected: 4.', {
		timeout: 120_000,
	})
	await page.evaluate(() => window.emitBitcoinDisconnect())
	await expect(walletStatus).toContainText('Active connections: 1. Saved connections: 4. Providers detected: 4.', {
		timeout: 120_000,
	})
	for (const wallet of Object.values(wallets))
		await expect(page.locator('#blockhead-accounts').getByText(`${wallet.changedChain ?? wallet.chain}:${wallet.changedAccount}`, {
			exact: true,
		})).toBeAttached()

	const aptosConnection = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', { name: wallets.aptos.name, exact: true }),
	})
	await aptosConnection.getByRole('button', { name: 'Disconnect wallet' }).click()
	await expect(walletStatus).toContainText('Active connections: 0. Saved connections: 4. Providers detected: 4.')
	await page.reload({ waitUntil: 'load' })
	await expect(walletStatus).toContainText('Saved connections: 4. Providers detected: 4.', { timeout: 120_000 })
	for (const wallet of Object.values(wallets))
		await expect(page.locator('#blockhead-accounts').getByText(`${wallet.changedChain ?? wallet.chain}:${wallet.changedAccount}`, {
			exact: true,
		})).toBeAttached()
	await expect(page.getByText('Sats Connect request rejected')).toHaveCount(0)
	expect(diagnostics.issues).toEqual([])
})

test('aggregates eligible public account data and omits ineligible facets', async ({ page }, testInfo) => {
	const firstAccount = '0x1111111111111111111111111111111111111111'
	const secondAccount = '0x2222222222222222222222222222222222222222'
	const walletAccount = '0x3333333333333333333333333333333333333333'
	const tonAccount = 'EQ/a+b'
	const aptosAccount = `0x${'1'.repeat(64)}`
	const tronAccount = 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
	const utxoAccount = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
	const transactionHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	const aptosTransactionHash = `0x${'d'.repeat(64)}`
	const tronTransactionId = 'b'.repeat(64)
	const utxoTransactionId = 'c'.repeat(64)
	const utxoTransaction = {
		txid: utxoTransactionId,
		version: 2,
		locktime: 0,
		size: 222,
		weight: 444,
		fee: 1_234,
		vin: [],
		vout: [],
		status: {
			confirmed: true,
			block_height: 840_000,
		},
	}
	const alliumAccountAddresses = new Set<string>()
	const aptosBalanceAccountAddresses = new Set<string>()
	const aptosTransactionAccountAddresses = new Set<string>()
	const blockchairAccountAddresses = new Set<string>()
	const blockscoutAccountAddresses = new Set<string>()
	const mempoolSpaceAccountAddresses = new Set<string>()
	const tonApiAccountAddresses = new Set<string>()
	const tronGridAccountAddresses = new Set<string>()
	const tronScanAccountAddresses = new Set<string>()

	await installIsolatedLocalDatabase(page, testInfo, 'account-aggregation')
	await page.addInitScript((account) => {
		window.addEventListener('eip6963:requestProvider', () => {
			window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
				detail: {
					info: {
						uuid: 'account-aggregation-e2e',
						name: 'Aggregate wallet',
						icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
						rdns: 'test.blockhead.account-aggregation',
					},
					provider: {
						request: async ({ method }: { method: string }) => {
							if (method === 'eth_requestAccounts')
								return [account]
							if (method === 'eth_chainId')
								return '0x1'

							throw new Error(`Unexpected aggregate wallet method: ${method}`)
						},
					},
				},
			}))
		})
	}, walletAccount)
	await installChainlistRpcsJsonStub(page)
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (
			route.request().method() === 'POST'
			&& url.includes('/api-proxy/Allium_Rest-8/0/https://api.allium.so/api/v1/developer/wallet/balances?with_liquidity_info=false')
		) {
			const [{
				address,
				chain,
			}]: [{
				address: string
				chain: string
			}] = JSON.parse(route.request().postData() ?? '[]')
			expect([
				firstAccount,
				secondAccount,
				walletAccount,
			]).toContain(address)
			expect(chain).toBe('ethereum')
			alliumAccountAddresses.add(address)
			await route.fulfill({
				json: {
					items: (
						address === firstAccount ?
							[{
								chain: 'ethereum',
								address,
								token: {
									chain: 'ethereum',
									address: '0x0000000000000000000000000000000000000000',
									type: 'native',
									decimals: 18,
									info: {
										name: 'Ether',
										symbol: 'ETH',
									},
								},
								raw_balance_str: '1000000000000000000',
								block_number: 20_000_000,
								block_timestamp: '2026-07-19T00:00:00Z',
							}]
						:
							[]
					),
				},
			})
			return
		}

		const blockscoutAccount = [
			firstAccount,
			secondAccount,
			walletAccount,
		].find((account) => (
			url.includes(`https://eth.blockscout.com/api/v2/addresses/${account}/transactions?items_count=50`)
		))
		if (
			route.request().method() === 'GET'
			&& blockscoutAccount != null
		) {
			blockscoutAccountAddresses.add(blockscoutAccount)
			await route.fulfill({
				json: {
					items: (
						blockscoutAccount === firstAccount ?
							[{
								hash: transactionHash,
							}]
						:
							[]
					),
					next_page_params: null,
				},
			})
			return
		}

		if (
			route.request().method() === 'GET'
			&& url.includes('/api-proxy/TonApi_Rest-301/0/https://tonapi.io/v2/accounts/')
		) {
			const account = decodeURIComponent(url.slice(url.lastIndexOf('/') + 1))
			expect(account).toBe(tonAccount)
			tonApiAccountAddresses.add(account)
			await route.fulfill({
				json: {
					address: '0:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
					balance: '1234567890',
					last_activity: 1_720_000_000,
					status: 'active',
					interfaces: [
						'wallet_v4r2',
					],
					get_methods: [
						'seqno',
					],
					is_wallet: true,
				},
			})
			return
		}

		if (
			route.request().method() === 'GET'
			&& url.includes(`https://mempool.space/api/address/${utxoAccount}/txs/chain`)
		) {
			expect(url).not.toContain('/api-proxy/')
			mempoolSpaceAccountAddresses.add(utxoAccount)
			await route.fulfill({
				json: [utxoTransaction],
			})
			return
		}

		if (
			route.request().method() === 'GET'
			&& url.includes(`https://mempool.space/api/tx/${utxoTransactionId}`)
		) {
			expect(url).not.toContain('/api-proxy/')
			await route.fulfill({
				json: utxoTransaction,
			})
			return
		}

		if (
			route.request().method() === 'GET'
			&& url.includes(`https://mempool.space/api/address/${utxoAccount}`)
		) {
			expect(url).not.toContain('/api-proxy/')
			mempoolSpaceAccountAddresses.add(utxoAccount)
			await route.fulfill({
				json: {
					chain_stats: {
						funded_txo_count: 2,
						funded_txo_sum: 75_000,
						spent_txo_count: 1,
						spent_txo_sum: 50_000,
						tx_count: 1,
					},
				},
			})
			return
		}

		if (
			route.request().method() === 'GET'
			&& url.includes(`https://api.blockchair.com/bitcoin/dashboards/address/${utxoAccount}`)
		) {
			expect(url).toContain('/api-proxy/')
			blockchairAccountAddresses.add(utxoAccount)
			await route.fulfill({
				json: {
					data: {
						[utxoAccount]: {
							address: {
								balance: 25_000,
								received: 75_000,
								spent: 50_000,
								transaction_count: 1,
								unspent_output_count: 1,
							},
							transactions: [utxoTransactionId],
						},
					},
					context: {},
				},
			})
			return
		}

		if (url.includes('https://api.trongrid.io')) {
			expect(url).toContain('/api-proxy/TronGrid_Rest-')
			if (
				route.request().method() === 'GET'
				&& url.includes(`/v1/accounts/${tronAccount}/transactions?`)
			) {
				const upstreamUrl = new URL(url.slice(url.indexOf('https://api.trongrid.io')))
				expect(upstreamUrl.searchParams.get('limit')).not.toBeNull()
				tronGridAccountAddresses.add(tronAccount)
				await route.fulfill({
					json: {
						data: [{
							txID: tronTransactionId,
							raw_data: {
								contract: [],
							},
						}],
					},
				})
				return
			}

			if (route.request().method() === 'POST') {
				const body: {
					address?: string
				} = JSON.parse(route.request().postData() ?? '{}')
				expect(body.address).toBe(tronAccount)
				tronGridAccountAddresses.add(tronAccount)
				if (url.includes('/wallet/getaccountresource'))
					await route.fulfill({
						json: {},
					})
				else if (url.includes('/wallet/getaccount'))
					await route.fulfill({
						json: {
							balance: 4_200_000,
						},
					})
				else
					throw new Error(`Unexpected TronGrid request ${url}`)
				return
			}
		}

		if (url.includes('https://apilist.tronscanapi.com')) {
			expect(url).not.toContain('/api-proxy/')
			const upstreamUrl = new URL(url.slice(url.indexOf('https://apilist.tronscanapi.com')))
			if (upstreamUrl.pathname === '/api/transaction') {
				expect(upstreamUrl.searchParams.get('address')).toBe(tronAccount)
				tronScanAccountAddresses.add(tronAccount)
				await route.fulfill({
					json: {
						total: 1,
						data: [{
							hash: tronTransactionId,
						}],
					},
				})
				return
			}

			if (upstreamUrl.pathname === '/api/account/tokens') {
				expect(upstreamUrl.searchParams.get('address')).toBe(tronAccount)
				tronScanAccountAddresses.add(tronAccount)
				await route.fulfill({
					json: {
						data: [{
							contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
							tokenType: 'trc20',
							symbol: 'TUSD',
							balance: '9876543',
						}],
					},
				})
				return
			}
		}

		if (
			route.request().method() === 'POST'
			&& url.includes('https://api.mainnet.aptoslabs.com/v1/graphql')
		) {
			expect(url).toContain('/api-proxy/AptosIndexer_Graphql-')
			const request: {
				query: string
				variables: Record<string, string>
			} = JSON.parse(route.request().postData() ?? '{}')
			if (request.query.includes('AptosIndexerAccountTransactions')) {
				expect(request.variables.accountAddress).toBe(aptosAccount)
				aptosTransactionAccountAddresses.add(aptosAccount)
				await route.fulfill({
					json: {
						data: {
							account_transactions: [{
								transaction_version: '42',
							}],
						},
					},
				})
				return
			}

			if (request.query.includes('AptosIndexerTransaction')) {
				expect(request.variables.version).toBe('42')
				await route.fulfill({
					json: {
						data: {
							user_transactions: [{
								sender: aptosAccount,
								version: '42',
							}],
						},
					},
				})
				return
			}

			const balance = {
				amount: '50000000',
				asset_type: '0x1::aptos_coin::AptosCoin',
				is_primary: true,
				last_transaction_version: '42',
				owner_address: aptosAccount,
				storage_id: '0xaptos-primary-store',
			}
			if (request.query.includes('AptosIndexerCurrentFungibleAssetBalances')) {
				expect(request.variables.ownerAddress).toBe(aptosAccount)
				aptosBalanceAccountAddresses.add(aptosAccount)
				await route.fulfill({
					json: {
						data: {
							current_fungible_asset_balances: [balance],
						},
					},
				})
				return
			}

			if (request.query.includes('AptosIndexerCurrentFungibleAssetBalance')) {
				expect(request.variables.storageId).toBe(balance.storage_id)
				await route.fulfill({
					json: {
						data: {
							current_fungible_asset_balances_by_pk: balance,
						},
					},
				})
				return
			}
		}

		if (
			route.request().method() === 'GET'
			&& url.includes('https://fullnode.mainnet.aptoslabs.com/v1/transactions/by_version/42')
		) {
			expect(url).toContain('/api-proxy/AptosFullnode_Rest-')
			await route.fulfill({
				headers: {
					'x-aptos-chain-id': '1',
					'x-aptos-ledger-version': '42',
					'x-aptos-ledger-oldest-version': '0',
					'x-aptos-ledger-timestampusec': '1720000000123456',
					'x-aptos-epoch': '7',
					'x-aptos-block-height': '9',
					'x-aptos-oldest-block-height': '0',
				},
				json: {
					type: 'user_transaction',
					version: '42',
					hash: aptosTransactionHash,
					sender: aptosAccount,
					events: [],
					changes: [],
				},
			})
			return
		}

		await route.fallback()
	})

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await page.getByRole('button', {
		name: 'Connect Aggregate wallet',
	}).click()
	await expect(page.getByRole('radio', {
		name: new RegExp(walletAccount),
	})).toBeChecked({
		timeout: 120_000,
	})
	await page.goto('/~/accounts/balances')
	const networkInput = page.getByLabel('Network (CAIP-2)')
	await expect(networkInput).toBeVisible({
		timeout: 120_000,
	})
	await networkInput.fill('unsupported:main')
	await page.getByLabel('Account address').fill(firstAccount)
	await page.getByRole('button', {
		name: 'Add account',
	}).click()
	expect(await networkInput.evaluate((input: HTMLInputElement) => input.validationMessage)).toBe(
		'Choose a supported CAIP-2 network.'
	)
	const manuallyEnrolledAccounts = [
		['eip155:1', firstAccount],
		['eip155:1', secondAccount],
		['ton:-239', tonAccount],
		['aptos:1', aptosAccount],
		['tron:0x2b6653dc', tronAccount],
		['bip122:000000000019d6689c085ae165831e93', utxoAccount],
	] as const
	for (const [accountNetwork, account] of manuallyEnrolledAccounts) {
		await networkInput.fill(accountNetwork)
		await page.getByLabel('Account address').fill(account)
		await page.getByRole('button', {
			name: 'Add account',
		}).click()
		await expect(page.getByText(`Added ${accountNetwork}:${account}.`)).toBeVisible()
	}

	await page.goto('/~/accounts')
	await page.reload({ waitUntil: 'load' })
	const accounts = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'Accounts',
			exact: true,
		}),
	})
	await expect(accounts).toBeAttached({
		timeout: 120_000,
	})
	for (const [accountNetwork, account] of [
		...manuallyEnrolledAccounts,
		['eip155:1', walletAccount],
	] as const)
		await expect(accounts.getByText(`${accountNetwork}:${account}`, {
			exact: true,
		})).toBeAttached({
			timeout: 120_000,
		})
	await expect(page.getByRole('heading', {
		name: 'Accounts',
	})).toContainText(`Accounts (${(manuallyEnrolledAccounts.length + 1).toString()})`)

	await page.goto('/~/accounts/balances')
	await expect(page.getByLabel('Network (CAIP-2)')).toBeVisible()
	await expect(page.getByLabel('Account address')).toBeVisible()
	const balances = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'EVM balances',
			exact: true,
		}),
	})
	await expect(balances.locator('li[data-list-item]')).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(balances.getByText('ETH', {
		exact: true,
	})).toBeAttached()
	await expect(balances.getByRole('button', {
		name: firstAccount,
	})).toBeAttached()
	expect([...alliumAccountAddresses].sort()).toEqual([
		firstAccount,
		secondAccount,
		walletAccount,
	])
	const tonBalances = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'TON balances',
			exact: true,
		}),
	})
	await expect(tonBalances.locator('li[data-list-item]')).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(tonBalances.getByText('active', {
		exact: true,
	})).toBeAttached()
	expect([...tonApiAccountAddresses]).toEqual([
		tonAccount,
	])
	const aptosBalances = page.locator('#account-aptos-coin-balance-timestamp[data-card][data-scroll-container]')
	const tronBalances = page.locator('#account-tron-account-timestamp[data-card][data-scroll-container]')
	const tronTokenBalances = page.locator('#account-tron-account-token-balance-timestamp[data-card][data-scroll-container]')
	const utxoBalances = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'UTXO balances',
			exact: true,
		}),
	})
	for (const [protocolBalances, expectedCardCount] of [
		[aptosBalances, 1],
		[tronBalances, 1],
		[tronTokenBalances, 1],
		[utxoBalances, 2],
	] as const)
		await expect(protocolBalances.locator('li[data-list-item] article[data-card][data-scroll-container]')).toHaveCount(expectedCardCount, {
			timeout: 120_000,
		})
	await expect(aptosBalances.getByText('0x1::aptos_coin::AptosCoin', {
		exact: true,
	})).toBeAttached()
	await expect(tronBalances).toContainText('4,200,000')
	await expect(tronTokenBalances).toContainText('TUSD')
	await expect(utxoBalances).toContainText('25,000')
	for (const facetId of [
		'#account-cardano-address-timestamp',
		'#account-hedera-account-timestamp',
		'#account-polkadot-account-timestamp',
		'#account-solana-account-timestamp',
		'#account-xrpl-account-timestamp',
	])
		await expect(page.locator(facetId)).toHaveCount(0)
	await expect(page.locator('[data-resource-state="pending"]')).toHaveCount(0)
	await expect(page.locator('[data-resource-state="failed"]')).toHaveCount(0)

	await page.goto('/~/accounts/transactions')
	await expect(page.getByLabel('Network (CAIP-2)')).toBeVisible()
	await expect(page.getByLabel('Account address')).toBeVisible()
	const transactions = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'EVM transactions',
			exact: true,
		}),
	})
	await expect(transactions.locator('li[data-list-item]')).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(transactions.getByRole('button', {
		name: transactionHash,
	})).toBeAttached()
	expect([...blockscoutAccountAddresses].sort()).toEqual([
		firstAccount,
		secondAccount,
		walletAccount,
	])
	const aptosTransactions = page.locator('#account-aptos-transaction[data-card][data-scroll-container]')
	const tronTransactions = page.locator('#account-tron-transaction[data-card][data-scroll-container]')
	const utxoTransactions = page.locator('article[data-card][data-scroll-container]').filter({
		has: page.getByRole('link', {
			name: 'UTXO transactions',
			exact: true,
		}),
	})
	for (const protocolTransactions of [
		aptosTransactions,
		tronTransactions,
		utxoTransactions,
	])
		await expect(protocolTransactions.locator('li[data-list-item] article[data-card][data-scroll-container]')).toHaveCount(1, {
			timeout: 120_000,
		})
	await expect(aptosTransactions.getByText(aptosTransactionHash, {
		exact: true,
	})).toBeAttached()
	await expect(tronTransactions.getByText(tronTransactionId, {
		exact: true,
	})).toBeAttached()
	await expect(utxoTransactions.getByRole('button', {
		name: utxoTransactionId,
	})).toBeAttached()
	for (const facetId of [
		'#account-cardano-transaction',
		'#account-cosmos-transaction',
		'#account-hedera-transaction',
		'#account-xrpl-transaction',
	])
		await expect(page.locator(facetId)).toHaveCount(0)
	await expect(page.locator('[data-resource-state="pending"]')).toHaveCount(0)
	await expect(page.locator('[data-resource-state="failed"]')).toHaveCount(0)
	expect([...aptosBalanceAccountAddresses]).toEqual([aptosAccount])
	expect([...aptosTransactionAccountAddresses]).toEqual([aptosAccount])
	expect([...blockchairAccountAddresses]).toEqual([utxoAccount])
	expect([...mempoolSpaceAccountAddresses]).toEqual([utxoAccount])
	expect([...tronGridAccountAddresses]).toEqual([tronAccount])
	expect([...tronScanAccountAddresses]).toEqual([tronAccount])
	expect(diagnostics.issues).toEqual([])
})

test('disconnect during connect cannot resurrect connection', async ({ page }) => {
	await page.addInitScript(() => {
		let completeAccountRequest = () => {}
		window.completeWalletControlAccountRequest = () => completeAccountRequest()
		window.walletControlAccountRequestCount = 0
		window.addEventListener('eip6963:requestProvider', () => {
			window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
				detail: {
					info: {
						uuid: 'wallet-control-race-e2e',
						name: 'Wallet race test provider',
						icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
						rdns: 'test.blockhead.wallet-race',
					},
					provider: {
						request: async ({ method }: { method: string }) => {
							if (method === 'eth_requestAccounts') {
								window.walletControlAccountRequestCount += 1
								await new Promise<void>((resolve) => {
									completeAccountRequest = resolve
								})
								return ['0x1111111111111111111111111111111111111111']
							}
							if (method === 'eth_chainId')
								return '0x1'

							throw new Error(`Unexpected wallet method: ${method}`)
						},
					},
				},
			}))
		})
	})

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)

	await page.getByRole('button', {
		name: 'Connect Wallet race test provider',
	}).click()
	await expect(page.getByText('connecting', {
		exact: true,
	}).first()).toBeAttached()
	expect(await page.evaluate(() => window.walletControlAccountRequestCount)).toBe(1)

	await page.getByRole('button', {
		name: 'Cancel connection',
	}).click()
	await page.evaluate(() => window.completeWalletControlAccountRequest())
	await expect(page.getByRole('button', {
		name: 'Connect Wallet race test provider',
	})).toBeVisible()
	await expect(page.getByText('connected', {
		exact: true,
	})).toHaveCount(0)
})
