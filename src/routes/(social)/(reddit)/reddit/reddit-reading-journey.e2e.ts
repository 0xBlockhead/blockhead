import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'
import { installRouteViewSqliteIsolation } from '../../../../../tests/e2e/_routeViewFixtures.ts'


const redditListing = (
	children: object[],
	after?: string | null
) => ({
	kind: 'Listing',
	data: {
		...(after !== undefined && {
			after,
		}),
		children,
	},
})

const submission = {
	kind: 't3',
	data: {
		name: 't3_1u8x2f8',
		subreddit: 'ethereum',
		title: 'Daily General Discussion June 18, 2026',
		permalink: '/r/ethereum/comments/1u8x2f8/daily_general_discussion_june_18_2026/',
		author: '/u/EthereumDailyThread',
		created_utc: 1_781_758_884,
		score: 128,
		num_comments: 2,
	},
}

const comment = {
	kind: 't1',
	data: {
		name: 't1_osbo75d',
		body: 'Ethereum!',
		author: '/u/Mysterious_Town6196',
		created_utc: 1_781_758_895,
		depth: 0,
		link_id: 't3_1u8x2f8',
		parent_id: 't3_1u8x2f8',
		score: 17,
		replies: redditListing([
			{
				kind: 't1',
				data: {
					name: 't1_nestedreply',
					body: 'Layer two keeps the discussion grounded.',
					author: '/u/reply_reader',
					created_utc: 1_781_758_925,
					depth: 1,
					link_id: 't3_1u8x2f8',
					parent_id: 't1_osbo75d',
					score: 9,
					replies: '',
				},
			},
		]),
	},
}

const secondSubmission = {
	kind: 't3',
	data: {
		name: 't3_second',
		subreddit: 'ethereum',
		title: 'Protocol research update',
		permalink: '/r/ethereum/comments/second/protocol_research_update/',
		author: '/u/protocol_researcher',
		created_utc: 1_781_758_985,
		score: 64,
		num_comments: 0,
	},
}


test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-reddit-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (!url.includes('reddit.com/')) {
			await route.continue()
			return
		}
		if (url.includes('/r/ethereum/about.json')) {
			await route.fulfill({
				json: {
					kind: 't5',
					data: {
						display_name: 'ethereum',
						title: 'r/ethereum',
						public_description: 'Ethereum community',
						created_utc: 1_330_000_000,
						over18: false,
						subscribers: 3_000_000,
						active_user_count: 1_234,
					},
				},
			})
			return
		}
		if (
			url.includes('/r/ethereum/hot.json')
			&& testInfo.title === 'community listing remains boundary-owned while its provider request is pending'
		) {
			await new Promise<void>(() => {})
			return
		}
		if (
			url.includes('/r/ethereum/hot.json')
			&& testInfo.title === 'community listing resolves empty without an invented fallback'
		) {
			await route.fulfill({
				json: redditListing([], null),
			})
			return
		}
		if (
			url.includes('/r/ethereum/hot.json')
			&& testInfo.title === 'community provider failure renders through its existing boundary'
		) {
			await route.fulfill({
				contentType: 'application/json',
				json: { message: 'Deterministic Reddit provider unavailable' },
				status: 503,
			})
			return
		}
		if (
			url.includes('/r/ethereum/hot.json')
			|| url.includes('/r/popular/hot.json')
		) {
			await route.fulfill({
				json: (
					url.includes('after=t3_first') ?
						redditListing([secondSubmission], null)
					:
						redditListing([submission], 't3_first')
				),
			})
			return
		}
		if (url.includes('/comments/1u8x2f8.json')) {
			await route.fulfill({
				json: [
					redditListing([submission]),
					redditListing([comment]),
				],
			})
			return
		}
		if (url.includes('/api/info.json')) {
			await route.fulfill({
				json: redditListing([
					url.includes('t1_nestedreply') ?
						comment.data.replies.data.children[0]
					: url.includes('t1_osbo75d') ?
						comment
					: url.includes('t3_second') ?
						secondSubmission
					:
						submission,
				]),
			})
			return
		}
		await route.abort('blockedbyclient')
	})
})


