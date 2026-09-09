import assert from 'node:assert/strict'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { parse } from 'svelte/compiler'
import ts from 'typescript'

import { app, Source } from '../../APP.ts'
import { EntityMetaKey } from '../../src/schema/$schema.ts'
import { compileApp } from './generate.ts'
import { renderGeneratedFile } from './render.ts'

const baseline = compileApp(app)

const resourceExpression = (view: string, compiled = baseline) => {
	const file = compiled.generatedFiles.find((candidate) => candidate.path === `src/views/${view}View.svelte`)
	assert.ok(file)
	const source = renderGeneratedFile(file)
	const component = parse(source, { modern: true }).fragment.nodes.find((node) => (
		node.type === 'Component' && node.name === 'EntitiesList'
	))
	assert.ok(component?.type === 'Component')
	const attribute = component.attributes.find((attribute) => attribute.type === 'Attribute' && attribute.name === 'resource')
	assert.ok(attribute?.type === 'Attribute' && attribute.value !== true)
	const value = Array.isArray(attribute.value) ? attribute.value[0] : attribute.value
	assert.ok(value?.type === 'ExpressionTag')
	return source.slice(value.expression.start, value.expression.end)
}

type Query = {
	fields?: Record<string, boolean>
	sources?: string[]
	limit?: number
	where?: (input: { row: object }) => boolean
}

const execute = (expression: string, sources?: string[], bindings: Record<string, unknown> = {}) => {
	const calls: Query[] = []
	const selection = Object.assign((query: Query) => { calls.push(query) }, { sources })
	runInNewContext(ts.transpileModule(expression, {
		compilerOptions: { target: ts.ScriptTarget.ESNext },
	}).outputText, { selection, Source, EntityMetaKey, ...bindings })
	assert.equal(calls.length, 1)
	return calls[0]
}

test('plain plural queries preserve fields and source precedence without a spread wrapper', () => {
	for (const { view, fields, defaults } of [
		{ view: 'Urls', fields: ['url'], defaults: undefined },
		{ view: 'EvmErrors', fields: ['hex'], defaults: [Source.Openchain_Rest, Source.FourByteDirectory_Rest] },
	]) {
		const expression = resourceExpression(view)
		for (const sources of [undefined, [], [Source.Constants_Internal]]) {
			const query = execute(expression, sources)
			assert.deepEqual(Object.keys(query.fields ?? {}), fields)
			assert.ok(Object.values(query.fields ?? {}).every((value) => value === true))
			assert.deepEqual(query.sources == null ? undefined : [...query.sources], defaults == null ? undefined : sources ?? defaults)
		}
		const ast = ts.createSourceFile('query.ts', expression, ts.ScriptTarget.Latest, true)
		const statement = ast.statements[0]
		assert.ok(statement && ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression))
		const query = statement.expression.arguments[0]
		assert.ok(query && ts.isObjectLiteralExpression(query))
		assert.equal(query.properties.some(ts.isSpreadAssignment), false)
	}
})

test('plural query composition retains filter activation and runtime limits', () => {
	const expression = resourceExpression('Market_TimeInterval_Timestamps')
	for (const timeInterval of [undefined, { unit: 'day', value: 1 }]) {
		const query = execute(expression, [], {
			timeInterval,
			limit: 7,
			and: (...values: boolean[]) => values.every(Boolean),
			eq: (left: unknown, right: unknown) => left === right,
		})
		assert.equal(query.limit, 7)
		assert.deepEqual([...query.sources ?? []], [])
		assert.deepEqual(Object.keys(query.fields ?? {}), ['timeInterval', 'close', 'timestampMs'])
		if (timeInterval == null) {
			assert.equal(query.where, undefined)
			continue
		}
		assert.ok(query.where)
		for (const { unit, value, expected } of [
			{ unit: 'day', value: 1, expected: true },
			{ unit: 'hour', value: 1, expected: false },
			{ unit: 'day', value: 2, expected: false },
		])
			assert.equal(query.where({ row: {
				[EntityMetaKey.Value]: { [EntityMetaKey.Selector]: { timeInterval: { unit, value } } },
			} }), expected)
	}
})

test('filtered named source selection overrides the base query sources', () => {
	const compiled = compileApp({
		...app,
		schema: {
			...app.schema,
			entities: app.schema.entities.map((entity) => entity.entityType !== 'Url' ? entity : {
				...entity,
				views: {
					...entity.views,
					plural: {
						...entity.views.plural,
						filters: [{ prop: 'url', selectorPath: 'url' }],
						query: {
							sources: {
								name: 'pluralQueryFixture',
								default: [Source.Constants_Internal],
								cases: [{ when: [{ field: 'url', equals: 'https://example.com' }], sources: [Source.Openchain_Rest] }],
							},
						},
					},
				},
			}),
		},
	})
	const calls: object[] = []
	const query = execute(resourceExpression('Urls', compiled), [Source.Constants_Internal], {
		url: 'https://example.com',
		pluralQueryFixtureSources: (input: object) => {
			calls.push(input)
			return [Source.Openchain_Rest]
		},
		eq: (left: unknown, right: unknown) => left === right,
	})
	assert.deepEqual([...query.sources ?? []], [Source.Openchain_Rest])
	assert.equal(JSON.stringify(calls), JSON.stringify([{ url: 'https://example.com' }]))
	assert.deepEqual(Object.keys(query.fields ?? {}), ['url'])
	assert.ok(query.where)
	assert.equal(query.where({ row: {
		[EntityMetaKey.Value]: { [EntityMetaKey.Selector]: { url: 'https://example.com' } },
	} }), true)
})

test('limit-only queries retain a zero runtime limit and named source fallback', () => {
	const calls: object[] = []
	const query = execute(resourceExpression('SpecificationProposals'), undefined, {
		limit: 0,
		specificationProposalSources: (input: object) => {
			calls.push(input)
			return [Source.Constants_Internal]
		},
	})
	assert.equal(query.limit, 0)
	assert.deepEqual([...query.sources ?? []], [Source.Constants_Internal])
	assert.equal(JSON.stringify(calls), '[{}]')
	assert.deepEqual(Object.keys(query.fields ?? {}), ['documentTitle', 'number'])
})
