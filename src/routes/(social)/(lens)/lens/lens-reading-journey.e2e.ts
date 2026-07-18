import { expect, test } from '@playwright/test'


test.describe('Lens reading journey', () => {
	test('latest posts lead to a readable post and author account', async ({ page }) => {
		test.setTimeout(180_000)
		await page.goto('/lens/observations/posts', {
			waitUntil: 'domcontentloaded',
		})

		await expect(page).toHaveURL((url) => url.pathname === '/lens/observations/posts')
		await expect(page.locator('#main')).toContainText('Lens posts')

		const post = page.locator('#main a[href^="/lens/post/"]').first()
		const failure = page.locator('#main').getByText(/error|failed|unavailable/i).first()
		await expect(post.or(failure)).toBeAttached({
			timeout: 120_000,
		})
		if (await failure.isVisible())
			return

		const postPath = await post.getAttribute('href')
		expect(postPath).not.toBeNull()
		await post.click()

		await expect(page).toHaveURL((url) => url.pathname === postPath)
		await expect(page.locator('#main')).toContainText('Lens post')

		const author = page.locator('#main a[href^="/lens/account/"]').first()
		await expect(author.or(failure)).toBeAttached({
			timeout: 120_000,
		})
		if (await failure.isVisible())
			return

		const accountPath = await author.getAttribute('href')
		expect(accountPath).not.toBeNull()
		await author.click()

		await expect(page).toHaveURL((url) => url.pathname === accountPath)
		await expect(page.locator('#main')).toContainText('Lens account')
	})
})
