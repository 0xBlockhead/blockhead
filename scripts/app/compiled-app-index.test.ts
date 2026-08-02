import assert from 'node:assert/strict'
import test from 'node:test'

import { app, EntityType } from '../../APP.ts'
import { compileApp, renderSourcesMarkdown } from './generate.ts'
import { renderGeneratedFile } from './render.ts'


const baselineCompiledApp = compileApp(app)


const assertRecursivelyFrozen = (value: object) => {
	assert.equal(Object.isFrozen(value), true)
	for (const nestedValue of Object.values(value))
		if (nestedValue != null && typeof nestedValue === 'object')
			assertRecursivelyFrozen(nestedValue)
}

test('exports only complete immutable generated-file IR', () => {
	const compiledApp = baselineCompiledApp

	assert.deepEqual(Object.keys(compiledApp), ['generatedFiles'])
	assertRecursivelyFrozen(compiledApp)
	assert.ok(compiledApp.generatedFiles.length > 0)
	assert.equal(
		new Set(compiledApp.generatedFiles.map((generatedFile) => generatedFile.path)).size,
		compiledApp.generatedFiles.length
	)
	for (const generatedFile of compiledApp.generatedFiles) {
		assert.deepEqual(
			Object.keys(generatedFile).toSorted(),
			generatedFile.kind === 'text' ? [
				'body',
				'kind',
				'path',
			] : [
				'ast',
				'kind',
				'path',
			]
		)
		assert.equal(renderGeneratedFile(generatedFile).endsWith('\n'), true)
		if (generatedFile.kind === 'svelte') {
			const importModules = (generatedFile.ast.script ?? []).flatMap((line) => (
				line.match(/ from '([^']+)'$/)?.[1] ?? []
			))
			assert.equal(
				new Set(importModules).size,
				importModules.length,
				`${generatedFile.path} repeats a script import module`
			)
		}
	}

	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path === 'SOURCES.md' && generatedFile.kind === 'text'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path === 'src/schema/EntityType.ts' && generatedFile.kind === 'ts'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte' && generatedFile.kind === 'svelte'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path.endsWith('/+layout.svelte') && generatedFile.kind === 'svelte'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path.endsWith('/+page.svelte') && generatedFile.kind === 'svelte'))
	assert.ok(compiledApp.generatedFiles.some((generatedFile) => generatedFile.path.endsWith('/+page.ts') && generatedFile.kind === 'ts'))
	assert.ok(renderSourcesMarkdown(compiledApp).includes('# Blockhead Sources'))
})

