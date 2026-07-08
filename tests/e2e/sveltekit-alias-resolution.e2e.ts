import { expect, test } from '@playwright/test'

import { EntityType } from '$/schema/EntityType.ts'
import { schemaMeta } from '$/schema/index.ts'


test.describe('SvelteKit alias resolution', () => {
	test('$ alias resolves during Playwright test collection', () => {
		expect(EntityType.Network).toBe('Network')
		expect(schemaMeta.entityDefinitionByType[EntityType.Network].entityType).toBe(EntityType.Network)
	})
})
