import { expect, test } from '@playwright/test'
import { type } from 'arktype'

const factory = '0x1f98431c8ad98523631ae4a59f267346ea31f984'
const token0 = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const token1 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const pool = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
const pathname = `/network/eip155:1/contract/${factory}/uniswap-v3/pool/${token0}/${token1}/500`
const word = (value: bigint) => value.toString(16).padStart(64, '0')
const addressWord = (address: string) => address.slice(2).padStart(64, '0')
const rpcRequest = type({ jsonrpc: "'2.0'", id: 'number', method: 'string', 'params?': 'unknown[]' })
const callRequest = type({ to: 'string', data: 'string' }).or({ to: 'string', input: 'string' })

test('resolves and reloads the factory route with both token coordinates intact', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name
	}, { name: `factory-journey-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}` })
	const factoryCalls: { to: string; data: string }[] = []
	await page.route('**/api-proxy/**Voltaire_JsonRpc**', async (route) => {
		const request = rpcRequest.assert(route.request().postDataJSON())
		let result: string | [] | undefined
		if (request.method === 'eth_chainId') result = '0x1'
		if (request.method === 'eth_blockNumber') result = '0x1312d00'
		if (request.method === 'eth_getCode') result = '0x6000'
		if (request.method === 'eth_getBalance') result = '0x0'
		if (request.method === 'eth_getLogs') result = []
		if (request.method === 'eth_call') {
			const call = callRequest.assert(request.params?.[0])
			const data = 'data' in call ? call.data : call.input
			const signature = data.slice(0, 10)
			if (signature === '0x1698ee82') {
				factoryCalls.push({ to: call.to, data })
				result = `0x${addressWord(pool)}`
			}
			if (signature === '0xc45a0155') result = `0x${addressWord(factory)}`
			if (signature === '0x0dfe1681') result = `0x${addressWord(token0)}`
			if (signature === '0xd21220a7') result = `0x${addressWord(token1)}`
			if (signature === '0xddca3f43') result = `0x${word(500n)}`
			if (signature === '0xd0c93a7c') result = `0x${word(10n)}`
		}
		await route.fulfill({ json: {
			jsonrpc: '2.0',
			id: request.id,
			...(result === undefined ?
				{ error: { code: -32601, message: `Fixture does not implement ${request.method}` } }
			:
				{ result }),
		} })
	})
	await page.goto(pathname, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect.poll(() => factoryCalls.length).toBeGreaterThan(0)
	expect(factoryCalls).toContainEqual({
		to: factory,
		data: `0x1698ee82${addressWord(token0)}${addressWord(token1)}${word(500n)}`,
	})
	await expect(page.locator('#main')).toContainText('500')
	await expect(page).toHaveURL(new RegExp(`${pathname}$`))
	await page.reload({ waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('#main')).toContainText('500')
	await expect(page).toHaveURL(new RegExp(`${pathname}$`))

	await test.step('keeps native identifiers visible while measurements load and fail', async () => {
		const gates = { uniswap: Promise.withResolvers<void>(), oracle: Promise.withResolvers<void>(), cctp: Promise.withResolvers<void>() }
		const pending = new Set<string>()
		await page.route((url) => url.pathname.startsWith('/api-proxy/') || url.hostname === 'iris-api.circle.com', async (route) => {
			let owner: keyof typeof gates | undefined
			if (route.request().url().includes('CircleCctpIris') || new URL(route.request().url()).hostname === 'iris-api.circle.com') owner = 'cctp'
			else if (route.request().method() === 'POST') {
				const request = rpcRequest.assert(route.request().postDataJSON())
				if (request.method === 'eth_call') {
					const call = callRequest.assert(request.params?.[0])
					if (call.to.toLowerCase() === pool) owner = 'uniswap'
					if (call.to.toLowerCase() === '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419') owner = 'oracle'
				}
			}
			if (owner == null) {
				await route.fallback()
				return
			}
			pending.add(owner)
			await gates[owner].promise
			await route.fulfill({ status: 503, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: 'Fixture measurement unavailable' })
		})
		await page.evaluate(async () => {
			const fixtureModule = '/tests/e2e/$candidateIdentity.ts'
			const { mountCandidateIdentity } = await import(fixtureModule)
			mountCandidateIdentity()
		})
		const identities = [
			{ owner: 'uniswap', region: 'Uniswap block identity', label: /20[,\s]?000[,\s]?001/ },
			{ owner: 'oracle', region: 'Oracle round identity', label: /^\s*42\s*$/ },
			{ owner: 'cctp', region: 'CCTP message identity', label: /^\s*0\s+888\s*$/ },
		] as const
		try {
			for (const identity of identities)
				await expect(page.getByRole('region', { name: identity.region }).getByRole('link').filter({ hasText: identity.label })).toBeVisible()
			for (const identity of identities) {
				const region = page.getByRole('region', { name: identity.region })
				await region.getByRole('button', { name: 'Load measurements' }).click()
				await expect.poll(() => pending.has(identity.owner)).toBe(true)
				await expect(region.locator('[data-resource-state="pending"]')).toHaveCount(1)
				await expect(region.getByRole('link').filter({ hasText: identity.label })).toBeVisible()
				gates[identity.owner].resolve()
				await expect(region.locator('[data-resource-state="failed"]')).toHaveCount(1, { timeout: 30_000 })
				await expect(region.getByRole('link').filter({ hasText: identity.label })).toBeVisible()
			}
		} finally {
			for (const gate of Object.values(gates)) gate.resolve()
		}
	})
})
