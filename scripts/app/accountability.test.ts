import assert from 'node:assert/strict'
import test from 'node:test'

import { app } from '../../APP.ts'
import {
	classifyMappedSelector,
	classifySourceClaim,
	countBy,
	indexAccountabilityAuthority,
	MappedSelectorAccountability,
	publicColdReadGaps,
	SourceAccess,
	SourceClaimDemand,
	SourceClaimExecutability,
} from './accountability.ts'
import { compileApp } from './generate.ts'


const compiledSourceAccountability = compileApp(app).sourceAccountability

const fixtureAuthority = indexAccountabilityAuthority({
	sourceBindings: [
		{
			source: 'ProxiedRest',
			delivery: 'HttpProxy',
		},
		{
			source: 'LocalProcess',
			delivery: 'LocalOnly',
		},
		{
			source: 'NodeGrpc',
			delivery: 'ServerOnly',
		},
		{
			source: 'Retired',
			delivery: 'Unsupported',
		},
		// One source, two bindings: the most capable declared delivery decides.
		{
			source: 'DesktopOrProxied',
			delivery: 'LocalOnly',
		},
		{
			source: 'DesktopOrProxied',
			delivery: 'BrowserDirect',
		},
	],
	resolverModules: [
		{ source: 'ProxiedRest' },
		{ source: 'LocalProcess' },
		{ source: 'DesktopOrProxied' },
	],
	fieldSourcedEntityTypes: new Set(['FieldSourcedEntity']),
	referenceMaterializedEntityTypes: new Set(['ChildEntity']),
})

const fixtureClaim = {
	source: 'ProxiedRest',
	entityType: 'FixtureEntity',
	selectorName: 'Slug',
	facetPath: [],
	publicRoute: '/fixture/[slug]',
}

const fixtureMapping = {
	entityType: 'FixtureEntity',
	selectorName: 'Slug',
	route: '/fixture/[slug]',
	authoredPage: true,
	sources: ['ProxiedRest'],
}

test('classifies a source claim by declared route demand, delivery, and resolver authority', () => {
	assert.deepEqual(
		[
			fixtureClaim,
			{
				...fixtureClaim,
				source: 'LocalProcess',
			},
			{
				...fixtureClaim,
				source: 'NodeGrpc',
			},
			{
				...fixtureClaim,
				source: 'Retired',
			},
			{
				...fixtureClaim,
				source: 'DesktopOrProxied',
			},
			{
				...fixtureClaim,
				source: 'Undeclared',
			},
			{
				source: 'ProxiedRest',
				entityType: 'FixtureEntity',
				facetPath: ['Evm'],
				fieldName: 'symbol',
			},
		].map((claim) => {
			const { access, demand, deliveries, executability } = classifySourceClaim(claim, fixtureAuthority)

			return [demand, access, deliveries.join('+'), executability].join('/')
		}),
		[
			'PublicRoute/Public/HttpProxy/ResolverDeclared',
			'PublicRoute/LocalRuntime/LocalOnly/ResolverDeclared',
			'PublicRoute/ServerRuntime/ServerOnly/ResolverMissing',
			'PublicRoute/NonExecutable/Unsupported/ResolverMissing',
			'PublicRoute/Public/BrowserDirect+LocalOnly/ResolverDeclared',
			'PublicRoute/Undeclared//ResolverMissing',
			'FieldDefault/Public/HttpProxy/ResolverDeclared',
		]
	)
})

test('keys source claims without aliasing route punctuation or omitted coordinates', () => {
	const routeClaim = {
		source: 'ProxiedRest',
		entityType: 'FixtureEntity',
		selectorName: 'Slug',
		facetPath: [],
		publicRoute: '/network/[namespace]:[reference]',
	}
	const fieldClaim = {
		source: 'ProxiedRest',
		entityType: 'FixtureEntity',
		facetPath: [],
		fieldName: 'Slug:missing',
	}

	assert.notEqual(sourceClaimAccountabilityKey(routeClaim), sourceClaimAccountabilityKey(fieldClaim))
	assert.notEqual(sourceClaimAccountabilityKey({ ...routeClaim, selectorName: undefined }), sourceClaimAccountabilityKey(routeClaim))
})

