import {
	expect,
	test,
} from '@playwright/test'

import {
	e2eBrowserNewContextOptions,
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

const persistenceFailureDetails = (failures: readonly string[]) => (
	failures.length === 0 ? '' : `\n${failures.join('\n')}`
)


test.describe('production OPFS lifecycle', () => {
	test('commits local data, closes, and hydrates direct and boundary resources', async ({ browser }, testInfo) => {
		testInfo.setTimeout(300_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const page = await context.newPage()
		const remotePostId = `189${Date.now()}000`
		const remotePostPath = `/x/post/${remotePostId}`
		const remotePostText = `OPFS remote replay fixture ${remotePostId}`
		const persistenceFailures: string[] = []
		const remoteRequests = new Set<string>()
		const reopenedRemoteRequests = new Set<string>()
		const recordPersistenceFailure = (message: string, location: string) => {
			if (/sqlite3_open_v2|OPFS|database is locked|requires an index|index/i.test(message))
				persistenceFailures.push(`${location}: ${message}`)
		}
		await context.route('**/api-proxy/X_FxEmbed_Rest-*/0/**', async (route) => {
			const providerUrl = new URL(
				decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? '')
			)
			await route.fulfill({
				contentType: 'application/json',
				json: (
					providerUrl.pathname.includes('/profile/') ?
						{
							user: {
								type: 'profile',
								id: '44196397',
								screen_name: 'opfs_fixture',
								name: 'OPFS Fixture',
								description: 'Production persistence fixture',
							},
						}
					:
						{
							status: {
								type: 'status',
								id: remotePostId,
								text: remotePostText,
								created_timestamp: 1_768_435_200,
								author: {
									type: 'profile',
									id: '44196397',
									screen_name: 'opfs_fixture',
									name: 'OPFS Fixture',
								},
							},
						}
				),
			})
		})

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
			const diagnostics = setupPageRuntimeDiagnostics(page, {
				failFast: true,
				forwardConsole: true,
				failOnTanStackWarnings: true,
			})
			await diagnostics.step(page.goto(remotePostPath, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(page, 120_000, diagnostics)
			await expect(page.locator('#main')).toContainText(remotePostText, {
				timeout: 120_000,
			})
			await diagnostics.step(page.waitForLoadState('load'))
			expect(
				remoteRequests.size,
				'expected the unique product selector to materialize through its remote source'
			).toBeGreaterThan(0)

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

			await reopenedDiagnostics.step(reopenedPage.goto(remotePostPath, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(reopenedPage, 120_000, reopenedDiagnostics)
			await expect(reopenedPage.locator('#main')).toContainText(remotePostText, {
				timeout: 120_000,
			})
			expect(reopenedRemoteRequests, 'reopened remote state must hydrate without source replay').toEqual(new Set())

		} finally {
			await context.close()
		}

		expect(
			persistenceFailures,
			`production OPFS/index failures${persistenceFailureDetails(persistenceFailures)}`
		).toEqual([])
	})
})
