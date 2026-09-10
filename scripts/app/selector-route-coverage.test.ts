import assert from 'node:assert/strict'
import test from 'node:test'

import { app } from '../../APP.ts'

test('every declared selector has one authored route disposition', () => {
	const dispositions = new Map<string, boolean | object | undefined>()
	const routes = [app.routes]
	for (const route of routes) {
		for (const [entityType, selectors] of Object.entries(route.selectors ?? {}))
			for (const [selectorName, mapping] of Object.entries(selectors)) {
				const key = `${entityType}.${selectorName}`
				assert.equal(dispositions.has(key), false, `Duplicate route disposition for ${key}`)
				dispositions.set(key, mapping.page)
			}

		routes.push(...Object.values(route.children ?? {}))
	}

	const missing = app.schema.entities.flatMap((entity) => (
		entity.selectors
			.map((selector) => `${entity.entityType}.${selector.name}`)
			.filter((key) => !dispositions.has(key))
	))
	assert.deepEqual(missing, [])
})
