import { expect, test } from '@playwright/test'
import { type } from 'arktype'
import { writeFile } from 'node:fs/promises'


test.use({ video: { mode: 'on', size: { width: 1440, height: 1000 } }, viewport: { width: 1440, height: 1000 } })
test.skip(process.env.E2E_LEDGER_LIVE !== '1', 'Requires the task-owned Flex Ethereum Speculos instance with its generated test seed')

const deviceEvents = type({ events: type({ text: 'string' }).array() })
const emulator = 'http://127.0.0.1:5500'

test('retains a real device rejection through reload without another device command', async ({ page, request }, testInfo) => {
	testInfo.setTimeout(240_000)
	const screenEvents = type({ events: type({ text: 'string', x: 'number', y: 'number', w: 'number', h: 'number' }).array() })
	const readScreen = async () => {
		const response = await request.get(`${emulator}/events`)
		expect(response.ok()).toBe(true)
		return screenEvents.assert(await response.json()).events
	}
	let deviceCommandCount = 0
	page.on('request', (event) => {
		const url = new URL(event.url())
		if (url.origin === emulator && url.pathname === '/apdu' && event.method() === 'POST')
			deviceCommandCount += 1
	})
	try {
		await page.goto('/~/wallets')
		await expect(page.getByRole('heading', { name: 'Wallet connection status', exact: true })).toBeVisible({ timeout: 120_000 })
		await page.getByRole('button', { name: 'Enable local Ledger emulator', exact: true }).click()
		const candidate = page.locator('[data-wallet-id="ledger:speculos"][data-wallet-state="candidate"]')
		await expect(candidate).toBeVisible({ timeout: 60_000 })
		await candidate.getByRole('button', { name: 'Connect Ledger Speculos (emulator · Sepolia)', exact: true }).click()
		const connection = page.locator('[data-wallet-id="ledger:speculos"][data-connection-status="connected"]')
		await expect(connection.getByRole('textbox', { name: 'Message to sign' })).toBeVisible({ timeout: 60_000 })
		await connection.getByRole('textbox', { name: 'Message to sign' }).fill('Blockhead ETHOnline 2026: reject this test request.')
		expect((await request.delete(`${emulator}/events`)).ok()).toBe(true)
		await connection.getByRole('button', { name: 'Sign message', exact: true }).click()
		await expect.poll(async () => (await readScreen()).map((event) => event.text).join('')).toContain('Review message')
		const reject = (await readScreen()).find((event) => event.text === 'Reject')
		if (reject == null)
			throw new Error('The device review does not expose its Reject control')
		expect((await request.post(`${emulator}/finger`, { data: {
			x: reject.x + Math.floor(reject.w / 2),
			y: reject.y + Math.floor(reject.h / 2),
			action: 'press-and-release',
		} })).ok()).toBe(true)
		await expect.poll(async () => (await readScreen()).map((event) => event.text)).toContain('Yes, reject')
		const confirmReject = (await readScreen()).find((event) => event.text === 'Yes, reject')
		if (confirmReject == null)
			throw new Error('The device rejection confirmation is unavailable')

		expect((await request.post(`${emulator}/finger`, { data: {
			x: confirmReject.x + Math.floor(confirmReject.w / 2),
			y: confirmReject.y + Math.floor(confirmReject.h / 2),
			action: 'press-and-release',
		} })).ok()).toBe(true)
		const history = page.locator('a[href*="/~/wallets/requests/wallet-request-"]')
		await expect(history).toHaveCount(1)
		await history.click()
		const failed = page.getByRole('main').getByRole('link', { name: 'failed', exact: true })
		await expect(failed).toBeVisible({ timeout: 30_000 })
		const failedHref = await failed.getAttribute('href')
		const rejectedDeviceCommandCount = deviceCommandCount
		expect(rejectedDeviceCommandCount).toBeGreaterThan(0)
		await page.reload()
		await expect(failed).toHaveAttribute('href', failedHref ?? '', { timeout: 60_000 })
		expect(deviceCommandCount).toBe(rejectedDeviceCommandCount)
		await testInfo.attach('ledger-rejection-observation', {
			body: JSON.stringify({ failedHref, rejectedDeviceCommandCount, restoredDeviceCommandCount: deviceCommandCount, physicalHardware: false }),
			contentType: 'application/json',
		})
	} finally {
		await writeFile(testInfo.outputPath('device-screen.json'), JSON.stringify(await readScreen()))
	}
})

