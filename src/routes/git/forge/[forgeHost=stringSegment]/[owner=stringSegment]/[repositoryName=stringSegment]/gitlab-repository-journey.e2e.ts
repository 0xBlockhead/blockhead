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
}

test('GitLab mirror visibly connects provider identity to the native Git repository and refs', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = decodeURIComponent(route.request().url())
		if (requestUrl.includes('/repository/commits?')) {
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
						},
					},
				],
			})
			return
		}
		if (requestUrl.includes('/repository/tags')) {
			await route.fulfill({ json: [] })
			return
		}
		if (requestUrl.includes('/repository/tree')) {
			await route.fulfill({ json: [] })
			return
		}
		if (requestUrl.includes('/issues/12')) {
			await route.fulfill({
				json: {
					iid: 12,
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
		if (requestUrl.includes('/merge_requests/34')) {
			await route.fulfill({
				json: {
					iid: 34,
					title: 'Connect the repository graph',
					state: 'merged',
					target_branch: 'master',
					source_branch: 'native-repository-links',
					sha: 'c'.repeat(40),
					created_at: '2026-02-01T00:00:00Z',
					updated_at: '2026-02-02T00:00:00Z',
					merged_at: '2026-02-03T00:00:00Z',
				},
			})
			return
		}
		if (requestUrl.includes('/releases/v1.0.0')) {
			await route.fulfill({
				json: {
					tag_name: 'v1.0.0',
					name: 'Version 1.0.0',
					created_at: '2026-03-01T00:00:00Z',
					released_at: '2026-03-02T00:00:00Z',
					commit: {
						id: 'd'.repeat(40),
					},
				},
			})
			return
		}

		await route.fulfill({ json: project })
	})

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab', {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main')).toContainText('Gitlab_Rest', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('https://gitlab.com/gitlab-org/gitlab')
	await expect(page.locator('#main')).toContainText('public')
	const repositoryLink = page.locator('a[href*="/git/repository/remote/"]')
	await expect(repositoryLink).toBeAttached()

	await repositoryLink.click()
	await expect(page).toHaveURL(/\/git\/repository\/remote\//)
	await expect(page.locator('#main')).toContainText('refs/heads/master', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('sha1')
	await expect(page.locator(`a[href*="/git/object/0x${'f'.repeat(40)}/sha1"]`)).toBeAttached()

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab/issue/12')
	await expect(page.locator('#main')).toContainText('Preserve native repository links', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('closed')

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab/pull-request/34')
	await expect(page.locator('#main')).toContainText('Connect the repository graph', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('native-repository-links')

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab/release/v1.0.0')
	await expect(page.locator('#main')).toContainText('Version 1.0.0', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('v1.0.0')
})
