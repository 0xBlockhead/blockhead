import assert from 'node:assert/strict'
import test from 'node:test'

import { app } from '../../APP.ts'
import {
	classifyMappedSelector,
	classifySourceClaim,
	compileObservationTimeAccountability,
	compileSourceClaimBindingCoverage,
	countBy,
	dualBindingDeclarationGaps,
	indexAccountabilityAuthority,
	MappedSelectorAccountability,
	ObservationTimeProvenance,
	observationTimeAccountabilityKey,
	observationTimeWriterManifest,
	publicColdReadGaps,
	SourceAccess,
	SourceBindingTargetMatch,
	SourceClaimDemand,
	SourceClaimExecutability,
	sourceClaimAccountabilityKey,
	truthfulObservationTimeAccountability,
} from './accountability.ts'
import { compileApp } from './generate.ts'


const compiledApp = compileApp(app)
const compiledSourceAccountability = compiledApp.sourceAccountability

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

test('keeps target matches distinct from unverified applicability evidence', () => {
	const authority = indexAccountabilityAuthority({
		sourceBindings: [
			{
				source: 'NetworkRest',
				delivery: 'BrowserDirect',
				target: { kind: 'Caip2Network', key: 'bitcoin:mainnet' },
			},
			{
				source: 'NetworkRest',
				delivery: 'BrowserDirect',
				target: { kind: 'Caip2Network', key: 'bitcoin:testnet' },
			},
		],
		resolverModules: [{ source: 'NetworkRest' }],
		fieldSourcedEntityTypes: new Set(),
		referenceMaterializedEntityTypes: new Set(),
	})

	const unscoped = classifySourceClaim({
		source: 'NetworkRest',
		entityType: 'NetworkEntity',
		selectorName: 'Network',
		facetPath: [],
		publicRoute: '/network/[network]',
	}, authority)
	assert.equal(unscoped.bindingEvidence.length, 2)
	assert.deepEqual(unscoped.bindingEvidence.map(({ targetMatch, verification }) => [targetMatch, verification]), [
		[SourceBindingTargetMatch.Unknown, 'Unverified'],
		[SourceBindingTargetMatch.Unknown, 'Unverified'],
	])

	const mainnet = classifySourceClaim({
		source: 'NetworkRest',
		entityType: 'NetworkEntity',
		selectorName: 'Network',
		facetPath: [],
		publicRoute: '/network/[network]',
		target: { kind: 'Caip2Network', key: 'bitcoin:mainnet' },
	}, authority)
	assert.deepEqual(mainnet.bindingEvidence.map(({ targetMatch, verification }) => [targetMatch, verification]), [
		[SourceBindingTargetMatch.Matches, 'Unverified'],
		[SourceBindingTargetMatch.Differs, 'Unverified'],
	])
	assert.equal(mainnet.bindingEvidence.every(({ verification }) => verification === 'Unverified'), true)
	assert.equal(mainnet.bindingEvidence.every(({ deliverySupportsExecution }) => deliverySupportsExecution), true)
	const unknownDelivery = classifySourceClaim({ ...fixtureClaim, source: 'UnknownDelivery' }, indexAccountabilityAuthority({
		sourceBindings: [{ source: 'UnknownDelivery', delivery: 'FutureTransport' }],
		resolverModules: [],
		fieldSourcedEntityTypes: new Set(),
		referenceMaterializedEntityTypes: new Set(),
	})).bindingEvidence[0]
	assert.equal(unknownDelivery?.deliverySupportsExecution, false)
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
	assert.notEqual(
		sourceClaimAccountabilityKey(routeClaim),
		sourceClaimAccountabilityKey({
			...routeClaim,
			conditions: [{ field: 'network', equals: 'eip155:1' }],
		})
	)
})

