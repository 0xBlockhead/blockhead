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
		const provider = {
			request: async ({ method }: { method: string }) => {
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

	await page.reload()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 0.')
	await expect(page.getByRole('button', { name: 'Retry connection' })).toBeVisible()

	await page.getByRole('button', { name: 'Retry connection' }).click()
	await expect(walletConnectionsStatus(page)).toContainText('Active connections: 1.')
	const connection = walletConnectionCard(page, 'Consent Fixture Wallet')
	await expect(connection).toBeVisible()

	await messageToSignInput(connection).fill('rejected consent stays unsigned')
	await signMessageButton(connection).click()
	await expect(walletRequestHistory(page)).toContainText('personal_sign')

	const requestLink = page.getByRole('link', { name: 'message-signature' }).last()
	await expect(requestLink).toBeVisible()
	await requestLink.click()
	await expect(page).toHaveURL(/\/\~\/wallets\/requests\/wallet-request-/)
	await expect(page.getByText('submitted at', { exact: true })).toHaveCount(0)
	await expect(page.getByText('EVM request', { exact: true })).toHaveCount(0)

	await page.reload()
	await expect(page.getByText('submitted at', { exact: true })).toHaveCount(0)
	await expect(page.getByText('EVM request', { exact: true })).toHaveCount(0)
})
