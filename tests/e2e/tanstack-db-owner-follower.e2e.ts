import { expect, test } from '@playwright/test'

import {
	clearOriginOpfs,
	e2eBrowserNewContextOptions,
} from '../_e2eBrowserHelpers.ts'


const expectPersistencePhase = (
	page: import('@playwright/test').Page,
	phase: 'owner' | 'follower'
) => expect(page.locator('#layout')).toHaveAttribute('data-persistence-phase', phase, {
	timeout: 15_000,
})


test('one production persistence owner promotes a follower and releases ownership on teardown', async ({ browser }) => {
	test.setTimeout(180_000)
	const context = await browser.newContext(e2eBrowserNewContextOptions())
	const owner = await context.newPage()
	await owner.goto('/', { waitUntil: 'domcontentloaded' })
	await clearOriginOpfs(owner)
	await owner.reload({ waitUntil: 'domcontentloaded' })
	await expectPersistencePhase(owner, 'owner')

	const follower = await context.newPage()
	await follower.goto('/', { waitUntil: 'domcontentloaded' })
	await expectPersistencePhase(follower, 'follower')

	await owner.close()
	await expectPersistencePhase(follower, 'owner')
	await follower.reload({ waitUntil: 'domcontentloaded' })
	await expectPersistencePhase(follower, 'owner')
	await context.close()

	const reopenedContext = await browser.newContext(e2eBrowserNewContextOptions())
	const reopened = await reopenedContext.newPage()
	await reopened.goto('/', { waitUntil: 'domcontentloaded' })
	await expectPersistencePhase(reopened, 'owner')
	await reopenedContext.close()
})
