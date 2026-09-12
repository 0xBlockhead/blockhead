import ts from 'typescript'

import type { ObservationTimeProvenance as ResolverObservationTimeProvenance } from '../../src/resolvers/observationTimeWriter.ts'

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

export enum SourceBindingTargetMatch {
	Matches = 'Matches',
	Differs = 'Differs',
	Unknown = 'Unknown',
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
	IntentionallyNonExecutable = 'IntentionallyNonExecutable',
}

// A timestamp coordinate is historical only when its writer has evidence for
// the origin of that clock. Keeping the unclassified class in the compiler IR
// makes every missing proof an actionable row instead of silently treating a
// newly sampled current response as a historical read.
export enum ObservationTimeProvenance {
	ProviderEvent = 'ProviderEvent',
	ProviderSnapshot = 'ProviderSnapshot',
	HttpResponse = 'HttpResponse',
	Ingestion = 'Ingestion',
	LocalRefresh = 'LocalRefresh',
	Unclassified = 'Unclassified',
}

export type ObservationTimeAccountabilityRow = Readonly<{
	entityType: string
	selectorName: string
	selectorFields: readonly string[]
	route: string
	authoredPage: boolean
	source?: string
	provenance: ObservationTimeProvenance
}>

export type ObservationTimeWriter = Readonly<{
	entityType: string
	selectorName: string
	source: string
	provenance: Exclude<ResolverObservationTimeProvenance, 'Unclassified'>
}>

type ObservationTimeSelector = Readonly<{
	entityType: string
	selectors: readonly {
		name: string
		fields: readonly string[]
	}[]
}>

type ObservationTimeRoute = Readonly<{
	entityType: string
	selectorName: string
	route: string
	authoredPage: boolean
	sources: readonly string[]
}>

export const observationTimeAccountabilityKey = (
	row: Pick<ObservationTimeAccountabilityRow, 'entityType' | 'selectorName' | 'route' | 'source'>
) => JSON.stringify([
	row.entityType,
	row.selectorName,
	row.route,
	row.source ?? null,
])

export const compileObservationTimeAccountability = (
	entities: readonly ObservationTimeSelector[],
	routes: readonly ObservationTimeRoute[],
	writers: readonly ObservationTimeWriter[] = []
) => {
	const provenanceByWriterKey = writers.reduce((provenanceByWriterKey, writer) => {
		const key = JSON.stringify([
			writer.entityType,
			writer.selectorName,
			writer.source,
		])
		const previous = provenanceByWriterKey.get(key)
		provenanceByWriterKey.set(
			key,
			previous == null || previous === writer.provenance ?
				writer.provenance
			:
				ObservationTimeProvenance.Unclassified
		)
		return provenanceByWriterKey
	}, new Map<string, ObservationTimeProvenance>())

	return entities.flatMap(({ entityType, selectors }) => selectors
	.filter(({ fields }) => fields.includes('timestampMs'))
	.flatMap(({ name, fields }) => {
		const route = routes.find((candidate) => (
			candidate.entityType === entityType
			&& candidate.selectorName === name
		))
		if (route == null)
			throw new Error(`Observation time selector ${entityType}.${name} has no generated route identity`)

		return (route.sources.length === 0 ? [undefined] : route.sources).map((source) => ({
			entityType,
			selectorName: name,
			selectorFields: fields,
			route: route.route,
			authoredPage: route.authoredPage,
			...(source == null ? {} : { source }),
			provenance: source == null ?
				ObservationTimeProvenance.Unclassified
			:
				provenanceByWriterKey.get(JSON.stringify([
					entityType,
					name,
					source,
				])) ?? ObservationTimeProvenance.Unclassified,
		}))
	}))
}

const objectProperty = (
	object: ts.ObjectLiteralExpression,
	name: string
) => object.properties.find((property): property is ts.PropertyAssignment => (
	ts.isPropertyAssignment(property)
		&& ts.isIdentifier(property.name)
		&& property.name.text === name
	))

const identifierText = (
	expression: ts.Expression | undefined,
	description: string
) => {
	if (expression != null && ts.isPropertyAccessExpression(expression))
		return expression.name.text
	if (expression != null && ts.isStringLiteral(expression))
		return expression.text
	throw new Error(`Observation-time writer ${description} must be a literal`)
}

