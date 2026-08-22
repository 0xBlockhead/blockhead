import {
	expect,
	test,
} from '@playwright/test'

import {
	messageToSignInput,
	signMessageButton,
	walletConnectionCard,
	walletConnectionsStatus,
	walletRequestHistory,
} from '../../../../tests/e2e/wallet-extensions/_walletPageSelectors.ts'


test.setTimeout(180_000)

test('keeps rejected consent out of connected and submitted request rows after reload', async ({
	context,
	page,
}, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-wallet-request-consent-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.addInitScript(() => {
		const accountAddress = '0x1111111111111111111111111111111111111111'
		const providerCallCounts = () => JSON.parse(
			localStorage.getItem('wallet-consent-provider-call-counts') ?? '{}'
		) as Record<string, number>
		const countProviderCall = (method: string) => {
			const counts = providerCallCounts()
			counts[method] = (counts[method] ?? 0) + 1
			localStorage.setItem('wallet-consent-provider-call-counts', JSON.stringify(counts))
		}
		const provider = {
			request: async ({ method }: { method: string }) => {
				countProviderCall(method)

				if (method === 'eth_chainId')
					return '0x1'

				if (method === 'eth_accounts')
					return Number(localStorage.getItem('wallet-consent-connect-attempts') ?? '0') > 1 ?
						[accountAddress]
					:
						[]

				if (method === 'eth_requestAccounts') {
					const attempts = Number(localStorage.getItem('wallet-consent-connect-attempts') ?? '0') + 1
					localStorage.setItem('wallet-consent-connect-attempts', String(attempts))
					if (attempts === 1)
						throw new Error('User rejected the wallet connection request')
					return [accountAddress]
				}

				if (method === 'personal_sign') {
					const attempts = Number(localStorage.getItem('wallet-consent-sign-attempts') ?? '0') + 1
					localStorage.setItem('wallet-consent-sign-attempts', String(attempts))
					if (attempts === 1)
						throw new Error('User rejected the wallet signing request')
					return '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
				}

				throw new Error(`Unsupported fixture wallet method: ${method}`)
			},
		}

		const announce = () => {
			window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
				detail: {
					info: {
						uuid: 'wallet-consent-fixture',
						name: 'Consent Fixture Wallet',
						icon: '',
						rdns: 'com.blockhead.wallet-consent-fixture',
					},
					provider,
				},
			}))
		}

		window.addEventListener('eip6963:requestProvider', announce)
	})

	await page.goto('/~/wallets')
	await expect(walletConnectionsStatus(page)).toContainText('Providers detected: 1.')

	await page.getByRole('button', { name: 'Connect Consent Fixture Wallet' }).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
	await expect(page.getByRole('button', { name: 'Retry connection' })).toBeVisible()
	await expect.poll(async () => page.evaluate(() => JSON.parse(
		localStorage.getItem('wallet-consent-provider-call-counts') ?? '{}'
	).eth_requestAccounts)).toBe(1)

	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
	await expect(page.getByRole('button', { name: 'Retry connection' })).toBeVisible()
	await expect.poll(async () => page.evaluate(() => JSON.parse(
		localStorage.getItem('wallet-consent-provider-call-counts') ?? '{}'
	).eth_requestAccounts)).toBe(1)

	await page.getByRole('button', { name: 'Retry connection' }).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	await expect.poll(async () => page.evaluate(() => JSON.parse(
		localStorage.getItem('wallet-consent-provider-call-counts') ?? '{}'
	).eth_requestAccounts)).toBe(2)
	const connection = walletConnectionCard(page, 'Consent Fixture Wallet')
	await expect(connection).toBeVisible()

	await messageToSignInput(connection).fill('rejected consent stays unsigned')
	await signMessageButton(connection).click()
	await expect(walletRequestHistory(page)).toContainText('personal_sign')
	await expect.poll(async () => page.evaluate(() => JSON.parse(
		localStorage.getItem('wallet-consent-provider-call-counts') ?? '{}'
	).personal_sign)).toBe(1)
	await expect(page.getByText(/Message signed by|Request history was saved/)).toHaveCount(0)

	const requestLink = page.getByRole('link', { name: 'message-signature' }).last()
	await expect(requestLink).toBeVisible()
	await requestLink.click()
	await expect(page).toHaveURL(/\/\~\/wallets\/requests\/wallet-request-/)
	const statusField = page.locator('dt').filter({ hasText: /^status$/ }).locator('..')
	await expect(statusField.getByText('failed', { exact: true })).toBeVisible()
	await expect(page.getByText('Wallet signing request failed', { exact: true })).toBeVisible()
	await expect(page.getByText('signature hash', { exact: true })).toHaveCount(0)
	await expect(page.getByText('submitted at', { exact: true })).toHaveCount(0)
	await expect(page.getByText('EVM request', { exact: true })).toHaveCount(0)

	await page.reload()
	await expect(statusField.getByText('failed', { exact: true })).toBeVisible()
	await expect(page.getByText('Wallet signing request failed', { exact: true })).toBeVisible()
	await expect(page.getByText('signature hash', { exact: true })).toHaveCount(0)
	await expect(page.getByText('submitted at', { exact: true })).toHaveCount(0)
	await expect(page.getByText('EVM request', { exact: true })).toHaveCount(0)
	await expect.poll(async () => page.evaluate(() => JSON.parse(
		localStorage.getItem('wallet-consent-provider-call-counts') ?? '{}'
	).personal_sign)).toBe(1)
})
