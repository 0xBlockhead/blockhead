import assert from 'node:assert/strict'
import test from 'node:test'

import { app, EntityType } from '../../APP.ts'
import { compileApp } from './generate.ts'
import { observationTimeAccountabilityKey } from './accountability.ts'
import { EntityFieldCardinality, EntityFieldType, type _FieldReference } from './model.ts'
import { renderGeneratedFile } from './render.ts'


const baselineCompiledApp = compileApp(app)


const assertRecursivelyFrozen = (value: object) => {
	assert.equal(Object.isFrozen(value), true)
	for (const nestedValue of Object.values(value))
		if (nestedValue != null && typeof nestedValue === 'object')
			assertRecursivelyFrozen(nestedValue)
}

test('exports complete immutable generated-file, source-claim, and source-accountability IR', () => {
	const compiledApp = baselineCompiledApp

	assert.deepEqual(Object.keys(compiledApp), [
		'generatedFiles',
		'defaultPluralViewEntityTypes',
		'presentationManifest',
		'sourceClaims',
		'sourceAccountability',
		'observationTimeAccountability',
		'observationTimeWriterManifest',
	])
	assert.equal(
		compiledApp.sourceAccountability.claims.length,
		compiledApp.sourceClaims.length
	)
	assertRecursivelyFrozen(compiledApp)
	assert.ok(compiledApp.generatedFiles.length > 0)
	assert.ok(compiledApp.defaultPluralViewEntityTypes.length > 0)
	assert.deepEqual(
		compiledApp.defaultPluralViewEntityTypes,
		[...new Set(compiledApp.defaultPluralViewEntityTypes)].toSorted((left, right) => (
			left.localeCompare(right, 'en', { sensitivity: 'base', numeric: true })
		))
	)
	assert.equal(compiledApp.defaultPluralViewEntityTypes.every((entityType) => (
		app.schema.entities.some((entity) => entity.entityType === entityType)
	)), true)
	const fieldKey = (field: _FieldReference) => typeof field === 'string' ? field : field.join('.')
	const facetListIds = (entity: (typeof app.schema.entities)[number]) => {
		const entries = (entity.facets ?? []).map((facet) => ({
			facet,
			projectionPath: [facet.name],
		}))
		const ids: string[] = []
		for (const entry of entries) {
			ids.push(...(entry.facet.singularView?.lists ?? []).map((placement) => (
				`${entity.entityType}.${entry.projectionPath.join('.')}.${fieldKey(placement.field)}`
			)))
			entries.push(...(entry.facet.facets ?? []).map((facet) => ({
				facet,
				projectionPath: [...entry.projectionPath, facet.name],
			})))
		}
		return ids
	}
	const expectedPresentationManifestIds = app.schema.entities.flatMap((entity) => [
		...(entity.views.singular?.lists ?? []).map((placement) => (
			`${entity.entityType}.${fieldKey(placement.field)}`
		)),
		...facetListIds(entity),
	]).toSorted()
	assert.deepEqual(
		compiledApp.presentationManifest.map(({ id }) => id).toSorted(),
		expectedPresentationManifestIds
	)
	assert.equal(
		new Set(compiledApp.presentationManifest.map(({ id }) => id)).size,
		compiledApp.presentationManifest.length
	)
	assert.deepEqual(
		(() => {
			const entry = compiledApp.presentationManifest.find((candidate) => candidate.id === 'ArweaveResource.$$manifestPaths')
			return entry == null ? undefined : {
				...entry,
				owner: { ...entry.owner },
				placement: { ...entry.placement },
			}
		})(),
		{
			id: 'ArweaveResource.$$manifestPaths',
			owner: {
				entityType: EntityType.ArweaveResource,
				field: '$$manifestPaths',
				fieldReference: '$$manifestPaths',
				fieldType: EntityFieldType.EntitiesReference,
				cardinality: EntityFieldCardinality.Many,
				targetEntityType: EntityType.ArweaveManifestPath,
			},
			placement: {
				kind: 'singular-list',
				component: 'ArweaveManifestPathsView',
				label: 'Manifest paths',
				emptyText: 'No manifest paths.',
			},
		}
	)
	assert.ok(compiledApp.sourceClaims.length > 0)
	assert.ok(compiledApp.sourceAccountability.claims.length > 0)
	assert.ok(compiledApp.sourceAccountability.bindingCoverage.length > 0)
	assert.ok(compiledApp.sourceAccountability.mappedSelectors.length > 0)
	assert.equal(
		new Set(compiledApp.observationTimeAccountability.map(observationTimeAccountabilityKey)).size,
		compiledApp.observationTimeAccountability.length
	)
	assert.equal(
		new Set(compiledApp.observationTimeWriterManifest.map((writer) => JSON.stringify(writer))).size,
		compiledApp.observationTimeWriterManifest.length
	)
	assert.equal(
		new Set(compiledApp.generatedFiles.map((generatedFile) => generatedFile.path)).size,
		compiledApp.generatedFiles.length
	)
	assert.equal(
		new Set(compiledApp.sourceClaims.map((claim) => JSON.stringify(claim))).size,
		compiledApp.sourceClaims.length
	)
	assert.deepEqual(
		compiledApp.sourceClaims,
		[...compiledApp.sourceClaims].toSorted((left, right) => (
			JSON.stringify(left).localeCompare(JSON.stringify(right), 'en')
		))
	)
	for (const claim of compiledApp.sourceClaims) {
		assert.deepEqual(
			Object.keys(claim).toSorted(),
			[
				...(claim.conditions == null ? [] : ['conditions']),
				'entityType',
				'facetPath',
				...(claim.fieldName == null ? [] : ['fieldName']),
				...(claim.publicRoute == null ? [] : ['publicRoute']),
				...(claim.selectorName == null ? [] : ['selectorName']),
				'source',
			].toSorted()
		)
		assert.equal(claim.source.length > 0, true)
		assert.equal(claim.entityType.length > 0, true)
		assert.notEqual(claim.fieldName == null, claim.selectorName == null)
		if (claim.selectorName != null)
			assert.equal(claim.publicRoute?.startsWith('/'), true)
	}
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
	const sourcesMarkdown = compiledApp.generatedFiles.find((generatedFile) => generatedFile.path === 'SOURCES.md')
	assert.ok(sourcesMarkdown)
	assert.equal(sourcesMarkdown.kind, 'text')
	assert.equal(sourcesMarkdown.body.includes('# Blockhead Sources'), true)
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
	assert.throws(() => compiledApp.presentationManifest.push(compiledApp.presentationManifest[0]!))
	assert.throws(() => {
		Object.defineProperty(compiledApp.presentationManifest[0]!.placement, 'component', { value: 'mutated' })
	})
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

test('rejects duplicate semantic manifest placement', () => {
	const duplicatePlacementApp = structuredClone(app)
	const duplicateEntity = duplicatePlacementApp.schema.entities.find((entity) => entity.entityType === EntityType.ArweaveResource)
	assert.ok(duplicateEntity?.views.singular?.lists)
	const manifestPlacement = duplicateEntity.views.singular.lists.find((list) => list.field === '$$manifestPaths')
	assert.ok(manifestPlacement)
	duplicateEntity.views.singular.lists.push(structuredClone(manifestPlacement))
	assert.throws(
		() => compileApp(duplicatePlacementApp),
		/Presentation manifest placement ArweaveResource\.\$\$manifestPaths is duplicated/
	)
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

test('requires exactly one explicit route mapping for every selector', () => {
	const missingMappingApp = structuredClone(app)
	Reflect.deleteProperty(missingMappingApp.routes.children['~'].children.explore.selectors[EntityType._Global], 'Scope')

	assert.throws(
		() => compileApp(missingMappingApp),
		/_Global\.Scope must have exactly one route mapping; found 0/
	)
})

test('rejects duplicate explicit route mappings for one selector', () => {
	const duplicateMappingApp = structuredClone(app)
	Object.defineProperty(duplicateMappingApp.routes.children, '(duplicate-global)', {
		enumerable: true,
		value: {
			children: {
				'duplicate-explore': {
					selectors: {
						[EntityType._Global]: {
							Scope: structuredClone(duplicateMappingApp.routes.children['~'].children.explore.selectors[EntityType._Global].Scope),
						},
					},
				},
			},
		},
	})

	assert.throws(
		() => compileApp(duplicateMappingApp),
		/Duplicate route selector mapping _Global\.Scope/
	)
})

test('rejects canonical alias drift while retaining alias ingress as a visible route', () => {
	const aliasDriftApp = structuredClone(app)
	const didMapping = aliasDriftApp.routes.children['(social)']?.children?.['(atproto)']?.children?.atproto?.children?.actor?.children?.['[did]']?.selectors?.[EntityType.AtprotoActor]?.Did
	const handleMapping = aliasDriftApp.routes.children['(social)']?.children?.['(atproto)']?.children?.atproto?.children?.actor?.children?.handle?.children?.['[handle]']?.selectors?.[EntityType.AtprotoActor]?.Handle

	assert.ok(didMapping)
	assert.ok(handleMapping)
	didMapping.href = {
		entityHref: false,
	}
	assert.throws(
		() => compileApp(aliasDriftApp),
		/AtprotoActor\.Did suppresses its entity href without a canonical entity route/
	)

	const wrongCanonicalSelectorApp = structuredClone(app)
	const wrongDidMapping = wrongCanonicalSelectorApp.routes.children['(social)']?.children?.['(atproto)']?.children?.atproto?.children?.actor?.children?.['[did]']?.selectors?.[EntityType.AtprotoActor]?.Did
	const wrongHandleMapping = wrongCanonicalSelectorApp.routes.children['(social)']?.children?.['(atproto)']?.children?.atproto?.children?.actor?.children?.handle?.children?.['[handle]']?.selectors?.[EntityType.AtprotoActor]?.Handle

	assert.ok(wrongDidMapping)
	assert.ok(wrongHandleMapping)
	wrongDidMapping.href = {
		entityHref: false,
		canonicalize: true,
	}
	Reflect.deleteProperty(wrongHandleMapping, 'href')
	assert.throws(
		() => compileApp(wrongCanonicalSelectorApp),
		/AtprotoActor\.Did canonical alias targets non-canonical selector AtprotoActor\.Handle/
	)

	const generatedAliasPage = baselineCompiledApp.generatedFiles.find(({ path }) => (
		path.endsWith('/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]/+page.svelte')
	))
	assert.ok(generatedAliasPage)
	assert.match(renderGeneratedFile(generatedAliasPage), /globalThis\.location\.replace\(canonicalEntityHref\)/)
})

test('classifies every source claim and mapped selector against authority', () => {
	const { sourceAccountability } = baselineCompiledApp

	for (const claim of sourceAccountability.claims) {
		const keys = Object.keys(claim).toSorted()
		assert.ok(
			keys.includes('fieldName') && !keys.includes('selectorName')
			|| keys.includes('selectorName') && !keys.includes('fieldName')
			|| keys.includes('fieldName') && keys.includes('selectorName'),
			`unexpected claim shape: ${keys.join(',')}`
		)
		assert.ok(keys.includes('source'))
		assert.ok(keys.includes('entityType'))
		assert.ok(keys.includes('facetPath'))
		assert.ok(keys.includes('demand'))
		assert.ok(keys.includes('access'))
		assert.ok(keys.includes('deliveries'))
		assert.ok(keys.includes('executability'))
		if (keys.includes('conditions')) {
			assert.ok(claim.conditions?.length)
			for (const condition of claim.conditions ?? []) {
				assert.ok(condition.field != null || condition.prop != null)
				assert.ok(Object.hasOwn(condition, 'equals'))
			}
		}
		assert.ok(['PublicRoute', 'FieldDefault'].includes(claim.demand))
		assert.ok(['Public', 'LocalRuntime', 'ServerRuntime'].includes(claim.access))
		assert.ok(['ResolverDeclared', 'ResolverMissing'].includes(claim.executability))
	}

	for (const selector of sourceAccountability.mappedSelectors) {
		assert.deepEqual(
			Object.keys(selector).toSorted(),
			[
				'accountability',
				'authoredPage',
				'entityType',
				'route',
				'selectorName',
				'sources',
				'sourcesWithoutResolver',
			].toSorted()
		)
		assert.ok([
			'PublicRouteDemand',
			'PublicRouteResolverMissing',
			'LocalRuntimeDemand',
			'LocalRuntimeResolverMissing',
			'NonExecutableDemand',
			'NonExecutableResolverMissing',
			'ResolverOnlyCapability',
			'FieldSourcedIdentity',
			'ReferenceMaterializedIdentity',
			'IntentionallyNonExecutable',
		].includes(selector.accountability))
	}

	const publicColdReadGaps = sourceAccountability.claims.filter((claim) => (
		claim.demand === 'PublicRoute'
		&& claim.access === 'Public'
		&& claim.executability === 'ResolverMissing'
	))
	assert.equal(publicColdReadGaps.length, 0)
})

test('preserves every conditioned source-selection branch as distinct accountability evidence', () => {
	const conditionedClaims = baselineCompiledApp.sourceClaims.filter(({ conditions }) => conditions != null)
	assert.ok(conditionedClaims.length > 0)
	assert.equal(
		new Set(conditionedClaims.map((claim) => JSON.stringify(claim.conditions))).size > 1,
		true
	)
	assert.equal(
		conditionedClaims.every(({ conditions }) => conditions?.every((condition) => (
			(condition.field != null || condition.prop != null)
			&& Object.hasOwn(condition, 'equals')
		))),
		true
	)
})
