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
const networkLayoutPath = join(
	thisDir,
	'../../src/routes/(explore)/(networks)/network/[networkId]/+layout.svelte',
)

test.describe('Network head resolveLive (Voltaire block stream)', () => {
	test('(contract) (network) layout still mounts resolveLive for Network (resolveLive from registry)', () => {
		const source = readFileSync(networkLayoutPath, 'utf8')
		const resolvers = readFileSync(
			join(thisDir, '../../src/resolvers/index.ts'),
			'utf8',
		)
		const hook = readFileSync(
			join(thisDir, '../../src/lib/db/resolveLive.svelte.ts'),
			'utf8',
		)
		expect(source, networkLayoutPath).toContain('mountEntityResolveLive')
		expect(source).toContain('EntityType.Network')
		expect(hook).toContain('$effect')
		expect(hook).toContain('startEntityFieldResolveLiveForParent')
		expect(resolvers).toContain('entityFieldNamesWithResolveLiveByEntityType')
		expect(hook).toContain('entityFieldResolversByEntityTypeAndFieldName')
	})

	test('(browser) /network/1: main settled, [Voltaire] block stream watch start, no page errors', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		const watchStart = voltaireBlockStreamWatchStartConsoleEvent(page, 30_000)
		await page.goto('/network/1', { waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible()
		await assertMainSettled(page)
		await watchStart
		await expect(page.locator('[data-scroll-marker-label="Blocks"]')).toBeVisible()
		await expect(page.locator('[data-scroll-marker-label="Transactions"]')).toBeVisible()
		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n'),
		).toEqual([])
	})
})
