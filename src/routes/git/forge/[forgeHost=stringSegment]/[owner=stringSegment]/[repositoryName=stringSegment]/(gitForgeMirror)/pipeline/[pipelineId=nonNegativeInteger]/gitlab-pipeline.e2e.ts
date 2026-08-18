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

const pipeline = {
	id: 91,
	iid: 17,
	project_id: project.id,
	sha: 'a'.repeat(40),
	ref: 'master',
	status: 'success',
	source: 'push',
	created_at: '2026-08-12T00:00:00Z',
	updated_at: '2026-08-12T00:01:00Z',
	web_url: 'https://gitlab.com/gitlab-org/gitlab/-/pipelines/91',
}

const job = {
	id: 123,
	name: 'test',
	stage: 'verify',
	status: 'success',
	created_at: '2026-08-12T00:02:00Z',
	started_at: '2026-08-12T00:02:30Z',
	finished_at: '2026-08-12T00:03:30Z',
	duration: 60,
	queued_duration: 30,
	web_url: 'https://gitlab.com/gitlab-org/gitlab/-/jobs/123',
	commit: { id: 'a'.repeat(40) },
	pipeline: {
		id: 91,
		sha: 'a'.repeat(40),
		ref: 'master',
		status: 'success',
	},
}


test('GitLab pipeline and job render as native GitForgePipeline / GitForgeJob journeys', async ({ page }) => {
	test.setTimeout(240_000)
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = (() => {
			try {
				return decodeURIComponent(route.request().url())
			} catch {
				return route.request().url()
			}
		})()
		if (requestUrl.includes('/pipelines/91/jobs')) {
			await route.fulfill({ json: [job] })
			return
		}
		if (requestUrl.includes('/jobs/123')) {
			await route.fulfill({ json: job })
			return
		}
		if (requestUrl.includes('/pipelines/91')) {
			await route.fulfill({ json: pipeline })
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

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab/pipeline/91', {
		waitUntil: 'domcontentloaded',
	})

	await expect(page.locator('#main').getByText('success').first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#main').getByText('master').first()).toBeAttached({
		timeout: 120_000,
	})

	await page.goto('/git/forge/gitlab.com/gitlab-org/gitlab/pipeline/91/job/123')
	await expect(page.locator('#main').getByText('test').first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#main').getByText('verify').first()).toBeAttached({
		timeout: 120_000,
	})
})