test('measures two executable bindings per exact field or conditioned route coordinate', () => {
	const authority = indexAccountabilityAuthority({
		sourceBindings: [
			{ source: 'Primary', delivery: 'BrowserDirect' },
			{ source: 'Secondary', delivery: 'HttpProxy' },
			{ source: 'Retired', delivery: 'Unsupported' },
		],
		resolverModules: [{ source: 'Primary' }, { source: 'Secondary' }],
		fieldSourcedEntityTypes: new Set(),
		referenceMaterializedEntityTypes: new Set(),
	})
	const coordinate = {
		entityType: 'FixtureEntity',
		facetPath: ['Network'],
		fieldName: 'height',
	}
	const rows = compileSourceClaimBindingCoverage([
		classifySourceClaim({ ...coordinate, source: 'Primary' }, authority),
		classifySourceClaim({ ...coordinate, source: 'Secondary' }, authority),
		classifySourceClaim({ ...coordinate, source: 'Retired' }, authority),
		classifySourceClaim({
			...coordinate,
			source: 'Primary',
			conditions: [{ field: 'network', equals: 'eip155:1' }],
		}, authority),
	])

	assert.equal(rows.length, 2)
	const unconditional = rows.find(({ conditions }) => conditions == null)
	const conditioned = rows.find(({ conditions }) => conditions != null)
	assert.deepEqual(unconditional == null ? undefined : {
		declaredExecutableBindings: unconditional.declaredExecutableBindings,
		sources: unconditional.sources,
	}, { declaredExecutableBindings: 2, sources: ['Primary', 'Retired', 'Secondary'] })
	assert.deepEqual(conditioned == null ? undefined : {
		declaredExecutableBindings: conditioned.declaredExecutableBindings,
		sources: conditioned.sources,
	}, { declaredExecutableBindings: 1, sources: ['Primary'] })
	assert.deepEqual(dualBindingDeclarationGaps(rows), [conditioned])
})

test('duplicate claim does not satisfy two distinct source bindings', () => {
	const authority = indexAccountabilityAuthority({
		sourceBindings: [{ source: 'Primary', delivery: 'BrowserDirect' }],
		resolverModules: [{ source: 'Primary' }],
		fieldSourcedEntityTypes: new Set(),
		referenceMaterializedEntityTypes: new Set(),
	})
	const claim = classifySourceClaim({
		entityType: 'FixtureEntity',
		facetPath: ['Network'],
		fieldName: 'height',
		source: 'Primary',
	}, authority)

	const [coverage] = compileSourceClaimBindingCoverage([claim, claim])
	assert.equal(coverage?.declaredExecutableBindings, 1)
	assert.equal(dualBindingDeclarationGaps(coverage == null ? [] : [coverage]).length, 1)
})

test('same source with two distinct bindings remains two bindings', () => {
	const authority = indexAccountabilityAuthority({
		sourceBindings: [
			{ source: 'Primary', delivery: 'BrowserDirect' },
			{ source: 'Primary', delivery: 'HttpProxy' },
		],
		resolverModules: [{ source: 'Primary' }],
		fieldSourcedEntityTypes: new Set(),
		referenceMaterializedEntityTypes: new Set(),
	})
	const claim = classifySourceClaim({
		entityType: 'FixtureEntity',
		facetPath: ['Network'],
		fieldName: 'height',
		source: 'Primary',
	}, authority)

	const [coverage] = compileSourceClaimBindingCoverage([claim, claim])
	assert.equal(coverage?.declaredExecutableBindings, 2)
})

test('keeps generated observation clocks unclassified until a writer proves their provenance', () => {
	const rows = compileObservationTimeAccountability([
		{
			entityType: 'HistoricalThing_Timestamp',
			selectors: [{
				name: 'ThingTimestampMsSource',
				fields: ['$thing', 'timestampMs', 'source'],
			}],
		},
	], [{
		entityType: 'HistoricalThing_Timestamp',
		selectorName: 'ThingTimestampMsSource',
		route: '/thing/[thing]/observations/[timestampMs]/[source]',
		authoredPage: true,
		sources: ['Provider_Rest', 'Provider_Stream'],
	}])

	assert.deepEqual(rows.map((row) => row.provenance), [
		ObservationTimeProvenance.Unclassified,
		ObservationTimeProvenance.Unclassified,
	])
	assert.deepEqual(truthfulObservationTimeAccountability(rows), [])
	assert.deepEqual(rows.map(observationTimeAccountabilityKey), [
		'["HistoricalThing_Timestamp","ThingTimestampMsSource","/thing/[thing]/observations/[timestampMs]/[source]","Provider_Rest"]',
		'["HistoricalThing_Timestamp","ThingTimestampMsSource","/thing/[thing]/observations/[timestampMs]/[source]","Provider_Stream"]',
	])
	assert.throws(
		() => compileObservationTimeAccountability([
			{
				entityType: 'HistoricalThing_Timestamp',
				selectors: [{
					name: 'ThingTimestampMsSource',
					fields: ['$thing', 'timestampMs', 'source'],
				}],
			},
		], []),
		/Observation time selector HistoricalThing_Timestamp\.ThingTimestampMsSource has no generated route identity/
	)
})

