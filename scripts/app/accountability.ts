// Source accountability classifies every compiled source claim and every mapped
// route selector against declared delivery and resolver authority, so coverage
// counts distinguish public cold-read demand from local, server, or
// identity-only capability instead of one undifferentiated total.

export enum SourceClaimDemand {
	PublicRoute = 'PublicRoute',
	FieldDefault = 'FieldDefault',
}

export enum SourceAccess {
	Public = 'Public',
	LocalRuntime = 'LocalRuntime',
	ServerRuntime = 'ServerRuntime',
	NonExecutable = 'NonExecutable',
	Undeclared = 'Undeclared',
}

export enum SourceClaimExecutability {
	ResolverDeclared = 'ResolverDeclared',
	ResolverMissing = 'ResolverMissing',
}

export enum MappedSelectorAccountability {
	PublicRouteDemand = 'PublicRouteDemand',
	PublicRouteResolverMissing = 'PublicRouteResolverMissing',
	LocalRuntimeDemand = 'LocalRuntimeDemand',
	LocalRuntimeResolverMissing = 'LocalRuntimeResolverMissing',
	NonExecutableDemand = 'NonExecutableDemand',
	NonExecutableResolverMissing = 'NonExecutableResolverMissing',
	ResolverOnlyCapability = 'ResolverOnlyCapability',
	FieldSourcedIdentity = 'FieldSourcedIdentity',
	ReferenceMaterializedIdentity = 'ReferenceMaterializedIdentity',
	SchemaIdentityOnly = 'SchemaIdentityOnly',
}

export type AccountabilityAuthority = Readonly<{
	accessBySource: ReadonlyMap<string, SourceAccess>
	deliveriesBySource: ReadonlyMap<string, readonly string[]>
	resolverSources: ReadonlySet<string>
	resolverClaimKeys?: ReadonlySet<string>
	// A selector without its own route source selection still reads through the
	// default sources declared by its entity fields, or through a claimed
	// reference field that materializes it as a child row of another entity.
	fieldSourcedEntityTypes: ReadonlySet<string>
	referenceMaterializedEntityTypes: ReadonlySet<string>
}>

export const sourceClaimAccountabilityKey = (claim: Pick<SourceClaimFacts, 'publicRoute' | 'source' | 'entityType' | 'selectorName' | 'facetPath' | 'fieldName'>) => JSON.stringify([
	claim.publicRoute ?? null,
	claim.source,
	claim.entityType,
	claim.selectorName ?? null,
	claim.facetPath,
	claim.fieldName ?? null,
])

type SourceClaimFacts = Readonly<{
	source: string
	entityType: string
	selectorName?: string
	facetPath: readonly string[]
	fieldName?: string
	publicRoute?: string
}>

type MappedSelectorFacts = Readonly<{
	entityType: string
	selectorName: string
	route: string
	authoredPage: boolean
	sources: readonly string[]
}>

export type SourceClaimAccountabilityRow = SourceClaimFacts & Readonly<{
	demand: SourceClaimDemand
	access: SourceAccess
	deliveries: readonly string[]
	executability: SourceClaimExecutability
}>

export type MappedSelectorAccountabilityRow = MappedSelectorFacts & Readonly<{
	accountability: MappedSelectorAccountability
	sourcesWithoutResolver: readonly string[]
}>

const accessByDelivery = new Map([
	['BrowserDirect', SourceAccess.Public],
	['HttpProxy', SourceAccess.Public],
	['RemoteLive', SourceAccess.Public],
	['RemoteQuery', SourceAccess.Public],
	['LocalOnly', SourceAccess.LocalRuntime],
	['ServerOnly', SourceAccess.ServerRuntime],
	['Unsupported', SourceAccess.NonExecutable],
])

// A source is as reachable as its most capable declared binding: public beats a
// non-browser host, and a host-bound binding beats an unsupported one.
const accessRank = [
	SourceAccess.Undeclared,
	SourceAccess.NonExecutable,
	SourceAccess.ServerRuntime,
	SourceAccess.LocalRuntime,
	SourceAccess.Public,
]

const widestAccess = (
	left: SourceAccess,
	right: SourceAccess
) => accessRank.indexOf(left) > accessRank.indexOf(right) ? left : right

