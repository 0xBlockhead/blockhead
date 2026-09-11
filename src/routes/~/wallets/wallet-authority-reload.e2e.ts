import { randomUUID } from 'node:crypto'

import {
	expect,
	test,
} from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'
import {
	messageToSignInput,
	signMessageButton,
	walletConnectionCard,
	walletConnectionsStatus,
} from '../../../../tests/e2e/wallet-extensions/_walletPageSelectors.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type ProviderCall = {
	method: string
	params: readonly JsonValue[]
}


test.setTimeout(180_000)

test('reloads the explicit-submit authority graph without wallet redispatch or broadcast', async ({
	context,
	page,
}, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-wallet-authority-reload-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${randomUUID()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.addInitScript(() => {
		const accountAddress = '0x1111111111111111111111111111111111111111'
		const recordProviderCall = (method: string, params: readonly JsonValue[] = []) => {
			const calls: ProviderCall[] = JSON.parse(
				localStorage.getItem('wallet-authority-provider-calls') ?? '[]'
			)
			calls.push({
				method,
				params,
			})
			localStorage.setItem('wallet-authority-provider-calls', JSON.stringify(calls))
		}
		const provider = {
			request: async ({
				method,
				params,
			}: {
				method: string
				params?: readonly JsonValue[]
			}) => {
				recordProviderCall(method, params)
				if (method === 'eth_chainId') return '0x1'
				if (method === 'eth_accounts')
					return localStorage.getItem('wallet-authority-connected') === 'true' ? [accountAddress] : []
				if (method === 'eth_requestAccounts') {
					localStorage.setItem('wallet-authority-connected', 'true')
					return [accountAddress]
				}
				if (method === 'personal_sign') {
					localStorage.setItem('wallet-authority-personal-sign-params', JSON.stringify(params))
					while (localStorage.getItem('wallet-authority-signature') == null)
						await new Promise((resolve) => setTimeout(resolve, 10))
					return localStorage.getItem('wallet-authority-signature')
				}
				throw new Error(`Unsupported fixture wallet method: ${method}`)
			},
		}
		const announce = () => window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
			detail: {
				info: {
					uuid: 'authority-reload-fixture',
					name: 'Authority Reload Fixture Wallet',
					icon: '',
					rdns: 'com.blockhead.authority-reload-fixture',
				},
				provider,
			},
		}))
		window.addEventListener('eip6963:requestProvider', announce)
	})

	const diagnostics = setupPageRuntimeDiagnostics(page)
	await page.goto('/~/wallets')
	await expectMainVisible(page, 60_000, diagnostics)
	await diagnostics.step(expect(walletConnectionsStatus(page)).toContainText(/Providers detected: [1-9][0-9]*\./, {
		timeout: 120_000,
	}))
	await page.getByRole('button', { name: 'Connect Authority Reload Fixture Wallet' }).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')

	const connection = walletConnectionCard(page, 'Authority Reload Fixture Wallet')
	await messageToSignInput(connection).fill('persist the exact authority dispatch graph')
	await signMessageButton(connection).click()

	const readGraph = () => page.evaluate(() => window.__blockheadClientProbe?.authorityDispatchGraph())
	await expect.poll(async () => (await readGraph())?.occurrences.length).toBe(1)
	const beforeProvider = await readGraph()
	expect(beforeProvider?.authorityRequests).toHaveLength(1)
	expect(beforeProvider?.walletRequests).toHaveLength(1)
	expect(beforeProvider?.timestamps).toHaveLength(1)
	expect(beforeProvider?.envelopeHashBindings).toEqual([expect.objectContaining({ matches: true })])
	expect(beforeProvider?.fields.filter(({ fieldName }) => fieldName === 'decision')).toHaveLength(0)
	expect(beforeProvider?.fields.filter(({ fieldName }) => fieldName === 'evidence')).toHaveLength(0)
	expect(beforeProvider?.fields.filter(({ fieldName }) => fieldName === 'submittedAt')).toHaveLength(0)
	expect(JSON.stringify(beforeProvider)).toContain('eip6963:authority-reload-fixture')
	expect(JSON.stringify(beforeProvider)).toContain('0x1111111111111111111111111111111111111111')
	expect(JSON.stringify(beforeProvider)).toContain('personal_sign')
	const walletDispatchCalls = () => page.evaluate(() => {
		const calls: ProviderCall[] = JSON.parse(
			localStorage.getItem('wallet-authority-provider-calls') ?? '[]'
		)

		return calls.filter(({ method }) => !['eth_chainId', 'eth_accounts'].includes(method))
	})
	const expectedWalletDispatchCalls = [
		{
			method: 'eth_requestAccounts',
			params: [],
		},
		{
			method: 'personal_sign',
			params: [
				'0x706572736973742074686520657861637420617574686f72697479206469737061746368206772617068',
				'0x1111111111111111111111111111111111111111',
			],
		},
	]
	await expect.poll(walletDispatchCalls).toEqual(expectedWalletDispatchCalls)

	await page.evaluate(() => localStorage.setItem(
		'wallet-authority-signature',
		'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	))
	await expect(walletConnectionsStatus(page)).toContainText('Message signed by')
	await expect.poll(async () => (await readGraph())?.fields.filter(({ fieldName }) => fieldName === 'evidence').length).toBe(1)
	const beforeReload = await readGraph()
	expect(beforeReload?.timestamps).toHaveLength(2)
	expect(beforeReload?.fields.filter(({ fieldName }) => fieldName === 'submittedAt')).toHaveLength(1)
	expect(beforeReload?.fields.filter(({ fieldName }) => fieldName === 'decision')).toHaveLength(0)
	expect(JSON.stringify(beforeReload)).toContain('returned')

	await page.reload({ waitUntil: 'domcontentloaded' })
	await expectMainVisible(page, 60_000, diagnostics)
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	await expect.poll(async () => await readGraph()).toEqual(beforeReload)
	expect(await walletDispatchCalls()).toEqual(expectedWalletDispatchCalls)
})
