import assert from 'node:assert/strict'
import test from 'node:test'

import { app } from '../../APP.ts'
import { compileApp } from './generate.ts'

const publicRouteId = (routeId: string) => `/${routeId
	.slice(1)
	.split('/')
	.filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
	.map((segment) => segment.replaceAll(/\[((?:\.\.\.)?[^=\]]+)=[^\]]+\]/g, '[$1]'))
	.join('/')}`

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

test('compiled authored selector routes have generated page closure', () => {
	const compiled = compileApp(app)
	const generatedRoutes = new Set(compiled.generatedFiles
		.filter((file) => file.path.startsWith('src/routes/') && file.path.endsWith('/+page.svelte'))
		.map((file) => publicRouteId(file.path
			.slice('src/routes'.length)
			.slice(0, -'/+page.svelte'.length))))
	const authored = compiled.sourceAccountability.mappedSelectors.filter((row) => row.authoredPage)
	const resolverOnly = compiled.sourceAccountability.mappedSelectors.filter((row) => !row.authoredPage)

	assert.ok(authored.length > 0)
	assert.ok(resolverOnly.length > 0)
	assert.deepEqual(
		[...new Set(authored.map((row) => row.route).filter((route) => !generatedRoutes.has(route)))],
		[],
		'authored selector mappings must be backed by generated page modules',
	)
})
