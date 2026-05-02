import { expect, test, type Page } from '@playwright/test'

import {
	collectIssues,
	getViewTransitionSpy,
	installViewTransitionStartSpy,
} from '../_e2eBrowserHelpers.ts'

const isBenignResourceError = (i: string) => (
	i.includes('favicon.ico') && i.includes('404')
)

const rowLabels = (page: Page) => (
	page.locator('ul.list li[data-list-item]:not([hidden]) [data-e2e=row-label]')
)

const assertNoViewTransitionPulse = async (
	page: Page,
	before: { f: number, s: number, u: number },
) => {
	await expect.poll(
		async () => await getViewTransitionSpy(page),
		{ message: 'view transition spy should remain unchanged' },
	).toEqual(before)
}

const assertSingleViewTransitionPulse = async (
	page: Page,
	before: { f: number, s: number, u: number },
) => {
	await expect.poll(
		async () => await getViewTransitionSpy(page),
		{ message: 'expected exactly one view transition pulse' },
	).toEqual({
		f: before.f + 1,
		s: before.s + 1,
		u: before.u + 1,
	})
}

const assertViewTransitionEnvironment = async (page: Page) => {
	expect(
		await page.evaluate(() => typeof document.startViewTransition === 'function'),
	).toBe(true)
	expect(
		await page.evaluate(() => document.visibilityState),
	).toBe('visible')
	expect(
		await page.evaluate(() => matchMedia('(prefers-reduced-motion: no-preference)').matches),
	).toBe(true)
}

test.describe('list view transitions (RefinableList demo)', () => {
	// @ts-expect-error Playwright accepts browser context options here at runtime
	test.use({ reducedMotion: 'no-preference' })

	test.beforeEach(async ({ page }) => {
		await installViewTransitionStartSpy(page)
	})

	const firstDataRowVtn = (page: Page) => (
		page.evaluate(() => {
			const li = document.querySelector<HTMLLIElement>(
				'[data-e2e=list-vt-demo] ul.list li[data-list-item]:not([hidden])',
			)
			if (!li) return ''
			return getComputedStyle(li).getPropertyValue('view-transition-name').trim() || li.style.viewTransitionName
		})
	)

	test('enabled route: quiet load, one transition per native sort/search/clear action', async ({
		page,
	}) => {
		const issues = collectIssues(page)
		await page.goto('/demo/list-view-transitions', { waitUntil: 'load' })
		await assertViewTransitionEnvironment(page)

		await expect(rowLabels(page)).toHaveText([ 'Alpha', 'Bravo', 'Candle' ])
		expect(await firstDataRowVtn(page)).toMatch(/list-item-/)
		await expect.poll(
			async () => await getViewTransitionSpy(page),
			{ message: 'load should not trigger list view transitions' },
		).toEqual({
			f: 0,
			s: 0,
			u: 0,
		})

		const beforeSort = await getViewTransitionSpy(page)
		await page.getByLabel('Sort by').selectOption({ label: 'Z–A' })
		await assertSingleViewTransitionPulse(page, beforeSort)
		await expect(rowLabels(page)).toHaveText([ 'Candle', 'Bravo', 'Alpha' ])

		const search = page.getByRole('searchbox', { name: 'Filter list' })
		const beforeSearch = await getViewTransitionSpy(page)
		await search.click()
		await search.pressSequentially('B', { delay: 25 })
		await assertSingleViewTransitionPulse(page, beforeSearch)
		await expect(rowLabels(page)).toHaveCount(1)
		await expect(rowLabels(page).first()).toHaveText('Bravo')

		const beforeClear = await getViewTransitionSpy(page)
		await page.keyboard.press('Backspace')
		await assertSingleViewTransitionPulse(page, beforeClear)
		await expect(rowLabels(page)).toHaveText([ 'Candle', 'Bravo', 'Alpha' ])

		const serious = issues.filter((i) => !isBenignResourceError(i))
		expect(serious, `browser issues: ${serious.join('\n')}`).toEqual([])
	})

	test('disabled route: native sort/search/clear update rows without starting transitions', async ({
		page,
	}) => {
		const issues = collectIssues(page)
		await page.goto('/demo/list-view-transitions-novt', { waitUntil: 'load' })
		await assertViewTransitionEnvironment(page)

		await expect(rowLabels(page)).toHaveText([ 'Alpha', 'Bravo', 'Candle' ])
		await expect.poll(
			async () => await getViewTransitionSpy(page),
			{ message: 'disabled route should stay quiet on load' },
		).toEqual({
			f: 0,
			s: 0,
			u: 0,
		})

		const beforeSort = await getViewTransitionSpy(page)
		await page.getByLabel('Sort by').selectOption({ label: 'Z–A' })
		await assertNoViewTransitionPulse(page, beforeSort)
		await expect(rowLabels(page)).toHaveText([ 'Candle', 'Bravo', 'Alpha' ])

		const search = page.getByRole('searchbox', { name: 'Filter list' })
		const beforeSearch = await getViewTransitionSpy(page)
		await search.click()
		await search.pressSequentially('B', { delay: 25 })
		await assertNoViewTransitionPulse(page, beforeSearch)
		await expect(rowLabels(page)).toHaveCount(1)
		await expect(rowLabels(page).first()).toHaveText('Bravo')

		const beforeClear = await getViewTransitionSpy(page)
		await page.keyboard.press('Backspace')
		await assertNoViewTransitionPulse(page, beforeClear)
		await expect(rowLabels(page)).toHaveText([ 'Candle', 'Bravo', 'Alpha' ])

		const serious = issues.filter((i) => !isBenignResourceError(i))
		expect(serious, `browser issues: ${serious.join('\n')}`).toEqual([])
	})
})