test('keeps same-named facet fields source-precise in generated IR', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const networkView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	assert.ok(network)
	assert.ok(networkView)
	assert.equal(networkView.kind, 'svelte')
	const source = renderGeneratedFile(networkView)
	const cardanoTransactions = source.match(/\{#snippet SectionCardanoChainTransactions[\s\S]*?\{\/snippet\}/)?.[0]
	const evmTransactions = source.match(/\{#snippet SectionEvmExecutionTransactions[\s\S]*?\{\/snippet\}/)?.[0]
	const sectionSources = (
		facetName: string,
		sectionId: string
	) => network.facets
		.find((facet) => facet.name === facetName)
		?.singularView?.carousels
		?.flatMap((carousel) => carousel.sections)
		.find((section) => section.id === sectionId)
		?.selection?.sources ?? []
	const generatedSources = (section: string) => [...new Set([
		...(
			source.match(new RegExp(
				`const ${
					section.match(/sources: ([A-Za-z0-9_]+Sources),/)?.[1]
				} = \\$derived\\([\\s\\S]*?networkApplicableSources\\(\\[([\\s\\S]*?)\\], pendingEntity\\)`
			))?.[1] ?? ''
		).matchAll(/Source\.([A-Za-z0-9_]+)/g),
	].map((match) => match[1]))]

	assert.ok(cardanoTransactions)
	assert.deepEqual(
		generatedSources(cardanoTransactions),
		sectionSources('Cardano', 'cardano-chain-transactions')
	)
	assert.ok(evmTransactions)
	assert.deepEqual(
		generatedSources(evmTransactions),
		sectionSources('Evm', 'evm-execution-transactions')
	)
})

test('keeps every APP-authored Cardano carousel and section in generated IR', () => {
	const network = app.schema.entities.find((entity) => entity.entityType === EntityType.Network)
	const networkView = baselineCompiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'src/views/NetworkView.svelte')
	const cardanoCarousels = network?.facets
		.find((facet) => facet.name === 'Cardano')
		?.singularView?.carousels ?? []
	assert.ok(network)
	assert.ok(networkView)
	assert.equal(networkView.kind, 'svelte')
	const source = renderGeneratedFile(networkView)

	assert.ok(cardanoCarousels.length > 0)
	assert.equal(
		[...source.matchAll(/id=\{viewDomId \+ '-carousel-cardano-/g)].length,
		cardanoCarousels.length
	)
	for (const carousel of cardanoCarousels) {
		const generatedCarousel = source.match(new RegExp(
			`\\{@const ${carousel.id.split('-').map((part, index) => (
				index === 0 ?
					part
				:
					`${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`
			)).join('')}Sections = \\[[\\s\\S]*?<\\/CollapsibleTabs>`
		))?.[0]
		assert.ok(generatedCarousel, carousel.id)
		for (const section of carousel.sections) {
			assert.match(generatedCarousel, new RegExp(`id: '${section.id}'`))
			assert.match(
				generatedCarousel,
				new RegExp(`\\{#snippet Section${section.id.split('-').map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join('')}`)
			)
		}
	}
})

test('keeps account controls hand-owned and account aggregation declarative', () => {
	const accountsRoute = app.routes.children['~'].children.accounts

	assert.deepEqual(accountsRoute.collections?.[0]?.field, [
		EntityType._Global,
		'$$blockheadAccounts',
	])
	for (const route of [
		accountsRoute.children.balances,
		accountsRoute.children.transactions,
	]) {
		assert.ok((route.collections?.length ?? 0) > 0)
		for (const collection of route.collections ?? []) {
			assert.deepEqual(collection.field.slice(0, 3), [
				EntityType._Global,
				'$$blockheadAccounts',
				'$account',
			])
			assert.ok(collection.field.length > 3)
			assert.equal(collection.page?.view, undefined)
		}
	}
})

test('rejects mutation at every exported IR depth', () => {
	const compiledApp = baselineCompiledApp
	const firstFile = compiledApp.generatedFiles[0]
	assert.ok(firstFile)

	assert.throws(() => compiledApp.generatedFiles.push(firstFile))
	assert.throws(() => {
		compiledApp.generatedFiles[0].path = 'mutated'
	})
	if (firstFile.kind === 'text')
		assert.throws(() => firstFile.body.push('mutated'))
	else if (firstFile.kind === 'ts')
		assert.throws(() => firstFile.ast.body.push('mutated'))
	else
		assert.throws(() => (firstFile.ast.markup ?? firstFile.ast.script ?? []).push('mutated'))
})

test('rejects ambiguous same-entity detail components without collapsing selector variants', () => {
	const ambiguousApp = structuredClone(app)
	const networkRoute = ambiguousApp.routes.children['(explore)']?.children?.['(networks)']?.children?.network?.children?.['[network]']
	assert.ok(networkRoute)
	Object.defineProperty(networkRoute.selectors?.[EntityType.Network]?.Slug, 'page', {
		value: {
			view: {
				component: 'ConflictingNetworkView',
			},
		},
	})

	assert.throws(
		() => compileApp(ambiguousApp),
		/detail layout assigns ambiguous components to Network/
	)
})

test('requires one explicit route outcome for every selector', () => {
	const missingOutcomeApp = structuredClone(app)
	Reflect.deleteProperty(missingOutcomeApp.routes.outcomes[EntityType._Global], 'Scope')

	assert.throws(
		() => compileApp(missingOutcomeApp),
		/_Global\.Scope is missing an explicit route outcome/
	)
})

test('rejects competing visible and non-visible selector outcomes', () => {
	const competingOutcomeApp = structuredClone(app)
	Object.defineProperty(competingOutcomeApp.routes.outcomes, EntityType.Network, {
		enumerable: true,
		value: {
			Caip2: {
				kind: 'Research',
				decision: 'Negative control',
				evidence: 'scripts/app/compiled-app-index.test.ts',
			},
		},
	})

	assert.throws(
		() => compileApp(competingOutcomeApp),
		/Network\.Caip2 has both a visible route mapping and Research outcome/
	)
})

test('rejects selector outcome alias cycles', () => {
	const cyclicOutcomeApp = structuredClone(app)
	Object.defineProperty(cyclicOutcomeApp.routes.outcomes[EntityType._Global], 'Scope', {
		enumerable: true,
		value: {
			kind: 'Alias',
			target: {
				entityType: EntityType._GlobalAgentNetwork,
				selectorName: 'NetworkId',
			},
		},
	})
	Object.defineProperty(cyclicOutcomeApp.routes.outcomes[EntityType._GlobalAgentNetwork], 'NetworkId', {
		enumerable: true,
		value: {
			kind: 'Alias',
			target: {
				entityType: EntityType._Global,
				selectorName: 'Scope',
			},
		},
	})

	assert.throws(
		() => compileApp(cyclicOutcomeApp),
		/Alias outcome contains a cycle/
	)
})
