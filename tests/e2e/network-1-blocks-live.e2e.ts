import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	installChainlistRpcsJsonStub,
	preflightChainHeadAdvancesWithRetries,
	publicJsonRpcHttpUrlForChainE2e,
	readTopBlockNumberFromNetworkBlocksPage,
} from '../_e2eBrowserHelpers.ts'

const thisDir = dirname(fileURLToPath(import.meta.url))
const evmBlocksViewPath = join(thisDir, '../../src/views/EvmBlocksView.svelte')
const blocksPagePath = join(
	thisDir,
	'../../src/routes/(explore)/(networks)/network/[networkId]/(network)/blocks/+page.svelte',
)

const pageErrors = (issues: string[]) => (
	issues.filter((i) => i.startsWith('pageerror:'))
)

test.describe('/network/1/blocks (EvmBlocksView + blockHeight-driven query)', () => {
	test('(contract) blocks page hosts EvmBlocksView; list query subscribes to head (blockHeight)', () => {
		const pageSource = readFileSync(blocksPagePath, 'utf8')
		expect(pageSource, blocksPagePath).toContain('EvmBlocksView')
		const view = readFileSync(evmBlocksViewPath, 'utf8')
		expect(view, evmBlocksViewPath).toContain('blockHeightQuery')
		expect(view, evmBlocksViewPath).toContain('blockHeightQuery.data?.height')
		expect(view, evmBlocksViewPath).toContain("data-e2e=\"network-blocks-list\"")
	})

	test('(browser, live) ordered list: top block advances after chain head moves', async ({ page }) => {
		test.setTimeout(400_000)
		await installChainlistRpcsJsonStub(page)
		const rpcUrlRaw = await publicJsonRpcHttpUrlForChainE2e(1)
		expect(
			rpcUrlRaw,
			'no HTTP JSON-RPC for chain 1 (ExecutionEndpoints / Chainlist)',
		).not.toBeNull()
		if (rpcUrlRaw == null) {
			throw new Error('no HTTP JSON-RPC for chain 1 (ExecutionEndpoints / Chainlist)')
		}
		const rpcUrl = rpcUrlRaw
		const preflight = await preflightChainHeadAdvancesWithRetries(
			page,
			rpcUrl,
			3_000,
			{ attempts: 8, betweenAttemptsMs: 4_000 },
		)
		expect(
			preflight.ok,
			preflight.ok
				? 'ok'
				: 'detail' in preflight && preflight.detail != null
					? JSON.stringify(preflight.detail)
				: JSON.stringify(preflight),
		).toBe(true)

		const issues = collectIssues(page)
		await page.goto('/network/1/blocks', { waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible()
		await assertMainSettled(page, 120_000)

		const top0 = await readTopBlockNumberFromNetworkBlocksPage(page)
		expect(top0, 'first /block/ link in list').not.toBeNull()

		await expect.poll(
			async () => {
				const t = await readTopBlockNumberFromNetworkBlocksPage(page, 5_000)
				return t != null && t > (top0 ?? 0n)
			},
			{
				message: 'top list block should pass prior head after a new mainnet block (blockHeight + $$blocks refetch)',
				timeout: 180_000,
				intervals: [3_000, 4_000, 5_000, 6_000, 8_000, 8_000],
			},
		).toBe(true)

		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n'),
		).toEqual([])
	})
})