test('derives writer evidence only from a typed writer used to emit an observation', () => {
	const sourceText = `
		const unused = defineObservationTimeWriter({
			entityType: EntityType.Unused_Timestamp,
			selectorName: 'UnusedTimestampMsSource',
			source: Source.Provider_Rest,
			provenance: 'LocalRefresh',
		})
		const used = defineObservationTimeWriter({
			entityType: EntityType.HistoricalThing_Timestamp,
			selectorName: 'ThingTimestampMsSource',
			source: Source.Provider_Rest,
			provenance: 'HttpResponse',
		})
		used.write({ $thing: { id: 'thing' }, timestampMs: 1, source: Source.Provider_Rest }, {})
	`
	const writers = observationTimeWriterManifest([{
		source: 'Provider_Rest',
		path: 'fixture.ts',
		sourceText,
	}])

	assert.deepEqual(writers, [{
		entityType: 'HistoricalThing_Timestamp',
		selectorName: 'ThingTimestampMsSource',
		source: 'Provider_Rest',
		provenance: 'HttpResponse',
	}])
})

test('re-derives the complete observation-time writer denominator without blessing unknown clocks', () => {
	const rows = compiledApp.observationTimeAccountability

	assert.equal(rows.length, 353)
	assert.deepEqual(compiledApp.observationTimeWriterManifest.map((writer) => ({ ...writer })), [
		{
			entityType: '_GlobalActivityPubNetwork_Timestamp',
			selectorName: 'HubTimestampMsSource',
			source: 'Mastodon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: '_GlobalIpfsAccess_Timestamp',
			selectorName: 'HubTimestampMsSource',
			source: 'Ipfs_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: '_GlobalSwarmAccess_Timestamp',
			selectorName: 'HubTimestampMsSource',
			source: 'Swarm_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: '_GlobalYoutubeNetwork_Timestamp',
			selectorName: 'HubTimestampMsSource',
			source: 'Youtube_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'AaveAccountMarket_Timestamp',
			selectorName: 'AccountMarketTimestampMsSource',
			source: 'Aave_Rest',
			provenance: 'HttpResponse',
		},
		{
			entityType: 'ActivityPubActor_Timestamp',
			selectorName: 'ActivityPubActorTimestampMsSource',
			source: 'Mastodon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'ActivityPubInstance_Timestamp',
			selectorName: 'InstanceTimestampMsSource',
			source: 'Mastodon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'ActivityPubNote_Timestamp',
			selectorName: 'ActivityPubNoteTimestampMsSource',
			source: 'Mastodon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'BeaconBlock_Timestamp',
			selectorName: 'BlockTimestampMsSource',
			source: 'Beacon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'BeaconDataColumn_Timestamp',
			selectorName: 'DataColumnTimestampMsSource',
			source: 'Beacon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'BeaconExecutionPayloadEnvelope_Timestamp',
			selectorName: 'EnvelopeTimestampMsSource',
			source: 'Beacon_Rest',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'BlockheadRadicleNodeState_Timestamp',
			selectorName: 'NodeStateTimestampMsSource',
			source: 'RadicleNode_Control',
			provenance: 'HttpResponse',
		},
		{
			entityType: 'IpfsResource_Timestamp',
			selectorName: 'ResourceTimestampMsSource',
			source: 'Ipfs_Rest',
			provenance: 'HttpResponse',
		},
		{
			entityType: 'LensAccount_Timestamp',
			selectorName: 'LensAccountTimestampMs',
			source: 'Lens_Graphql',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'LensPost_Timestamp',
			selectorName: 'LensPostTimestampMs',
			source: 'Lens_Graphql',
			provenance: 'LocalRefresh',
		},
		{
			entityType: 'NetworkEndpointObservation_Timestamp',
			selectorName: 'NetworkEndpointUrlEndpointKindTimestampMsSource',
			source: 'Beacon_Rest',
			provenance: 'HttpResponse',
		},
		...[
			['StellarAccount_Timestamp', 'AccountTimestampMsSource'],
			['StellarAccountSigner_Timestamp', 'SignerTimestampMsSource'],
			['StellarClaimableBalance_Timestamp', 'ClaimableBalanceTimestampMsSource'],
			['StellarLiquidityPool_Timestamp', 'LiquidityPoolTimestampMsSource'],
			['StellarOffer_Timestamp', 'OfferTimestampMsSource'],
			['StellarTransaction_Timestamp', 'TransactionTimestampMsSource'],
			['StellarTrustline_Timestamp', 'TrustlineTimestampMsSource'],
		].map(([entityType, selectorName]) => ({
			entityType,
			selectorName,
			source: 'StellarHorizon_Rest',
			provenance: 'HttpResponse' as const,
		})),
		...[
			['YoutubeChannel_Timestamp', 'YoutubeChannelTimestampMsSource'],
			['YoutubeComment_Timestamp', 'YoutubeCommentTimestampMsSource'],
			['YoutubePlaylist_Timestamp', 'YoutubePlaylistTimestampMsSource'],
			['YoutubeVideo_Timestamp', 'YoutubeVideoTimestampMsSource'],
		].map(([entityType, selectorName]) => ({
			entityType,
			selectorName,
			source: 'Youtube_Rest',
			provenance: 'LocalRefresh' as const,
		})),
	])
	const truthfulRows = truthfulObservationTimeAccountability(rows)
	assert.deepEqual(truthfulRows.map(({ entityType, selectorName, source, provenance }) => [entityType, selectorName, source, provenance]), [
		['_GlobalActivityPubNetwork_Timestamp', 'HubTimestampMsSource', 'Mastodon_Rest', ObservationTimeProvenance.LocalRefresh],
		['_GlobalIpfsAccess_Timestamp', 'HubTimestampMsSource', 'Ipfs_Rest', ObservationTimeProvenance.LocalRefresh],
		['_GlobalSwarmAccess_Timestamp', 'HubTimestampMsSource', 'Swarm_Rest', ObservationTimeProvenance.LocalRefresh],
		['AaveAccountMarket_Timestamp', 'AccountMarketTimestampMsSource', 'Aave_Rest', ObservationTimeProvenance.HttpResponse],
		['ActivityPubActor_Timestamp', 'ActivityPubActorTimestampMsSource', 'Mastodon_Rest', ObservationTimeProvenance.LocalRefresh],
		['ActivityPubInstance_Timestamp', 'InstanceTimestampMsSource', 'Mastodon_Rest', ObservationTimeProvenance.LocalRefresh],
		['ActivityPubNote_Timestamp', 'ActivityPubNoteTimestampMsSource', 'Mastodon_Rest', ObservationTimeProvenance.LocalRefresh],
		['BeaconBlock_Timestamp', 'BlockTimestampMsSource', 'Beacon_Rest', ObservationTimeProvenance.LocalRefresh],
		['BeaconDataColumn_Timestamp', 'DataColumnTimestampMsSource', 'Beacon_Rest', ObservationTimeProvenance.LocalRefresh],
		['BeaconExecutionPayloadEnvelope_Timestamp', 'EnvelopeTimestampMsSource', 'Beacon_Rest', ObservationTimeProvenance.LocalRefresh],
		['IpfsResource_Timestamp', 'ResourceTimestampMsSource', 'Ipfs_Rest', ObservationTimeProvenance.HttpResponse],
		['NetworkEndpointObservation_Timestamp', 'NetworkEndpointUrlEndpointKindTimestampMsSource', 'Beacon_Rest', ObservationTimeProvenance.HttpResponse],
	])
	assert.equal(rows.filter((row) => row.provenance === ObservationTimeProvenance.Unclassified).length, 341)
	for (const row of rows.filter((row) => row.provenance === ObservationTimeProvenance.Unclassified)) {
		assert.equal(row.selectorFields.includes('timestampMs'), true)
		assert.equal(row.route.startsWith('/'), true)
		assert.equal(observationTimeAccountabilityKey(row).startsWith('['), true)
	}
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
			MappedSelectorAccountability.IntentionallyNonExecutable,
		]
	)
	assert.deepEqual(
		classifyMappedSelector({
			...fixtureMapping,
			sources: ['ProxiedRest', 'UnresolvedRest'],
		}, fixtureAuthority).sourcesWithoutResolver,
		['UnresolvedRest']
	)
	assert.deepEqual(
		classifyMappedSelector(fixtureMapping, {
			...fixtureAuthority,
			resolverClaimKeys: new Set(),
		}).sourcesWithoutResolver,
		['ProxiedRest']
	)
})