const observationTimeWriterProvenance = (
	value: string,
	description: string
): ObservationTimeWriter['provenance'] => {
	switch (value) {
		case 'ProviderEvent':
		case 'ProviderSnapshot':
		case 'HttpResponse':
		case 'Ingestion':
		case 'LocalRefresh':
			return value
		default:
			throw new Error(`Observation-time writer ${description} has unsupported provenance ${value}`)
	}
}

export const observationTimeWriterManifest = (
	resolverModules: readonly {
		source: string
		path?: string
		paths?: readonly string[]
		sourceText?: string
	}[]
): readonly ObservationTimeWriter[] => resolverModules.flatMap((resolverModule) => {
	const paths = resolverModule.paths ?? (resolverModule.path == null ? [] : [resolverModule.path])
	return paths.flatMap((resolverPath) => {
		const source = resolverModule.sourceText ?? ts.sys.readFile(resolverPath)
		if (source == null)
			throw new Error(`Observation-time writer resolver source is unavailable: ${resolverPath}`)

		const file = ts.createSourceFile(resolverPath, source, ts.ScriptTarget.Latest, true)
		const writers = new Map<string, ObservationTimeWriter>()
		const usedWriters = new Set<string>()
		const visit = (node: ts.Node): void => {
			if (
				ts.isVariableDeclaration(node)
				&& ts.isIdentifier(node.name)
				&& node.initializer != null
				&& ts.isCallExpression(node.initializer)
				&& ts.isIdentifier(node.initializer.expression)
				&& node.initializer.expression.text === 'defineObservationTimeWriter'
			) {
				const registration = node.initializer.arguments[0]
				if (registration == null || !ts.isObjectLiteralExpression(registration))
					throw new Error(`Observation-time writer ${node.name.text} in ${resolverPath} must use an object registration`)

				const writer = {
					entityType: identifierText(objectProperty(registration, 'entityType')?.initializer, `${node.name.text}.entityType`),
					selectorName: identifierText(objectProperty(registration, 'selectorName')?.initializer, `${node.name.text}.selectorName`),
					source: identifierText(objectProperty(registration, 'source')?.initializer, `${node.name.text}.source`),
					provenance: observationTimeWriterProvenance(
						identifierText(objectProperty(registration, 'provenance')?.initializer, `${node.name.text}.provenance`),
						`${node.name.text}.provenance`
					),
				}
				if (writer.source !== resolverModule.source)
					throw new Error(`Observation-time writer ${node.name.text} in ${resolverPath} declares ${writer.source}, not ${resolverModule.source}`)
				writers.set(node.name.text, writer)
			}
			if (
				ts.isCallExpression(node)
				&& ts.isPropertyAccessExpression(node.expression)
				&& node.expression.name.text === 'write'
				&& ts.isIdentifier(node.expression.expression)
			)
				usedWriters.add(node.expression.expression.text)

			ts.forEachChild(node, visit)
		}
		visit(file)
		return [...usedWriters].flatMap((writerName) => {
			const writer = writers.get(writerName)
			return writer == null ? [] : [writer]
		})
	})
}).toSorted((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right), 'en'))

export const truthfulObservationTimeAccountability = (
	rows: readonly ObservationTimeAccountabilityRow[]
) => rows.filter((row) => row.provenance !== ObservationTimeProvenance.Unclassified)

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
	bindingsBySource: ReadonlyMap<string, readonly SourceBindingAuthority[]>
}>

export type SourceBindingAuthority = Readonly<{
	source: string
	delivery: string
	target?: Readonly<{
		kind: string
		key: string
	}>
}>

export const sourceClaimAccountabilityKey = (claim: Pick<SourceClaimFacts, 'publicRoute' | 'source' | 'entityType' | 'selectorName' | 'facetPath' | 'fieldName' | 'conditions'>) => JSON.stringify([
	claim.publicRoute ?? null,
	claim.source,
	claim.entityType,
	claim.selectorName ?? null,
	claim.facetPath,
	claim.fieldName ?? null,
	claim.conditions ?? null,
])

export type SourceClaimCondition = Readonly<{
	prop?: string
	field?: string
	equals: string | number | boolean
}>