test('signs through real Ledger device review and restores the native wallet request', async ({ page, context, request }, testInfo) => {
	testInfo.setTimeout(240_000)
	const errors: string[] = []
	const requests = new Map<string, number>()
	const failures: { path: string, status?: number }[] = []
	const startedAt = Date.now()
	let deviceCommandCount = 0
	page.on('request', (event) => {
		const url = new URL(event.url())
		if (url.origin === emulator && url.pathname === '/apdu' && event.method() === 'POST')
			deviceCommandCount += 1
	})
	page.on('request', (event) => requests.set(new URL(event.url()).pathname, Date.now()))
	page.on('requestfinished', (event) => requests.delete(new URL(event.url()).pathname))
	page.on('requestfailed', (event) => {
		const path = new URL(event.url()).pathname
		requests.delete(path)
		failures.push({ path })
	})
	page.on('response', (event) => {
		if (event.status() >= 400)
			failures.push({ path: new URL(event.url()).pathname, status: event.status() })
	})
	page.on('pageerror', (error) => errors.push(error.message.slice(0, 500)))
	const message = 'Blockhead ETHOnline 2026: inspect, authorize, verify.'
	const address = '0x7883053bfc5bc3cab18c35452f5ea317c837fa60'
	const text = async () => {
		const response = await request.get(`${emulator}/events`)
		expect(response.ok()).toBe(true)
		return deviceEvents.assert(await response.json()).events.map((event) => event.text).join('')
	}
	const clear = async () => expect((await request.delete(`${emulator}/events`)).ok()).toBe(true)
	const swipe = async () => {
		await clear()
		expect((await request.post(`${emulator}/finger`, { data: {
			x: 400,
			y: 300,
			x2: 80,
			y2: 300,
			delay: 0.2,
			action: 'press-and-release',
		} })).ok()).toBe(true)
	}
	try {
		const document = await page.goto('/~/wallets')
		expect(document?.status()).toBe(200)
		await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible({ timeout: 120_000 })
		await expect(page.getByRole('heading', { name: 'Wallet connection status', exact: true })).toBeVisible({ timeout: 120_000 })
		await page.getByRole('button', { name: 'Enable local Ledger emulator', exact: true }).click()
		const candidate = page.locator('[data-wallet-id="ledger:speculos"][data-wallet-state="candidate"]')
		// Lazy SDK delivery is a startup phase, separate from the connect action.
		await expect(candidate).toBeVisible({ timeout: 60_000 })
		await candidate.getByRole('button', { name: 'Connect Ledger Speculos (emulator · Sepolia)', exact: true }).click()
		const connection = page.locator('[data-wallet-id="ledger:speculos"][data-connection-status="connected"]')
		await expect(connection.getByRole('textbox', { name: 'Message to sign' })).toBeVisible({ timeout: 60_000 })
		await connection.getByRole('textbox', { name: 'Message to sign' }).fill(message)
		const devicePage = await context.newPage()
		await devicePage.goto(emulator)
		await clear()
		const connectedDeviceCommandCount = deviceCommandCount
		expect(connectedDeviceCommandCount).toBeGreaterThan(0)
		await connection.getByRole('button', { name: 'Sign message', exact: true }).click()
		await expect.poll(text, { timeout: 30_000 }).toContain('Review message')
		await swipe()
		await expect.poll(text).toContain(message)
		await devicePage.reload({ waitUntil: 'load' })
		await devicePage.screenshot({ path: testInfo.outputPath('ledger-message-review.png'), fullPage: true })
		// Reading time only after the exact device message has been verified.
		if (process.env.E2E_DEMO_RECORDING === '1')
			await devicePage.waitForTimeout(6_000)
		await swipe()
		await expect.poll(text).toContain('Hold to sign')
		expect((await request.post(`${emulator}/finger`, { data: {
			x: 240,
			y: 430,
			delay: 2,
			action: 'press-and-release',
		} })).ok()).toBe(true)
		await expect(page.getByText(/Message signed by .*Authority and dispatch history were saved\./)).toBeVisible({ timeout: 30_000 })
		const signedDeviceCommandCount = deviceCommandCount
		expect(signedDeviceCommandCount).toBeGreaterThan(connectedDeviceCommandCount)
		const history = page.locator('a[href*="/~/wallets/requests/wallet-request-"]')
		await expect(history).toHaveCount(1)
		const href = await history.getAttribute('href')
		if (href == null)
			throw new Error('Saved wallet request has no destination')
		await history.click()
		await expect(page).toHaveURL(new URL(href, page.url()).href, { timeout: 60_000 })
		const signed = page.getByRole('main').getByRole('link', { name: 'signed', exact: true })
		await expect(signed).toBeVisible({ timeout: 60_000 })
		const signedHref = await signed.getAttribute('href')
		expect(signedHref).toContain(`${href}/observations/`)
		await expect(page.getByRole('main')).toContainText(new RegExp(address, 'i'))
		await page.reload()
		await expect(signed).toHaveAttribute('href', signedHref ?? '', { timeout: 60_000 })
		await expect(page.getByRole('main')).toContainText(new RegExp(address, 'i'))
		await page.screenshot({ path: testInfo.outputPath('ledger-request-restored.png'), fullPage: true })
		expect(deviceCommandCount).toBe(signedDeviceCommandCount)
		if (process.env.E2E_DEMO_RECORDING === '1')
			await page.waitForTimeout(6_000)
		await testInfo.attach('ledger-live-observation', {
			body: JSON.stringify({ address, message, href, signedHref, connectedDeviceCommandCount, signedDeviceCommandCount, restoredDeviceCommandCount: deviceCommandCount, restored: true, physicalHardware: false }),
			contentType: 'application/json',
		})
	} finally {
		const diagnostics = JSON.stringify({
			elapsedMs: Date.now() - startedAt,
			errors,
			failures,
			pendingCount: requests.size,
			pending: [...requests].slice(0, 32).map(([path, at]) => ({ path, elapsedMs: Date.now() - at })),
			persistencePhase: await page.evaluate(() => document.querySelector('#layout')?.getAttribute('data-persistence-phase')).catch(() => 'document-unavailable'),
		})
		await writeFile(testInfo.outputPath('diagnostics.json'), diagnostics)
		await testInfo.attach('bounded-page-errors', {
			body: diagnostics,
			contentType: 'application/json',
		})
	}
})