test('keeps required zero-binding coordinates without borrowing selector bindings', () => {
	const fields = [[], ['Facet']].map((facetPath) => ({
		entityType: fixtureClaim.entityType,
		facetPath,
		fieldName: 'value',
	}))
	const rows = compileSourceClaimBindingCoverage(
		[classifySourceClaim(fixtureClaim, fixtureAuthority)],
		[...fields, ...fields]
	)
	assert.equal(rows.length, 3)
	assert.equal(rows.find((row) => row.selectorName === fixtureClaim.selectorName)?.declaredExecutableBindings, 1)
	const gaps = dualBindingDeclarationGaps(rows).filter((row) => row.fieldName === 'value')
	assert.equal(gaps.length, 2)
	for (const gap of gaps) {
		assert.deepEqual(gap.sources, [])
		assert.equal(gap.declaredExecutableBindings, 0)
		assert.equal(gap.requiredBindings, 2)
	}
})

test('retains unsourced base and facet fields independently of sourced selector claims', () => {
	const coordinates = new Set(compiledSourceAccountability.bindingCoverage
		.filter((row) => row.publicRoute == null)
		.map((row) => JSON.stringify([row.entityType, row.facetPath, row.fieldName])))
	for (const entity of app.schema.entities) {
		const scopes = [{
			fields: entity.fields,
			facets: entity.facets,
			path: [] as string[],
		}]
		for (const scope of scopes) {
			for (const field of scope.fields)
				assert.ok(
					coordinates.has(JSON.stringify([entity.entityType, scope.path, field.name])),
					`${entity.entityType}.${[...scope.path, field.name].join('.')} must remain in the denominator`
				)
			for (const facet of scope.facets ?? [])
				scopes.push({
					fields: facet.fields ?? [],
					facets: facet.facets,
					path: [...scope.path, facet.name],
				})
		}
	}
	const gaps = dualBindingDeclarationGaps(compiledSourceAccountability.bindingCoverage)
	assert.ok(gaps.some((row) => row.sources.length === 0 && row.declaredExecutableBindings === 0))
})

