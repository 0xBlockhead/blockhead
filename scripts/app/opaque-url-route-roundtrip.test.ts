import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'
import { runInNewContext } from 'node:vm'
import { parse } from 'svelte/compiler'
import ts from 'typescript'
import { type } from 'arktype'

import { app, EntityType } from '../../APP.ts'
import { parseRouteEntitySelector } from '../../src/schema/$schema.ts'
import { schema, schemaMeta } from '../../src/schema/index.ts'
import { parentEntitySelectorForResolverValuePart } from '../../src/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'
import { e2eRouteFixtureMetadataByNodeId, matchE2eRouteParam } from '../../tests/e2e/_generatedRouteFixtureMetadata.ts'
import { e2eRouteProbeAtomValueById } from '../../tests/e2e/_routeParamFixtures.ts'
import { routeProbeCasesForMapping, routeProbeCaseParams, publicRouteIdFromRouteId } from '../../tests/e2e/_routeDiscovery.ts'

const kitRoot = path.dirname(createRequire(import.meta.url).resolve('@sveltejs/kit/package.json'))
const { resolve_route, parse_route_id, find_route } = await import(pathToFileURL(path.join(kitRoot, 'src/utils/routing.js')).href)
const { decode_pathname } = await import(pathToFileURL(path.join(kitRoot, 'src/utils/url.js')).href)
const metadata = Object.entries(e2eRouteFixtureMetadataByNodeId)
const atoms = new Map(Object.entries(e2eRouteProbeAtomValueById))

const cases: { nodeId: string; entityType: EntityType; selectorName: string; param: string; field: string }[] = []
const visitRoutes = (children: typeof app.routes.children, prefix = '') => {
	for (const [segment, node] of Object.entries(children)) {
		const nodeId = `${prefix}/${segment}`
		for (const [entityName, selectors] of Object.entries(node.selectors ?? {})) {
			const entity = app.schema.entities.find((entity) => entity.entityType === entityName)
			const entityType = Object.values(EntityType).find((value) => value === entityName)
			assert.ok(entity && entityType)
			for (const [selectorName, mapping] of Object.entries(selectors))
				for (const [param, fields] of Object.entries(mapping.params ?? {}))
					if (fields.length === 1 && entity.fields.some((field) => field.name === fields[0] && field.valueType === 'urlString'))
						cases.push({ nodeId, entityType, selectorName, param, field: fields[0] })
		}
		visitRoutes(node.children ?? {}, nodeId)
	}
}
visitRoutes(app.routes.children)
assert.equal(cases.length, 24, 'Direct urlString mapping denominator changed')

const expressions = (source: string, predicate: (node: ts.Node) => boolean) => {
	const ast = ts.createSourceFile('expression.ts', source, ts.ScriptTarget.Latest, true)
	const matches: ts.Node[] = []
	const visit = (node: ts.Node) => {
		if (predicate(node)) matches.push(node)
		node.forEachChild(visit)
	}
	visit(ast)
	return matches.map((node) => node.getText(ast))
}

const evaluate = (expression: string, bindings: object) => runInNewContext(
	ts.transpileModule(`(${expression})`, { compilerOptions: { target: ts.ScriptTarget.ESNext } }).outputText,
	bindings
)

