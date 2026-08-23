import { expect, test } from '@playwright/test'
import type { BrowserContext, TestInfo } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'


test.setTimeout(180_000)

declare global {
	interface Window {
		lockedPrepWalletMethodCalls: string[]
	}
}

const installIsolatedLocalDatabase = async (
	context: BrowserContext,
	testInfo: TestInfo,
	label: string
) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-${label}-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
}

const installEvmNativeTransferRpcStub = async (
	context: BrowserContext
) => {
	await context.route('**/*', async (route) => {
		const url = decodeURIComponent(decodeURIComponent(route.request().url()))
		const isVoltaireMainnetRpc = (
			route.request().method() === 'POST'
			&& (
				/ethereum\.publicnode\.com(?:\/|$|\?)/.test(url)
				|| /eth\.drpc\.org(?:\/|$|\?)/.test(url)
				|| /eth\.llamarpc\.com(?:\/|$|\?)/.test(url)
				|| /mainnet\.rpc\.buidlguidl\.com(?:\/|$|\?)/.test(url)
				|| /evm\.stupidtech\.net(?:\/|$|\?)/.test(url)
			)
		)
		if (!isVoltaireMainnetRpc) {
			await route.fallback()
			return
		}

		const body: {
			id?: number | string
			method?: string
		} = JSON.parse(route.request().postData() ?? '{}')
		const id = body.id ?? 1
		if (body.method === 'eth_getBlockByNumber') {
			await route.fulfill({
				json: {
					jsonrpc: '2.0',
					id,
					result: {
						number: '0x2a',
						hash: `0x${'ab'.repeat(32)}`,
						parentHash: `0x${'cd'.repeat(32)}`,
						timestamp: '0x66a00000',
						miner: `0x${'11'.repeat(20)}`,
						gasUsed: '0x0',
						gasLimit: '0x1c9c380',
						baseFeePerGas: '0x7',
						transactions: [],
					},
				},
			})
			return
		}
		if (body.method === 'eth_call') {
			await route.fulfill({
				json: {
					jsonrpc: '2.0',
					id,
					result: '0x',
				},
			})
			return
		}
		if (body.method === 'eth_estimateGas') {
			await route.fulfill({
				json: {
					jsonrpc: '2.0',
					id,
					result: '0x5208',
				},
			})
			return
		}

		await route.fulfill({
			json: {
				jsonrpc: '2.0',
				id,
				error: {
					code: -32601,
					message: `Unexpected preparation RPC method: ${body.method}`,
				},
			},
		})
	})
}