test('accounts for every compiled claim and mapped selector of the current app', () => {
	const { bindingCoverage, claims, mappedSelectors } = compiledSourceAccountability

	assert.ok(claims.length > 0)
	assert.ok(mappedSelectors.length > 0)
	assert.ok(bindingCoverage.length > 0)
	const coverageRows = new Set(bindingCoverage.map((row) => JSON.stringify(row)))
	for (const row of compileSourceClaimBindingCoverage(claims))
		assert.ok(coverageRows.has(JSON.stringify(row)))
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
	assert.equal(claims.flatMap((row) => row.bindingEvidence).every(({ verification }) => verification === 'Unverified'), true)
	assert.ok(claims.some((row) => row.bindingEvidence.some(({ target }) => target != null)))
	assert.equal(
		claims.flatMap((row) => row.bindingEvidence).some(({ targetMatch }) => targetMatch === SourceBindingTargetMatch.Unknown),
		true
	)
	assert.equal(
		mappedSelectors.filter((row) => (
			row.accountability === MappedSelectorAccountability.ResolverOnlyCapability
		)).every((row) => !row.authoredPage),
		true
	)
	assert.equal(
		mappedSelectors.filter((row) => (
			row.accountability === MappedSelectorAccountability.IntentionallyNonExecutable
		)).every((row) => row.sources.length === 0),
		true
	)
})

test('partitions the public cold-read denominator by unfinished provider slice', () => {
	const { claims } = compiledSourceAccountability
	const gaps = publicColdReadGaps(claims)

	assert.equal(gaps.length, 0)
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
