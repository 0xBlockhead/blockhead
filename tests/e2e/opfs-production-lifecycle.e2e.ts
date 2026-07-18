import {
	expect,
	test,
	type Page,
} from '@playwright/test'

import {
	e2eBrowserNewContextOptions,
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


const openLocalMutationFixture = async (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		forwardConsole: true,
		failOnTanStackWarnings: true,
	})
	await diagnostics.step(page.goto('/test/local-mutation-authority', {
		waitUntil: 'domcontentloaded',
		timeout: 120_000,
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	return diagnostics
}

const persistenceFailureDetails = (failures: readonly string[]) => (
	failures.length === 0 ? '' : `\n${failures.join('\n')}`
)


test.describe('production OPFS lifecycle', () => {
	test('commits local data, closes, and hydrates direct and boundary resources', async ({ browser }, testInfo) => {
		testInfo.setTimeout(300_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const page = await context.newPage()
		const persistenceFailures: string[] = []
		const remoteRequests = new Set<string>()
		const reopenedRemoteRequests = new Set<string>()
		const recordPersistenceFailure = (message: string, location: string) => {
			if (/sqlite3_open_v2|OPFS|database is locked|requires an index|index/i.test(message))
				persistenceFailures.push(`${location}: ${message}`)
		}

		page.on('console', (message) => recordPersistenceFailure(message.text(), `console ${message.type()}`))
		page.on('pageerror', (error) => recordPersistenceFailure(error.message, 'pageerror'))
		page.on('requestfailed', (request) => recordPersistenceFailure(
			request.failure()?.errorText ?? 'request failed',
			`request ${request.url()}`
		))
		page.on('request', (request) => {
			if (request.url().includes('/api-proxy/'))
				remoteRequests.add(request.url())
		})

		try {
			const diagnostics = await openLocalMutationFixture(page)
			await page.getByRole('button', { name: 'Create sessions' }).click()
			await expect(page.getByTestId('session-direct'), diagnostics.summary()).toContainText('Authority Session A')
			await expect(page.getByTestId('session-awaited'), diagnostics.summary()).toContainText('Authority Session A')
			await expect(page.locator('#local-authority-sessions'), diagnostics.summary()).toContainText('Authority Session A')
			await expect(page.locator('#local-authority-sessions'), diagnostics.summary()).toContainText('Authority Session B')
			await expect(diagnostics.issues, diagnostics.issues.join('\n')).toEqual([])

			await page.goto('/network/eip155:1', {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			})
			await expectMainVisible(page, 120_000, diagnostics)
			await page.goto('/test/local-mutation-authority', {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			})
			await expectMainVisible(page, 120_000, diagnostics)

			await page.close()
			const reopenedPage = await context.newPage()
			reopenedPage.on('console', (message) => recordPersistenceFailure(message.text(), `reopened console ${message.type()}`))
			reopenedPage.on('pageerror', (error) => recordPersistenceFailure(error.message, 'reopened pageerror'))
			reopenedPage.on('request', (request) => {
				if (request.url().includes('/api-proxy/'))
					reopenedRemoteRequests.add(request.url())
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

			expect(
				remoteRequests.size,
				'expected the production route to record at least one remote-source request before reopen'
			).toBeGreaterThan(0)
			expect(reopenedRemoteRequests, 'reopened local state must not replay remote-source requests').toEqual(new Set())
		} finally {
			await context.close()
		}

		expect(
			persistenceFailures,
			`production OPFS/index failures${persistenceFailureDetails(persistenceFailures)}`
		).toEqual([])
	})
})