test('reports only publicly deliverable route claims without a resolver as cold-read gaps', () => {
	assert.deepEqual(
		publicColdReadGaps([
			fixtureClaim,
			{
				...fixtureClaim,
				source: 'UnresolvedRest',
			},
			// A local or server host, not a cold public read.
			{
				...fixtureClaim,
				source: 'NodeGrpc',
			},
			// Field demand is read through its owning route, not on its own.
			{
				source: 'UnresolvedRest',
				entityType: 'FixtureEntity',
				facetPath: [],
				fieldName: 'symbol',
			},
		].map((claim) => classifySourceClaim(claim, {
			...fixtureAuthority,
			accessBySource: new Map([
				...fixtureAuthority.accessBySource,
				['UnresolvedRest', SourceAccess.Public],
			]),
		}))).map((row) => row.source),
		['UnresolvedRest']
	)
})

test('classifies a mapped selector by route sources, authored page, and inherited materialization', () => {
	assert.deepEqual(
		[
			fixtureMapping,
			{
				...fixtureMapping,
				sources: ['LocalProcess', 'NodeGrpc'],
			},
			{
				...fixtureMapping,
				sources: ['Retired'],
			},
			// Deliberately page-less: capability a resolver can serve, not a route.
			{
				...fixtureMapping,
				authoredPage: false,
			},
			{
				...fixtureMapping,
				entityType: 'FieldSourcedEntity',
				sources: [],
			},
			{
				...fixtureMapping,
				entityType: 'ChildEntity',
				sources: [],
			},
			{
				...fixtureMapping,
				entityType: 'OrphanEntity',
				sources: [],
			},
		].map((mapping) => classifyMappedSelector(mapping, fixtureAuthority).accountability),
		[
			MappedSelectorAccountability.PublicRouteDemand,
			MappedSelectorAccountability.LocalRuntimeResolverMissing,
			MappedSelectorAccountability.NonExecutableResolverMissing,
			MappedSelectorAccountability.ResolverOnlyCapability,
			MappedSelectorAccountability.FieldSourcedIdentity,
			MappedSelectorAccountability.ReferenceMaterializedIdentity,
			MappedSelectorAccountability.SchemaIdentityOnly,
		]
	)
	assert.deepEqual(
		classifyMappedSelector({
			...fixtureMapping,
			sources: ['ProxiedRest', 'UnresolvedRest'],
		}, fixtureAuthority).sourcesWithoutResolver,
		['UnresolvedRest']
	)
})

test('accounts for every compiled claim and mapped selector of the current app', () => {
	const { claims, mappedSelectors } = compiledSourceAccountability

	assert.ok(claims.length > 0)
	assert.ok(mappedSelectors.length > 0)
	assert.equal(claims.length, compiledSourceAccountability.claims.length)
	assert.deepEqual(
		claims.filter((row) => row.access === SourceAccess.Undeclared),
		[]
	)
	assert.equal(
		countBy(claims, (row) => [row.demand, row.access, row.executability].join('/'))
			.reduce((total, [, count]) => total + count, 0),
		claims.length
	)
	assert.equal(
		countBy(mappedSelectors, (row) => row.accountability)
			.reduce((total, [, count]) => total + count, 0),
		mappedSelectors.length
	)
	assert.equal(
		mappedSelectors.filter((row) => (
			row.accountability === MappedSelectorAccountability.ResolverOnlyCapability
		)).every((row) => !row.authoredPage),
		true
	)
})

test('partitions the public cold-read denominator by unfinished provider slice', () => {
	const { claims } = compiledSourceAccountability
	const gaps = publicColdReadGaps(claims)

	assert.ok(gaps.length > 0)
	for (const row of gaps) {
		assert.equal(row.demand, SourceClaimDemand.PublicRoute)
		assert.equal(row.access, SourceAccess.Public)
		assert.equal(row.executability, SourceClaimExecutability.ResolverMissing)
		assert.equal(row.publicRoute?.startsWith('/'), true)
	}
	const nonPublicMissing = claims.filter((row) => (
		row.demand === SourceClaimDemand.PublicRoute
		&& row.executability === SourceClaimExecutability.ResolverMissing
		&& row.access !== SourceAccess.Public
	))
	assert.equal(
		gaps.length + nonPublicMissing.length,
		claims.filter((row) => (
			row.demand === SourceClaimDemand.PublicRoute
			&& row.executability === SourceClaimExecutability.ResolverMissing
		)).length
	)
})
