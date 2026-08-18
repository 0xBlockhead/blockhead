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

const commitSha = 'e'.repeat(40)
const blobSha = 'd'.repeat(40)
const path = 'README.md'
const blobText = 'hello blob\n'
const canonicalRemoteUrl = project.http_url_to_repo
const pathPage = `/git/repository/remote/${encodeURIComponent(canonicalRemoteUrl)}/commit/0x${commitSha}/path/${path}`


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


test('GitLab CanonicalRemoteUrl repository shows a GitTreePathResolution blob page', async ({ page }) => {
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
		if (requestUrl.includes(`/repository/blobs/${blobSha}`)) {
			await route.fulfill({
				json: {
					size: 11,
					encoding: 'base64',
					content: btoa(blobText),
					sha: blobSha,
				},
			})
			return
		}
		if (requestUrl.includes('/repository/tree')) {
			await route.fulfill({
				json: requestUrl.includes(`ref=${commitSha}`) ?
					[{
						id: blobSha,
						name: path,
						type: 'blob',
						path,
						mode: '100644',
					}]
				:
					[],
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
		if (
			requestUrl.includes('/repository/tags')
			|| requestUrl.includes('/repository/commits')
		) {
			await route.fulfill({ json: [] })
			return
		}
		if (
			requestUrl.includes('/api/v4/projects/gitlab-org/gitlab')
			&& !requestUrl.includes('/repository/')
			&& !requestUrl.includes('/issues')
			&& !requestUrl.includes('/merge_requests')
			&& !requestUrl.includes('/pipelines')
			&& !requestUrl.includes('/releases')
			&& !requestUrl.includes('/protected_branches')
		) {
			await route.fulfill({ json: project })
			return
		}

		await route.fulfill({
			body: `Unexpected GitLab fixture request: ${requestUrl}`,
			status: 418,
		})
	})

	await page.goto(pathPage, {
		waitUntil: 'domcontentloaded',
	})

	const main = page.locator('#main')
	try {
		await expect(main.getByText(path).first()).toBeAttached({
			timeout: 120_000,
		})
	} catch (error) {
		throw new Error(
			`GitTreePathResolution path did not attach.\nproxy URLs:\n${proxyUrls.join('\n')}\n\nconsole:\n${consoleLines.join('\n')}\n\n${error}`
		)
	}
	await expect(main.getByText('resolved-blob').first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(main.getByText('Blob').first()).toBeAttached()
	await expect(main.locator(`a[href*="/git/repository/remote/${encodeURIComponent(canonicalRemoteUrl)}/commit/0x${commitSha}/path/${path}"]`).first()).toBeAttached()
})
