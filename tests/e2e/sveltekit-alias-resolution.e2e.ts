import { expect, test } from '@playwright/test'

import { EntityType } from '$/schema/EntityType.ts'


test.describe('SvelteKit alias resolution', () => {
	test('$ alias resolves during Playwright test collection', () => {
		expect(EntityType.Network).toBe('Network')
	})
})