type SourceClaimFacts = Readonly<{
	source: string
	entityType: string
	selectorName?: string
	facetPath: readonly string[]
	fieldName?: string
	publicRoute?: string
	target?: SourceBindingAuthority['target']
	conditions?: readonly SourceClaimCondition[]
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
	bindingEvidence: readonly SourceClaimBindingEvidence[]
}>

export type SourceClaimBindingCoverageRow = Readonly<{
	entityType: string
	selectorName?: string
	facetPath: readonly string[]
	fieldName?: string
	publicRoute?: string
	conditions?: readonly SourceClaimCondition[]
	sources: readonly string[]
	declaredExecutableBindings: number
	requiredBindings: 2
}>

export type SourceClaimBindingEvidence = Readonly<{
	target?: SourceBindingAuthority['target']
	delivery: string
	deliverySupportsExecution: boolean
	targetMatch: SourceBindingTargetMatch
	bindingIndex: number
	verification: 'Unverified'
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
	sourceBindings: readonly SourceBindingAuthority[]
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
	bindingsBySource: Map.groupBy(sourceBindings, ({ source }) => source),
})

export const sourceAccess = (
	source: string,
	authority: AccountabilityAuthority
) => authority.accessBySource.get(source) ?? SourceAccess.Undeclared

const bindingTargetMatch = (
	claim: Pick<SourceClaimFacts, 'target'>,
	binding: SourceBindingAuthority
) => claim.target == null || binding.target == null ?
	SourceBindingTargetMatch.Unknown
:
	claim.target.kind === binding.target.kind && claim.target.key === binding.target.key ?
	SourceBindingTargetMatch.Matches
:
	SourceBindingTargetMatch.Differs

export const sourceClaimBindingEvidence = (
	claim: Pick<SourceClaimFacts, 'source' | 'target'>,
	authority: AccountabilityAuthority
): readonly SourceClaimBindingEvidence[] => (authority.bindingsBySource.get(claim.source) ?? [])
	.map((binding, bindingIndex) => {
		const access = accessByDelivery.get(binding.delivery)
		return {
			bindingIndex,
			...(binding.target == null ? {} : { target: binding.target }),
			delivery: binding.delivery,
			deliverySupportsExecution: access != null && access !== SourceAccess.NonExecutable,
			targetMatch: bindingTargetMatch(claim, binding),
			verification: 'Unverified',
		}
	})

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
	bindingEvidence: sourceClaimBindingEvidence(claim, authority),
})

const sourceClaimCoverageKey = (claim: SourceClaimFacts) => JSON.stringify([
	claim.publicRoute ?? null,
	claim.entityType,
	claim.selectorName ?? null,
	claim.facetPath,
	claim.fieldName ?? null,
	claim.conditions ?? null,
])

export const compileSourceClaimBindingCoverage = (
	claims: readonly SourceClaimAccountabilityRow[]
): readonly SourceClaimBindingCoverageRow[] => [...Map.groupBy(claims, sourceClaimCoverageKey).values()]
	.map((group) => {
		const first = group[0]
		return {
			entityType: first.entityType,
			...(first.selectorName == null ? {} : { selectorName: first.selectorName }),
			facetPath: first.facetPath,
			...(first.fieldName == null ? {} : { fieldName: first.fieldName }),
			...(first.publicRoute == null ? {} : { publicRoute: first.publicRoute }),
			...(first.conditions == null ? {} : { conditions: first.conditions }),
			sources: [...new Set(group.map(({ source }) => source))].toSorted(),
			declaredExecutableBindings: new Set(group.flatMap((claim) => claim.bindingEvidence.flatMap((binding) => (
				binding.deliverySupportsExecution
				&& binding.targetMatch !== SourceBindingTargetMatch.Differs
			) ? [`${claim.source}:${binding.bindingIndex}`] : []))).size,
			requiredBindings: 2,
		}
	})
	.toSorted((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right), 'en'))

export const dualBindingDeclarationGaps = (
	rows: readonly SourceClaimBindingCoverageRow[]
) => rows.filter(({ declaredExecutableBindings, requiredBindings }) => declaredExecutableBindings < requiredBindings)

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
			MappedSelectorAccountability.IntentionallyNonExecutable
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