test('connects a matching wallet and prepares a locked native transfer without sending', async ({ context, page }, testInfo) => {
	testInfo.setTimeout(300_000)
	const fromAccount = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
	const toAccount = '0x000000000000000000000000000000000000dEaD'
	const providerName = 'Locked prep wallet'
	const derivedInertWarnings: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'warning' && message.text().includes('derived_inert'))
			derivedInertWarnings.push(message.text())
	})

	await installIsolatedLocalDatabase(context, testInfo, 'locked-session-prep')
	await installEvmNativeTransferRpcStub(context)
	await page.addInitScript(({
		fromAccount,
		providerName,
	}) => {
		window.lockedPrepWalletMethodCalls = []
		window.addEventListener('eip6963:requestProvider', () => {
			window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
				detail: {
					info: {
						uuid: 'locked-session-prep-e2e',
						name: providerName,
						icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
						rdns: 'test.blockhead.locked-session-prep',
					},
					provider: {
						request: async ({ method }: { method: string }) => {
							window.lockedPrepWalletMethodCalls.push(method)
							if (method === 'eth_requestAccounts' || method === 'eth_accounts')
								return [fromAccount]
							if (method === 'eth_chainId')
								return '0x1'
							if (method === 'eth_sendTransaction')
								throw new Error('Prep journey must not broadcast eth_sendTransaction')

							throw new Error(`Unexpected locked-prep wallet method: ${method}`)
						},
						on: () => {},
						removeListener: () => {},
					},
				},
			}))
		})
	}, {
		fromAccount,
		providerName,
	})

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/wallets', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	const connectWallet = page.getByRole('button', {
		name: `Connect ${providerName}`,
	})
	await expect(connectWallet).toBeVisible({
		timeout: 120_000,
	})
	await connectWallet.click()
	const connectedWallet = page.getByRole('article').filter({
		has: page.getByRole('link', {
			name: providerName,
			exact: true,
		}),
	})
	await expect(connectedWallet.getByRole('radio', {
		name: new RegExp(fromAccount, 'i'),
	})).toBeChecked({
		timeout: 120_000,
	})
	await expect(connectedWallet.getByRole('button', {
		name: 'Disconnect wallet',
	})).toBeVisible()

	await diagnostics.step(page.goto('/~/sessions', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expectMainAttached(page, 120_000, diagnostics)
	await page.getByRole('textbox', {
		name: 'Session name',
	}).fill('Locked prep journey')
	await page.getByRole('button', {
		name: 'Create session',
	}).click()
	await expect(page).toHaveURL(/\/~\/session\/session-[^/]+(?:\?|$)/)
	await expect(page.getByText('No actions.', { exact: true })).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByRole('button', {
		name: 'Start transfer draft with keyboard',
	})).toBeVisible({
		timeout: 120_000,
	})

	await page.getByRole('textbox', {
		name: 'Source account',
	}).fill(fromAccount)
	await page.getByRole('textbox', {
		name: 'Source chain ID',
	}).fill('1')
	await page.getByRole('button', {
		name: 'Start transfer draft with keyboard',
	}).click()
	await page.getByRole('textbox', {
		name: 'To account',
	}).fill(toAccount)
	await page.getByRole('textbox', {
		name: 'Token address',
	}).fill('0x0000000000000000000000000000000000000000')
	await page.getByRole('textbox', {
		name: 'Amount (base units)',
	}).fill('1')
	await page.getByRole('button', {
		name: 'Confirm draft',
	}).evaluate((button) => {
		button.closest('form')?.dispatchEvent(new SubmitEvent('submit', {
			bubbles: true,
			cancelable: true,
		}))
	})
	await expect(page.getByRole('status').filter({
		hasText: 'Transfer draft added.',
	})).toBeVisible({
		timeout: 120_000,
	})
	await page.getByRole('button', {
		name: 'Lock session',
	}).click()
	await expect(page.getByRole('button', {
		name: 'Prepare EVM native transfer',
	})).toBeVisible()

	await page.getByRole('button', {
		name: 'Prepare EVM native transfer',
	}).click()
	await expect(page.getByRole('status').filter({
		hasText: 'EVM native transfer preparation succeeded and saved a wallet request.',
	})).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByRole('link', {
		name: 'Open wallet request',
	})).toBeVisible()
	const walletRequestHref = await page.getByRole('link', {
		name: 'Open wallet request',
	}).getAttribute('href')
	expect(walletRequestHref).toMatch(/^\/~\/wallets\/requests\/0x[0-9a-f]{64}$/)
	if (walletRequestHref == null)
		throw new Error('Prepared wallet request link did not expose a destination')
	await expect(page.getByRole('listitem').filter({
		hasText: 'wallet-account',
	}).first()).toBeAttached()
	await expect(page.getByRole('status').filter({
		hasText: 'preparation blocked',
	})).toHaveCount(0)
	expect(await page.evaluate(() => window.lockedPrepWalletMethodCalls)).not.toContain('eth_sendTransaction')

	const sessionHref = new URL(page.url()).pathname
	await page.locator('a[data-scroll-marker-label="Intent invocations"]').click()
	const intentInvocationLink = page.locator('article[id$=":blockhead-session-intents-list"] a[href*="/intent-invocation/"]')
	await expect(intentInvocationLink).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(intentInvocationLink).toContainText('click')

	await page.locator('a[href*="/action/"]:not([href*="/outcome/"])').filter({
		hasText: 'Transfer',
	}).click()
	await expect(page).toHaveURL(/\/~\/session\/[^/]+\/action\/[^/]+(?:\?|$)/)
	const outcomesMarker = page.locator('a[data-scroll-marker-label="Outcomes"]')
	await expect(outcomesMarker).toBeAttached({
		timeout: 120_000,
	})
	await outcomesMarker.click()
	const actionOutcomeLink = page.locator('article[id$=":session-action-outcomes-list"] a[href*="/outcome/"]')
	await expect(actionOutcomeLink).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(actionOutcomeLink).toContainText('wallet-request')

	await page.reload({
		waitUntil: 'load',
	})
	await expect(outcomesMarker).toBeAttached({
		timeout: 120_000,
	})
	await outcomesMarker.click()
	await expect(actionOutcomeLink).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(actionOutcomeLink).toContainText('wallet-request')

	await diagnostics.step(page.goto(sessionHref, {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await page.locator('a[data-scroll-marker-label="Intent invocations"]').click()
	await expect(intentInvocationLink).toHaveCount(1, {
		timeout: 120_000,
	})
	await expect(intentInvocationLink).toContainText('click')

	await diagnostics.step(page.goto(walletRequestHref, {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await expect(page).toHaveURL(/\/~\/wallets\/requests\/0x[0-9a-f]{64}(?:\?|$)/, {
		timeout: 60_000,
	})
	await expectMainAttached(page, 120_000, diagnostics)
	await expect(page.getByRole('main')).toContainText('prepared', {
		timeout: 120_000,
	})
	expect(await page.evaluate(() => window.lockedPrepWalletMethodCalls)).not.toContain('eth_sendTransaction')
	expect(derivedInertWarnings).toEqual([])
	expect(diagnostics.issues).toEqual([])
})

test('keeps session actions as drafts until explicit confirmation', async ({ page }) => {
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/sessions'))
	await expectMainAttached(page, 120_000, diagnostics)
	await expect(page.getByRole('heading', {
		name: 'New session',
	})).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Session name').fill('Intent draft test')
	await page.getByRole('button', { name: 'Create session' }).click()
	await expect(page).toHaveURL(/\/~\/session\/session-[^/]+(?:\?|$)/)
	await expect(page.getByText('No actions.', { exact: true })).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByLabel('Rename session')).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Rename session').fill('Renamed intent draft')
	await page.getByRole('button', { name: 'Rename' }).click()

	await page.getByLabel('Source account').fill('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await page.getByLabel('Source chain ID').fill('1')
	await page.getByRole('button', { name: 'Start transfer draft with keyboard' }).click()
	await expect(page.getByText('Transfer draft', { exact: true })).toBeVisible()
	await expect(page.getByText('Transfer draft added.')).not.toBeAttached()
	await page.getByRole('button', { name: 'Confirm draft' }).evaluate((button) => {
		button.closest('form')?.dispatchEvent(new SubmitEvent('submit', {
			bubbles: true,
			cancelable: true,
		}))
	})
	await expect(page.getByText('Draft values are invalid. Correct them before saving.')).toBeVisible()
	await expect(page.getByText('Transfer draft', { exact: true })).toBeVisible()

	await expect(page.getByLabel('From account')).toHaveValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await page.getByLabel('To account').fill('0x000000000000000000000000000000000000dEaD')
	await page.getByLabel('Chain ID', { exact: true }).fill('1')
	await page.getByLabel('Token address').fill('0x0000000000000000000000000000000000000000')
	await page.getByLabel('Amount (base units)').fill('1')
	await page.getByRole('button', { name: 'Confirm draft' }).evaluate((button) => {
		button.closest('form')?.dispatchEvent(new SubmitEvent('submit', {
			bubbles: true,
			cancelable: true,
		}))
	})

	await expect(page.getByText('Transfer draft added.')).toBeVisible()
	await expect(page.getByText('Transfer draft', { exact: true })).not.toBeAttached()
	await page.reload({
		waitUntil: 'load',
	})
	await expect(page.getByRole('button', { name: 'Edit Transfer action' })).toBeVisible({
		timeout: 120_000,
	})
	await page.getByRole('button', { name: 'Lock session' }).click()
	await expect(page.getByRole('button', { name: 'Prepare EVM native transfer' })).toBeVisible()
	await page.getByRole('button', { name: 'Prepare EVM native transfer' }).click()
	await expect(page.getByRole('status').filter({
		hasText: 'EVM native transfer preparation blocked:',
	})).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByRole('listitem').filter({
		hasText: 'wallet-account',
	}).first()).toBeAttached()
	await page.reload({
		waitUntil: 'load',
	})
	await expect(page.getByRole('button', { name: 'Prepare EVM native transfer' })).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByText('wallet-account', { exact: true }).first()).toBeAttached()
	await page.getByRole('button', { name: 'Unlock session' }).click()

	await page.getByRole('button', { name: 'Edit Transfer action' }).click()
	await expect(page.getByLabel('From account')).toHaveValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await expect(page.getByLabel('Amount (base units)')).toHaveValue('1')
	await page.getByLabel('Draft action type').selectOption('Bridge')
	await page.getByLabel('From chain ID').fill('1')
	await page.getByLabel('To chain ID').fill('10')
	await page.getByRole('button', { name: 'Confirm draft' }).evaluate((button) => {
		button.closest('form')?.dispatchEvent(new SubmitEvent('submit', {
			bubbles: true,
			cancelable: true,
		}))
	})
	await expect(page.getByText('Bridge draft updated.')).toBeVisible()
	await expect(page.getByRole('button', { name: 'Edit Bridge action' })).toBeVisible()

	await page.getByRole('button', { name: 'Lock session' }).click()
	await expect(page.getByRole('button', { name: 'Edit Bridge action' })).not.toBeAttached()
	await expect(page.getByRole('button', { name: 'Delete Bridge action' })).not.toBeAttached()

	await page.getByRole('button', { name: 'Unlock session' }).click()
	await page.getByRole('button', { name: 'Delete Bridge action' }).click()
	await expect(page.getByLabel('Edit Bridge action')).not.toBeAttached()

	await page.getByRole('button', { name: 'Delete session' }).click()
	await expect(page).toHaveURL('/~/sessions')
	await expect(page.getByRole('link', {
		name: 'Renamed intent draft',
	})).not.toBeAttached()
	await page.reload({
		waitUntil: 'load',
	})
	await expect(page.getByRole('link', {
		name: 'Renamed intent draft',
	})).not.toBeAttached({
		timeout: 120_000,
	})
	expect(diagnostics.issues).toEqual([])
})

test('cancels a keyboard-created draft without adding an action', async ({ page }) => {
	await page.goto('/~/sessions')
	await expect(page.getByRole('heading', {
		name: 'New session',
	})).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Session name').fill('Cancel draft test')
	await page.getByRole('button', { name: 'Create session' }).click()
	await expect(page).toHaveURL(/\/~\/session\/session-[^/]+(?:\?|$)/)

	await expect(page.getByRole('button', { name: 'Start transfer draft with keyboard' })).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Source account').fill('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await page.getByLabel('Source chain ID').fill('1')
	await page.getByRole('button', { name: 'Start transfer draft with keyboard' }).click()
	await page.getByRole('button', { name: 'Cancel' }).click()

	await expect(page.getByText('Transfer draft', { exact: true })).not.toBeAttached()
	await expect(page.getByText('Transfer draft added.')).not.toBeAttached()
})
