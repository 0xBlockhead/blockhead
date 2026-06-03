import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	installChainlistRpcsJsonStub,
	voltaireBlockStreamWatchStartConsoleEvent,
} from '../_e2eBrowserHelpers.ts'


const pageErrors = (issues: string[]) => (
	issues.filter((i) => i.startsWith('pageerror:'))
)

const thisDir = dirname(fileURLToPath(import.meta.url))
const networkPagePath = join(
	thisDir,
	'../../src/routes/(explore)/(networks)/network/[caip2Namespace=caip2Namespace]:[caip2Reference=caip2Reference]/+page.svelte',
)

test.describe('Network head resolveLive (Voltaire block stream)', () => {
	test('(contract) network leaf derives the CAIP-2 network and discriminates EVM routes', () => {
		const source = readFileSync(networkPagePath, 'utf8')
		const networkViewSource = readFileSync(
			join(thisDir, '../../src/views/NetworkView.svelte'),
			'utf8',
		)
		const resolvers = readFileSync(
			join(thisDir, '../../src/resolvers/index.ts'),
			'utf8',
		)
		const hook = readFileSync(
			join(thisDir, '../../src/lib/db/resolveLive.svelte.ts'),
			'utf8',
		)
		expect(source, networkPagePath).toContain('caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference }')
		expect(source).toContain('NetworkView')
		expect(networkViewSource).toContain('EvmNetworkView')
		expect(hook).toContain('$effect')
		expect(hook).toContain('startEntityFieldResolveLiveForParent')
		expect(resolvers).toContain('entityFieldNamesWithResolveLiveByEntityType')
		expect(hook).toContain('entityFieldResolversByEntityTypeAndFieldName')
	})

	test('(browser) /network/eip155:1: main settled, [Voltaire] block stream watch start, no page errors', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		const watchStart = voltaireBlockStreamWatchStartConsoleEvent(page, 90_000)
		await page.goto('/network/eip155:1', { waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible()
		await assertMainSettled(page)
		await watchStart
		await expect(page.locator('[data-scroll-marker-label="Blocks"]')).toBeAttached({ timeout: 120_000 })
		await expect(page.locator('[data-scroll-marker-label="Transactions"]')).toBeAttached({ timeout: 120_000 })
		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n'),
		).toEqual([])
	})
})
