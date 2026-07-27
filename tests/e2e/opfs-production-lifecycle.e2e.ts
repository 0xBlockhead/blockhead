import {
	expect,
	test,
} from '@playwright/test'

import {
	e2eBrowserNewContextOptions,
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

const proposalPath = '/proposals/ethereum/eip/EIP-1559'
const proposalTitle = 'EIP-1559: Fee market change for ETH 1.0 chain'
const proposalBody = 'This deterministic fixture introduces a base fee that adjusts with network demand.'
const contentsUrl = 'https://api.github.com/repos/ethereum/EIPs/contents/EIPS?ref=master'
const markdownUrl = 'https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1559.md'
const proposalRequestUrls = [
	contentsUrl,
	markdownUrl,
]
const proposalMarkdown = [
	'---',
	'eip: 1559',
	'title: Fee market change for ETH 1.0 chain',
	'status: Final',
	'category: Core',
	'---',
	'',
	'# Abstract',
	'',
	proposalBody,
].join('\n')

const persistenceFailureDetails = (failures: readonly string[]) => (
	failures.length === 0 ? '' : `\n${failures.join('\n')}`
)

test.describe('production OPFS lifecycle', () => {
	test('commits local data, closes, and hydrates direct and boundary resources', async ({ browser }, testInfo) => {
		testInfo.setTimeout(300_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const page = await context.newPage()
		const persistenceFailures: string[] = []
		const initialProposalRequests = new Set<string>()
		const reopenedProposalRequests = new Set<string>()
		const unexpectedProposalRequests: string[] = []
		const recordPersistenceFailure = (message: string, location: string) => {
			if (/sqlite3_open_v2|OPFS|database is locked|requires an index|index/i.test(message))
				persistenceFailures.push(`${location}: ${message}`)
		}
		await context.route('**/api-proxy/**', async (route) => {
			const decodedUrl = decodeURIComponent(route.request().url())
			if (
				route.request().method() === 'GET'
				&& decodedUrl.endsWith(contentsUrl)
			) {
				await route.fulfill({
					contentType: 'application/json',
					json: [
						{
							type: 'file',
							name: 'eip-1559.md',
						},
					],
				})
				return
			}

			if (
				route.request().method() === 'GET'
				&& decodedUrl.endsWith(markdownUrl)
			) {
				await route.fulfill({
					body: proposalMarkdown,
					contentType: 'text/markdown',
				})
				return
			}

			if (proposalRequestUrls.some((url) => decodedUrl.includes(url)))
				unexpectedProposalRequests.push(`${route.request().method()} ${decodedUrl}`)

			await route.fallback()
		})

		page.on('console', (message) => recordPersistenceFailure(message.text(), `console ${message.type()}`))
		page.on('pageerror', (error) => recordPersistenceFailure(error.message, 'pageerror'))
		page.on('requestfailed', (request) => recordPersistenceFailure(
			request.failure()?.errorText ?? 'request failed',
			`request ${request.url()}`
		))
		page.on('request', (request) => {
			if (proposalRequestUrls.some((url) => decodeURIComponent(request.url()).includes(url)))
				initialProposalRequests.add(request.url())
		})

		try {
			const diagnostics = setupPageRuntimeDiagnostics(page, {
				failFast: true,
				forwardConsole: true,
				failOnTanStackWarnings: true,
			})
			await diagnostics.step(page.goto(proposalPath, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(page, 120_000, diagnostics)
			await expect(page.locator('#main')).toContainText(proposalTitle, {
				timeout: 120_000,
			})
			await expect(page.locator('#main')).toContainText(proposalBody, {
				timeout: 120_000,
			})
			await diagnostics.step(page.waitForLoadState('load'))
			expect(
				initialProposalRequests.size,
				'expected the unique product selector to materialize through its remote source'
			).toBeGreaterThan(0)
			expect(unexpectedProposalRequests).toEqual([])

			await diagnostics.step(page.goto('/test/local-mutation-authority', {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(page, 120_000, diagnostics)
			await diagnostics.step(page.getByRole('button', { name: 'Create sessions' }).waitFor({
				state: 'visible',
				timeout: 120_000,
			}))
			await diagnostics.step(page.getByTestId('session-awaited').waitFor({
				state: 'attached',
				timeout: 120_000,
			}))
			await diagnostics.step(page.getByRole('button', { name: 'Clear sessions' }).click())
			await expect(page.getByTestId('session-direct')).toHaveText('')
			await diagnostics.step(page.getByRole('button', { name: 'Create sessions' }).click())
			await expect(page.getByTestId('session-direct'), diagnostics.summary()).toContainText('Authority Session A')
			await expect(page.getByTestId('session-awaited'), diagnostics.summary()).toContainText('Authority Session A')
			await expect(page.locator('#local-authority-sessions'), diagnostics.summary()).toContainText('Authority Session A')
			await expect(page.locator('#local-authority-sessions'), diagnostics.summary()).toContainText('Authority Session B')
			await expect(page.getByTestId('sessions-persisted'), diagnostics.summary()).toHaveText('persisted')
			await expect(diagnostics.issues, diagnostics.issues.join('\n')).toEqual([])

			await page.close()
			const reopenedPage = await context.newPage()
			reopenedPage.on('console', (message) => recordPersistenceFailure(message.text(), `reopened console ${message.type()}`))
			reopenedPage.on('pageerror', (error) => recordPersistenceFailure(error.message, 'reopened pageerror'))
			reopenedPage.on('request', (request) => {
				if (proposalRequestUrls.some((url) => decodeURIComponent(request.url()).includes(url)))
					reopenedProposalRequests.add(request.url())
			})
			const reopenedDiagnostics = setupPageRuntimeDiagnostics(reopenedPage, {
				failFast: true,
				forwardConsole: true,
				failOnTanStackWarnings: true,
			})
			await reopenedDiagnostics.step(reopenedPage.goto('/test/local-mutation-authority', {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(reopenedPage, 120_000, reopenedDiagnostics)
			await expect(reopenedPage.getByTestId('session-direct')).toContainText('Authority Session A')
			await expect(reopenedPage.getByTestId('session-awaited')).toContainText('Authority Session A')
			await expect(reopenedPage.locator('#local-authority-sessions')).toContainText('Authority Session B')
			await expect(reopenedDiagnostics.issues, reopenedDiagnostics.issues.join('\n')).toEqual([])

			await reopenedDiagnostics.step(reopenedPage.goto(proposalPath, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(reopenedPage, 120_000, reopenedDiagnostics)
			await expect(reopenedPage.locator('#main')).toContainText(proposalTitle, {
				timeout: 120_000,
			})
			await expect(reopenedPage.locator('#main')).toContainText(proposalBody, {
				timeout: 120_000,
			})
			expect(unexpectedProposalRequests).toEqual([])
			expect(reopenedProposalRequests, 'reopened remote state must hydrate without source replay').toEqual(new Set())

		} finally {
			await context.close()
		}

		expect(
			persistenceFailures,
			`production OPFS/index failures${persistenceFailureDetails(persistenceFailures)}`
		).toEqual([])
	})
})