for (const entry of cases)
	test(`${entry.entityType}.${entry.selectorName}: opaque URL survives installed routing and generated decoding`, async (context) => {
		const route = metadata.find(([nodeId]) => nodeId === entry.nodeId)?.[1]
		assert.ok(route, entry.nodeId)
		const mapping = route.mappings.find((mapping) => mapping.id === `${entry.entityType}.${entry.selectorName}`)
		assert.ok(mapping)
		const fixture = routeProbeCasesForMapping(mapping)[0]
		assert.ok(fixture)
		const params = Object.fromEntries(Object.entries(routeProbeCaseParams(fixture)).map(([name, atom]) => {
			const value = atoms.get(atom)
			assert.ok(value != null, `Missing canonical companion ${atom}`)
			return [name, value]
		}))
		const definition = schemaMeta.entityDefinitionByType[entry.entityType]
		const selectorDefinition = definition.selectors.find((selector) => selector.name === entry.selectorName)
		assert.ok(selectorDefinition)
		const companion = selectorDefinition.fields.every((field) => !field.startsWith('$')) ?
			Object.fromEntries(selectorDefinition.fields.map((field) => {
				assert.ok(params[field] != null, `Missing canonical selector field ${field}`)
				return [field, params[field]]
			}))
		: entry.entityType === EntityType.McpResource ?
			{ $server: { serverKey: params.serverKey }, uri: params.uri }
		: entry.entityType === EntityType.Eip8004AgentRegistrationFile ?
			{
				$registration: {
					namespace: params.namespace,
					chainId: Number(params.chainId),
					identityRegistry: params.identityRegistry,
					agentId: params.agentId,
				},
				fileUrl: params.fileUrl,
			}
		:
			parentEntitySelectorForResolverValuePart(entry.entityType, entry.selectorName)
		const entity = app.schema.entities.find((entity) => entity.entityType === entry.entityType)
		assert.ok(entity)
		const viewPath = `src/views/${entry.entityType}View.svelte`
		const source = readFileSync(viewPath, 'utf8')
		const component = parse(source, { modern: true }).fragment.nodes.find((node) => node.type === 'Component' && node.name === 'EntityView')
		assert.ok(component?.type === 'Component')
		const href = component.attributes.find((attribute) => attribute.type === 'Attribute' && attribute.name === 'href')
		assert.ok(href?.type === 'Attribute' && href.value !== true)
		const tag = Array.isArray(href.value) ? href.value[0] : href.value
		assert.ok(tag?.type === 'ExpressionTag')
		const hrefSource = source.slice(tag.expression.start, tag.expression.end)
		const encoders = expressions(hrefSource, (node) => (
			ts.isPropertyAssignment(node) && node.name.getText() === entry.param
			&& ts.isObjectLiteralExpression(node.parent) && ts.isCallExpression(node.parent.parent)
			&& node.parent.parent.expression.getText() === 'resolve'
			&& ts.isStringLiteral(node.parent.parent.arguments[0])
			&& publicRouteIdFromRouteId(node.parent.parent.arguments[0].text) === publicRouteIdFromRouteId(route.routeId)
		))
		assert.equal(encoders.length, 1, `Missing unique href encoder in ${viewPath}`)
		const modulePath = [`src/routes${route.routeId}/+layout.ts`, `src/routes${route.routeId}/+page.ts`, `src/routes${route.routeId}/+page.svelte`].find(existsSync)
		assert.ok(modulePath, `Missing selector module for ${route.routeId}`)
		const moduleSource = readFileSync(modulePath, 'utf8')
		const instance = modulePath.endsWith('.svelte') ? parse(moduleSource, { modern: true }).instance : undefined
		const decoderSource = instance == null ? moduleSource : moduleSource.slice(instance.content.start, instance.content.end)
		const decoders = expressions(decoderSource, (node) => (
			ts.isPropertyAssignment(node) && node.name.getText() === entry.field
			&& expressions(node.initializer.getText(), (part) => (
				ts.isPropertyAccessExpression(part) && ts.isIdentifier(part.expression)
				&& part.expression.text === 'params' && part.name.text === entry.param
			)).length > 0
		))
		assert.equal(decoders.length, 1, `Missing unique decoder in ${modulePath}`)
		const parsedRoute = parse_route_id(route.routeId)
		const matchers = Object.fromEntries(parsedRoute.params.filter((param: { matcher?: string }) => param.matcher).map((param: { matcher: string }) => (
			[param.matcher, (value: string) => matchE2eRouteParam(param.matcher, value)]
		)))
		for (const url of ['https://example.com/plain', 'https://example.com/a-b_q~c?q=a&b=c#fragment', 'https://example.com/雪?q=a&b=c'])
			await context.test(url, () => {
				const selector = { ...companion, [entry.field]: url }
				assert.ok(!(parseRouteEntitySelector(schema, definition, selector, entry.selectorName) instanceof type.errors), 'Companion selector must be valid before routing')
				const encoded = evaluate(`({${encoders[0]}})`, { selection: { entitySelector: selector } })
				const encodedParams = Object.fromEntries(Object.entries(params).map(([name, value]) => {
					const encoding = 'parameterEncodingByName' in route ? Object.entries(route.parameterEncodingByName).find(([param]) => param === name)?.[1] : undefined
					return [name, encoding === 'Opaque' ? encodeURIComponent(value) : value]
				}))
				const pathname = resolve_route(route.routeId, { ...encodedParams, ...encoded })
				const found = find_route(decode_pathname(new URL(pathname, 'https://app.example').pathname), [parsedRoute], matchers)
				assert.ok(found, 'Installed route matcher must accept the encoded URL')
				const decoded = evaluate(`({${decoders[0]}})`, { params: found.params })
				const actual = parseRouteEntitySelector(schema, definition, { ...companion, ...decoded }, entry.selectorName)
				assert.deepEqual(actual, selector, `${entry.entityType}.${entry.selectorName}: ${url}`)
			})
	})

test('installed pathname decoding rejects malformed UTF-8 escapes', () => {
	assert.throws(() => decode_pathname('/url/%E0%A4%A'), URIError)
})