export const indexAccountabilityAuthority = ({
	sourceBindings,
	resolverModules,
	resolverClaimKeys,
	fieldSourcedEntityTypes,
	referenceMaterializedEntityTypes,
}: {
	sourceBindings: readonly {
		source: string
		delivery: string
	}[]
	resolverModules: readonly {
		source: string
	}[]
	resolverClaimKeys?: ReadonlySet<string>
	fieldSourcedEntityTypes: ReadonlySet<string>
	referenceMaterializedEntityTypes: ReadonlySet<string>
}): AccountabilityAuthority => ({
	accessBySource: sourceBindings.reduce((accessBySource, binding) => accessBySource.set(
		binding.source,
		widestAccess(
			accessByDelivery.get(binding.delivery) ?? SourceAccess.Undeclared,
			accessBySource.get(binding.source) ?? SourceAccess.Undeclared
		)
	), new Map<string, SourceAccess>()),
	deliveriesBySource: Map.groupBy(sourceBindings, ({ source }) => source)
		.entries()
		.reduce((deliveriesBySource, [source, bindings]) => deliveriesBySource.set(
			source,
			bindings.map(({ delivery }) => delivery).toSorted()
		), new Map<string, readonly string[]>()),
	resolverSources: new Set(resolverModules.map((resolverModule) => resolverModule.source)),
	resolverClaimKeys,
	fieldSourcedEntityTypes,
	referenceMaterializedEntityTypes,
})

export const sourceAccess = (
	source: string,
	authority: AccountabilityAuthority
) => authority.accessBySource.get(source) ?? SourceAccess.Undeclared

export const classifySourceClaim = (
	claim: SourceClaimFacts,
	authority: AccountabilityAuthority
): SourceClaimAccountabilityRow => ({
	...claim,
	demand: claim.publicRoute == null ? SourceClaimDemand.FieldDefault : SourceClaimDemand.PublicRoute,
	access: sourceAccess(claim.source, authority),
	deliveries: authority.deliveriesBySource.get(claim.source) ?? [],
	executability: (authority.resolverClaimKeys == null ? authority.resolverSources.has(claim.source) : authority.resolverClaimKeys.has(sourceClaimAccountabilityKey(claim))) ?
		SourceClaimExecutability.ResolverDeclared
	:
		SourceClaimExecutability.ResolverMissing,
})

const mappedSelectorAccountability = (
	mapping: MappedSelectorFacts,
	authority: AccountabilityAuthority
) => {
	if (mapping.sources.length === 0)
		return authority.fieldSourcedEntityTypes.has(mapping.entityType) ?
			MappedSelectorAccountability.FieldSourcedIdentity
		: authority.referenceMaterializedEntityTypes.has(mapping.entityType) ?
			MappedSelectorAccountability.ReferenceMaterializedIdentity
		:
			MappedSelectorAccountability.SchemaIdentityOnly
	if (!mapping.authoredPage)
		return MappedSelectorAccountability.ResolverOnlyCapability

	const access = mapping.sources.reduce<SourceAccess>(
		(widest, source) => widestAccess(sourceAccess(source, authority), widest),
		SourceAccess.Undeclared
	)

	const resolverMissing = mapping.sources.some((source) => authority.resolverClaimKeys == null ?
		!authority.resolverSources.has(source)
	:
		!authority.resolverClaimKeys.has(sourceClaimAccountabilityKey({
			publicRoute: mapping.route,
			source,
			entityType: mapping.entityType,
			selectorName: mapping.selectorName,
			facetPath: [],
		})))
	return access === SourceAccess.Public ?
		(resolverMissing ? MappedSelectorAccountability.PublicRouteResolverMissing : MappedSelectorAccountability.PublicRouteDemand)
	: access === SourceAccess.LocalRuntime || access === SourceAccess.ServerRuntime ?
		(resolverMissing ? MappedSelectorAccountability.LocalRuntimeResolverMissing : MappedSelectorAccountability.LocalRuntimeDemand)
	:
		(resolverMissing ? MappedSelectorAccountability.NonExecutableResolverMissing : MappedSelectorAccountability.NonExecutableDemand)
}

export const classifyMappedSelector = (
	mapping: MappedSelectorFacts,
	authority: AccountabilityAuthority
): MappedSelectorAccountabilityRow => {
	const accountability = mappedSelectorAccountability(mapping, authority)
	const sourcesWithoutResolver = mapping.sources.filter((source) => (
		authority.resolverClaimKeys == null ? !authority.resolverSources.has(source) : !authority.resolverClaimKeys.has(sourceClaimAccountabilityKey({
		publicRoute: mapping.route,
		source,
		entityType: mapping.entityType,
		selectorName: mapping.selectorName,
		facetPath: [],
	}))
	))
	return {
		...mapping,
		accountability,
		sourcesWithoutResolver,
	}
}

// A public route claim whose source declares no resolver module cannot be read
// on a cold public visit; this is the only accountability class that represents
// unfinished executable authority rather than a declared boundary.
export const publicColdReadGaps = (
	rows: readonly SourceClaimAccountabilityRow[]
) => rows.filter((row) => (
	row.demand === SourceClaimDemand.PublicRoute
	&& row.access === SourceAccess.Public
	&& row.executability === SourceClaimExecutability.ResolverMissing
))

export const countBy = <_Row>(
	rows: readonly _Row[],
	keyForRow: (row: _Row) => string
) => Object.entries(Object.groupBy(rows, keyForRow))
	.map(([key, group]) => [key, group?.length ?? 0] as const)
	.toSorted(([left], [right]) => left.localeCompare(right, 'en'))
