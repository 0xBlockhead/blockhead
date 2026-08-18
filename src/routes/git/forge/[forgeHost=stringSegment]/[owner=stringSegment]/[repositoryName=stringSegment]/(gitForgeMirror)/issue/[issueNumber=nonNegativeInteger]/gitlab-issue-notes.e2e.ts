import { expect, test } from '@playwright/test'


const project = {
	id: 278964,
	path: 'gitlab',
	path_with_namespace: 'gitlab-org/gitlab',
	default_branch: 'master',
	visibility: 'public',
	http_url_to_repo: 'https://gitlab.com/gitlab-org/gitlab.git',
	ssh_url_to_repo: 'git@gitlab.com:gitlab-org/gitlab.git',
	web_url: 'https://gitlab.com/gitlab-org/gitlab',
	repository_object_format: 'sha1',
}


const decodeProxyUrl = (url: string) => {
	try {
		const once = decodeURIComponent(url)
		try {
			return decodeURIComponent(once)
		} catch {
			return once
		}
	} catch {
		return url
	}
}


test('GitLab issue $$notes list settles on the issue card after opening Details', async ({ page }) => {
	test.setTimeout(180_000)
	const proxyUrls: string[] = []
	const consoleLines: string[] = []
	page.on('console', (message) => {
		consoleLines.push(`${message.type()}: ${message.text()}`)
	})
	page.on('pageerror', (error) => {
		consoleLines.push(`pageerror: ${error.message}`)
	})
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = decodeProxyUrl(route.request().url())
		proxyUrls.push(requestUrl)
		if (/\/issues\/12\/notes\/\d+/.test(requestUrl)) {
			await route.fulfill({
				json: {
					id: 302,
					body: 'Preserve native comments',
					created_at: '2026-01-04T00:00:00Z',
					updated_at: '2026-01-04T00:00:00Z',
					system: false,
					noteable_iid: 12,
					noteable_type: 'Issue',
					type: null,
				},
			})
			return
		}
		if (/\/issues\/12\/notes(?:\?|$)/.test(requestUrl)) {
			await route.fulfill({
				json: [{
					id: 302,
					body: 'Preserve native comments',
					created_at: '2026-01-04T00:00:00Z',
					updated_at: '2026-01-04T00:00:00Z',
					system: false,
					noteable_iid: 12,
					noteable_type: 'Issue',
					type: null,
				}],
			})
			return
		}
		if (requestUrl.includes('/issues/12')) {
			await route.fulfill({
				json: {
					iid: 12,
					project_id: project.id,
					title: 'Preserve native repository links',
					state: 'closed',
					labels: [
						'architecture',
					],
					created_at: '2026-01-01T00:00:00Z',
					updated_at: '2026-01-02T00:00:00Z',
					closed_at: '2026-01-03T00:00:00Z',
				},
			})
			return
		}
		if (requestUrl.includes('/repository/commits')) {
			await route.fulfill({
				json: [{
					id: 'f'.repeat(40),
					short_id: 'f'.repeat(8),
					title: 'Connect complete commit history',
					message: 'Connect complete commit history',
					parent_ids: ['a'.repeat(40)],
					author_name: 'Commit Author',
					author_email: 'author@example.com',
					authored_date: '2026-04-01T00:00:00Z',
					committer_name: 'Committer',
					committer_email: 'committer@example.com',
					committed_date: '2026-04-01T00:00:00Z',
					web_url: `https://gitlab.com/gitlab-org/gitlab/-/commit/${'f'.repeat(40)}`,
				}],
			})
			return
		}
		if (requestUrl.includes('/repository/branches')) {
			await route.fulfill({
				json: [
					{
						name: 'master',
						commit: {
							id: 'a'.repeat(40),
							committed_date: '2026-04-01T00:00:00Z',
						},
					},
				],
			})
			return
		}
		if (requestUrl.includes('/repository/tags') || requestUrl.includes('/repository/tree')) {
			await route.fulfill({ json: [] })
			return
		}
		if (
			requestUrl.includes('/pipelines?')
			|| requestUrl.includes('/issues?')
			|| requestUrl.includes('/merge_requests?')
			|| requestUrl.includes('/releases?')
			|| requestUrl.includes('/protected_branches')
		) {
			await route.fulfill({ json: [] })
			return
		}

		await route.fulfill({ json: project })
	})

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab/issue/12', {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main').getByText('Preserve native repository links').first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#main').getByText('closed').first()).toBeAttached()

	const issueDetails = page.locator('#main article details').first()
	await expect(issueDetails).toBeAttached()
	if (!await issueDetails.evaluate((element) => element instanceof HTMLDetailsElement && element.open))
		await issueDetails.locator('summary').click()

	const notesList = page.locator('#notes')
	try {
		await expect(notesList).toBeAttached({
			timeout: 120_000,
		})
	} catch (error) {
		throw new Error(
			`Issue $$notes list did not attach #notes.\nproxy URLs:\n${proxyUrls.join('\n')}\n\nconsole:\n${consoleLines.join('\n')}\n\n${error}`
		)
	}
	try {
		await expect(notesList.getByText('Preserve native comments').first()).toBeAttached({
			timeout: 120_000,
		})
	} catch (error) {
		throw new Error(
			`Issue $$notes list attached #notes without note body.\nproxy URLs:\n${proxyUrls.join('\n')}\n\nconsole:\n${consoleLines.join('\n')}\n\n${error}`
		)
	}
})
