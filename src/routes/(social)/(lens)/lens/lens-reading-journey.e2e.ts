import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import { routeViewSmokeTimeoutsMs } from '../../../../../tests/e2e/_routeViewDiagnostics.ts'


const authorAddress = '0x1111111111111111111111111111111111111111'
const postId = 'deterministic-lens-post'
const postText = 'A deterministic Lens post keeps the social graph readable.'
const author = {
	address: authorAddress,
	owner: authorAddress,
	createdAt: '2026-07-20T12:00:00.000Z',
	score: 1,
	username: {
		localName: 'protocol-reader',
	},
	metadata: {
		name: 'Protocol Reader',
		bio: 'Reads and explains open social protocols.',
		picture: null,
	},
}
const post = {
	__typename: 'Post',
	slug: postId,
	timestamp: '2026-07-20T12:30:00.000Z',
	isEdited: false,
	isDeleted: false,
	author,
	commentOn: null,
	quoteOf: null,
	root: null,
	stats: {
		comments: 1,
		reposts: 2,
		quotes: 3,
		bookmarks: 4,
		collects: 5,
		reactions: 6,
	},
	metadata: {
		__typename: 'TextOnlyMetadata',
		content: postText,
	},
}
test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 3)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-lens-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('latest posts lead to a readable post, author, comments, and observations', async ({ page }) => {
	const lensOperations: string[] = []
	const unexpectedOperations: string[] = []
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))
	await page.route('https://api.lens.xyz/graphql', async (route) => {
		expect(route.request().method()).toBe('POST')
		const body = route.request().postData() ?? ''

		if (body.includes('query LensLatestPosts')) {
			lensOperations.push('LensLatestPosts')
			await route.fulfill({
				json: {
					data: {
					posts: {
						items: [{
							...post,
							author: { address: authorAddress },
						}],
						pageInfo: {
							prev: null,
							next: null,
						},
					},
					},
				},
			})
			return
		}

		if (body.includes('query LensPostComments')) {
			lensOperations.push('LensPostComments')
			await route.fulfill({
				json: {
					data: {
						postReferences: {
							items: [],
							pageInfo: {
								prev: null,
								next: null,
							},
						},
					},
				},
			})
			return
		}

		if (body.includes('query LensPostsByAuthor')) {
			lensOperations.push('LensPostsByAuthor')
			await route.fulfill({
				json: {
					data: {
					posts: {
						items: [{
							...post,
							author: { address: authorAddress },
						}],
						pageInfo: {
							prev: null,
							next: null,
						},
					},
					},
				},
			})
			return
		}

		if (body.includes('query LensPost')) {
			lensOperations.push('LensPost')
			await route.fulfill({ json: { data: { post } } })
			return
		}

		if (body.includes('query LensAccountStats')) {
			lensOperations.push('LensAccountStats')
			await route.fulfill({
				json: {
					data: {
						accountStats: {
							graphFollowStats: {
								followers: 42,
								following: 7,
							},
						},
					},
				},
			})
			return
		}

		if (body.includes('query LensAccount')) {
			lensOperations.push('LensAccount')
			await route.fulfill({
				json: {
					data: {
						account: author,
					},
				},
			})
			return
		}

		unexpectedOperations.push(body)
		await route.fulfill({
			status: 501,
			json: {
				errors: [{ message: 'Unexpected Lens GraphQL operation' }],
			},
		})
	})

	await page.goto('/lens/observations/posts', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const postList = page.locator('#main article#lens-posts[data-card][data-scroll-container]')
	await expect(postList).toHaveCount(1)
	const postLink = postList.locator(`a[href="/lens/post/${postId}"]`).first()
	await expect(postLink).toContainText(postText, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await postLink.click()

	await expect(page).toHaveURL(`/lens/post/${postId}`)
	const main = page.locator('#main')
	await expect(main).toContainText(postText)
	await expect(main.locator(`a[href="/lens/account/${authorAddress}"]`).first()).toBeAttached()
	const observationLink = main.locator(`a[href^="/lens/post/${postId}/observations/"]`).first()
	await expect(observationLink).toBeAttached({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await observationLink.click()
	await expect(page).toHaveURL(new RegExp(`/lens/post/${postId}/observations/[0-9]+$`))
	const commentMetric = main.locator('dt').filter({ hasText: /^Comments$/ }).locator('..')
	await expect(commentMetric).toContainText('1', {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(main.locator('dt').filter({ hasText: /^Reactions$/ }).locator('..')).toContainText('6')
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)

	await page.goBack()
	await main.locator(`a[href="/lens/account/${authorAddress}"]`).first().click()
	await expect(page).toHaveURL(`/lens/account/${authorAddress}`)
	await expect(main).toContainText('Protocol Reader')
	await expect(main).toContainText('protocol-reader')
	await expect(main).toContainText('Reads and explains open social protocols.')
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)

	expect(lensOperations).toEqual(expect.arrayContaining([
		'LensLatestPosts',
		'LensPost',
		'LensPostComments',
		'LensAccount',
	]))
	expect(unexpectedOperations).toEqual([])
	expect(consoleErrors).toEqual([])
	expect(pageErrors).toEqual([])
})

test('provider failure renders through the resource boundary', async ({ page }) => {
	await page.route('https://api.lens.xyz/graphql', async (route) => {
		await route.fulfill({
			json: {
				data: {},
				errors: [{ message: 'Deterministic Lens provider failure' }],
			},
		})
	})

	await page.goto('/lens/observations/posts', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const failure = page.locator('#main [data-resource-state="failed"]')
	await expect(failure).toHaveCount(1, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(failure).toHaveAttribute('aria-label', 'Internal Error')
	await expect(page.locator('#main article#lens-posts[data-card][data-scroll-container]')).toHaveCount(1)
})

test('an empty latest-post response settles in the generated posts card', async ({ page }) => {
	await page.route('https://api.lens.xyz/graphql', async (route) => {
		expect(route.request().method()).toBe('POST')
		expect(route.request().postData()).toContain('query LensLatestPosts')
		await route.fulfill({
			json: {
				data: {
					posts: {
						items: [],
						pageInfo: {
							prev: null,
							next: null,
						},
					},
				},
			},
		})
	})

	await page.goto('/lens/observations/posts', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const postList = page.locator('#main article#lens-posts[data-card][data-scroll-container]')
	await expect(postList).toHaveCount(1)
	await expect(postList).toContainText('No Lens posts yet.', {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(postList.locator('a[href^="/lens/post/"]')).toHaveCount(0)
	await expect(postList.locator('[data-error], [role="alert"]')).toHaveCount(0)
})