test('community listing remains boundary-owned while its provider request is pending', async ({ page }) => {
	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const community = page.locator('#main article[id^="reddit-subreddit-"]')
	await expect(community).toHaveCount(1, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(community.locator('.entity-details > span[data-resource-state="pending"]').first()).toHaveAttribute('aria-busy', 'true')
	await expect(community.locator('article#links')).toHaveCount(0)
})

test('community listing resolves empty without an invented fallback', async ({ page }) => {
	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const community = page.locator('#main article[id^="reddit-subreddit-"]')
	await expect(community).toHaveCount(1, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(community.getByRole('heading', {
		name: 'r/ethereum',
	})).toBeAttached()
	await expect(community.locator('article#links')).toHaveCount(0)
	await expect(community.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

test('community provider failure renders through its existing boundary', async ({ page }) => {
	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const community = page.locator('#main article[id^="reddit-subreddit-"]')
	await expect(community).toHaveCount(1, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	const failure = community.locator('.entity-details > span[data-resource-state="failed"]').first()
	await expect(failure).toBeAttached({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(failure).toHaveAttribute('aria-label', 'Internal Error')
	await expect(community.locator('article#links')).toHaveCount(0)
})

test('community to post preserves Reddit identity and navigation', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await step(page.goto('/reddit/r/ethereum', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: [
					'Reddit',
					'r/ethereum',
					'Daily General Discussion June 18, 2026',
				],
				minimumEntityRows: 1,
				minimumLinks: 3,
			}
		))
		await step(expect(page.locator('[data-social-client-archetype="reddit"] nav')).toBeVisible())
		const communityCards = page.locator('#main article#links[data-card][data-scroll-container]')
		await step(expect(communityCards).toHaveCount(1))
		await step(expect(communityCards.getByRole('heading', {
			name: /Submissions/,
		})).toBeAttached())

		await step(communityCards.getByRole('link', {
			name: 'Daily General Discussion June 18, 2026',
		}).first().click())
		await step(expect(page).toHaveURL('/reddit/link/t3_1u8x2f8'))
		await step(expect(page.getByRole('navigation', {
			name: 'Reddit navigation',
		})).toBeVisible())
		await step(expect(page.locator('#main a[href="/reddit/r/ethereum"]')).toBeAttached())
		await step(expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0))
		expect(pageErrors).toEqual([])
		expect(consoleErrors).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})

test('comment thread opens an authored comment and parent submission', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)

	await page.goto('/reddit/link/t3_1u8x2f8/comments', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const commentCards = page.locator('#main article[data-card][data-scroll-container]').filter({
		has: page.getByRole('heading', {
			name: /Comments/,
		}),
	})
	await expect(commentCards).toHaveCount(1)
	await expect(commentCards.getByRole('heading', {
		name: /Comments/,
	})).toBeAttached()
	await expect(commentCards.getByRole('link', {
		name: 'Ethereum!',
	})).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await commentCards.getByRole('link', {
		name: 'Ethereum!',
	}).click()
	await expect(page).toHaveURL('/reddit/comment/t1_osbo75d')
	await expect(page.locator('#main')).toContainText('/u/Mysterious_Town6196')
	await expect(page.locator('#main')).toContainText('Layer two keeps the discussion grounded.', {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(page.locator('#main')).toContainText('Daily General Discussion June 18, 2026')
	await expect(page.locator('#main a[href="/reddit/link/t3_1u8x2f8"]')).toBeAttached()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
})

test('back navigation restores the community reading position', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 3)

	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const communityCards = page.locator('#main article#links[data-card][data-scroll-container]')
	await expect(communityCards).toHaveCount(1, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	const submissionLink = communityCards.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	})
	await expect(submissionLink).toBeVisible({
		timeout: 120_000,
	})
	await submissionLink.scrollIntoViewIfNeeded()
	const scrollTop = await page.locator('#main').evaluate((main) => main.scrollTop)
	await submissionLink.click()
	await expect(page).toHaveURL('/reddit/link/t3_1u8x2f8')
	await page.goBack()
	await expect(page).toHaveURL('/reddit/r/ethereum')
	await expect(communityCards.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	})).toBeVisible()
	await expect.poll(async () => page.locator('#main').evaluate((main) => main.scrollTop)).toBe(scrollTop)
})

test('community continuation appends a terminal page without duplicate rows', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)

	await page.goto('/reddit/r/ethereum', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	const communityCards = page.locator('#main article#links[data-card][data-scroll-container]')
	await expect(communityCards).toHaveCount(1, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	const firstSubmission = communityCards.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	})
	await expect(firstSubmission).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	const firstSubmissionElement = await firstSubmission.elementHandle()
	await communityCards.getByRole('button', {
		name: 'Load more',
	}).click()
	await expect(communityCards.getByRole('link', {
		name: 'Protocol research update',
	})).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(communityCards.getByRole('link', {
		name: 'Daily General Discussion June 18, 2026',
	})).toHaveCount(1)
	await expect(communityCards.getByRole('link', {
		name: 'Protocol research update',
	})).toHaveCount(1)
	expect(await firstSubmissionElement?.evaluate((element) => element.isConnected)).toBe(true)
	await expect(communityCards.getByRole('button', {
		name: 'Load more',
	})).toHaveCount(0)
})
