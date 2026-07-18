import { expect, test } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

declare global {
	interface Window {
		completeWalletControlAccountRequest(): void
		walletControlAccountRequestCount: number
	}
}

test.setTimeout(180_000)

test('reject retry connect account selection and all-account composition lifecycle', async ({ page }) => {
	await page.addInitScript(() => {
		const accountAddresses = [
			'0x1111111111111111111111111111111111111111',
			'0x2222222222222222222222222222222222222222',
		]
		const listeners = new Map<string, ((payload: string | string[]) => void)[]>()
		let accountRequestCount = 0
		let completeAccountRequest = () => {}
		window.walletControlAccountRequestCount = 0
		window.completeWalletControlAccountRequest = () => completeAccountRequest()
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
						return '0x1'

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
						(listeners.get(event) ?? []).filter((candidate) => candidate !== listener),
					)
				},
			},
		}
		window.addEventListener('eip6963:requestProvider', () => {
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

	await page.getByRole('button', {
		name: 'Connect Wallet control test provider',
	}).click()
	await expect(page.getByText('User rejected the wallet request')).toBeAttached({
		timeout: 120_000,
	})

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
	await expect(page.locator('[id^="accounts-balances-"][id$="-balances"]').first()).toBeAttached()

	await expect(page.locator('#main').getByText('Wallet control test provider')).toHaveCount(1)
	await page.getByRole('button', {
		name: 'Disconnect',
	}).click()
	await expect(page.getByRole('button', {
		name: 'Connect Wallet control test provider',
	})).toBeVisible()

	await page.reload({ waitUntil: 'load' })
	await expect(page.getByText('0x1111111111111111111111111111111111111111', {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.getByText('0x2222222222222222222222222222222222222222', {
		exact: true,
	}).first()).toBeAttached()
	await expect(page.getByRole('button', {
		name: 'Connect Wallet control test provider',
	})).toBeVisible()
	await expect(page.getByText('User rejected the wallet request')).toHaveCount(0)
	expect(diagnostics.issues).toEqual([])
})

test('adds a network-scoped account and reuses it on balances and transactions', async ({ page }) => {
	const address = '0x3333333333333333333333333333333333333333'
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/accounts/balances', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await expect(page.getByLabel('Network (CAIP-2)')).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Network (CAIP-2)').fill('eip155:1')
	await page.getByLabel('Account address').fill(address)
	await page.getByRole('button', {
		name: 'Add account',
	}).click()

	await expect(page.getByText(`Added eip155:1:${address}.`)).toBeVisible()
	await page.goto('/~/accounts/transactions')
	await expect(page.getByText(address, {
		exact: true,
	}).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('[id^="account-transactions-"][id$="-transactions"]').first()).toBeAttached()

	await page.goto('/~/accounts/balances')
	await expect(page.locator('[id^="account-balances-"][id$="-balances"]').first()).toBeAttached({
		timeout: 120_000,
	})
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
