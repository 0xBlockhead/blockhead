import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { tonkeeperDriver } from '../../../../scripts/wallet-extensions/Tonkeeper/driver.ts'
import {
	connectWalletButtonForDriver,
	disconnectWalletButton,
	walletConnectionCard,
	walletConnectionsStatusById,
} from '../_walletPageSelectors.ts'
import { expect, test } from '../wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real Tonkeeper extension test is opt-in')
test.setTimeout(360_000)

test('onboards two ephemeral Tonkeeper accounts and exercises TON Connect in Blockhead', async ({
	baseURL,
	context,
	extensions,
	page,
}) => {
	const extension = extensions.find(({ kind }) => kind === 'tonkeeper')
	if (!extension)
		throw new Error('Tonkeeper lifecycle proof requires the checksum-pinned Tonkeeper extension')

	expect(extension.manifest.version).toBe('26.6.1')
	expect(JSON.parse(await readFile('scripts/wallet-extensions/wallets.json', 'utf8')).tonkeeper).toMatchObject({
		commit: '190ad6b9bd090db5d48ca81ff181e28d993cf91c',
		license: 'Apache-2.0',
		sha256: '32f16f38e23c79e195a3d5c033dc3316752dc53959d7b44607cd4c6e1300993e',
	})
	const manifestUrl = `${baseURL ?? 'http://127.0.0.1:5173'}/tonconnect-manifest.json`
	await test.step('verify the served manifest identifies this app before wallet setup', async () => {
		const response = await context.request.get(manifestUrl)
		expect(response.ok()).toBe(true)
		expect(await response.json()).toMatchObject({
			url: new URL(manifestUrl).origin,
			iconUrl: new URL('/favicon.png', manifestUrl).toString(),
		})
	})
	let manifestProxyRequests = 0
	const requestedManifestUrls: string[] = []
	await test.step('substitute only the remote manifest proxy with the actual local app response', async () => {
		await context.route('https://c.tonapi.io/json?*', async (route) => {
			const encodedUrl = new URL(route.request().url()).searchParams.get('url')
			const requestedManifestUrl = encodedUrl == null ? null : Buffer.from(encodedUrl, 'base64').toString()
			if (requestedManifestUrl != null)
				requestedManifestUrls.push(requestedManifestUrl)
			if (requestedManifestUrl !== manifestUrl) {
				await route.abort('blockedbyclient')
				return
			}
			const response = await context.request.get(manifestUrl)
			expect(response.ok()).toBe(true)
			manifestProxyRequests += 1
			await route.fulfill({
				status: response.status(),
				body: await response.body(),
				contentType: response.headers()['content-type'],
			})
		})
	})

	let password = `Tk!${randomBytes(24).toString('base64url')}`
	const onboarding = await tonkeeperDriver.onboardTwoAccounts(
		context,
		extension,
		password
	)
	expect(onboarding.secondAccountOnboarded).toBe(true)
	await expect(onboarding.page.getByText('Blockhead Ephemeral 2', {
		exact: true,
	})).toBeVisible()

	await page.goto(`${baseURL ?? 'http://127.0.0.1:5173'}/~/wallets`, {
		waitUntil: 'load',
	})
	await expect.poll(() => page.evaluate(() => ({
		connect: typeof window.tonkeeper?.tonconnect.connect,
		disconnect: typeof window.tonkeeper?.tonconnect.send,
		listen: typeof window.tonkeeper?.tonconnect.listen,
		restore: typeof window.tonkeeper?.tonconnect.restoreConnection,
	}))).toEqual({
		connect: 'function',
		disconnect: 'function',
		listen: 'function',
		restore: 'function',
	})
	await expect(walletConnectionsStatusById(page)).toContainText(/Providers detected: [1-9]/, {
		timeout: 120_000,
	})

	const connectButton = connectWalletButtonForDriver(page, 'Tonkeeper')
	await expect(connectButton).toBeVisible()
	const previousPages = new Set(context.pages())
	await connectButton.click()
	const connectionRequestSupported = await tonkeeperDriver.approveConnection(
		await tonkeeperDriver.waitForRequest(
			context,
			extension,
			previousPages
		).then(async (requestPage) => {
			await expect.poll(() => requestedManifestUrls, {
				message: 'Tonkeeper must fetch the manifest for the actual local dApp origin before authority',
				timeout: 10_000,
			}).toEqual([manifestUrl])
			return requestPage
		}),
		password
	)
	password = ''

	expect(connectionRequestSupported).toBe(true)
	expect(manifestProxyRequests).toBeGreaterThan(0)
	const connection = walletConnectionCard(page, 'Tonkeeper')
	await expect(connection).toHaveAttribute('data-connection-status', 'connected', {
		timeout: 120_000,
	})
	await expect(walletConnectionsStatusById(page)).toContainText('Active connections: 1.')
	await expect(page.getByRole('radio')).toHaveCount(1)

	await disconnectWalletButton(page).click()
	await expect(connection).toHaveAttribute('data-connection-status', 'disconnected', {
		timeout: 120_000,
	})
	await expect(walletConnectionsStatusById(page)).toContainText('Active connections: 0.')
})
