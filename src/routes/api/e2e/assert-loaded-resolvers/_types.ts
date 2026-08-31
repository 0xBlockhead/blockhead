export type AssertLoadedResolverProbeCategory = (
	| 'catalog'
	| 'networkLive'
	| 'envGated'
	| 'knownUpstreamGap'
	| 'unsupportedField'
)

export type AssertLoadedResolverProbeCategoryBucket = {
	total: number
	resolveOk: number
	resolveRejected: number
	assertOk: number
	fulfilledButAssertFailed: number
}

export type AssertLoadedResolverProbeCategorySummary = Record<
	AssertLoadedResolverProbeCategory,
	AssertLoadedResolverProbeCategoryBucket
>

export type AssertLoadedResolverProbeCase = {
	kind: 'entity' | 'field' | 'count'
	key: string
	category: AssertLoadedResolverProbeCategory
	resolveRejected: boolean
	resolveError?: string
	assertThrew: boolean
	assertError?: string
}

export type AssertLoadedResolverProbeResult = {
	cases: AssertLoadedResolverProbeCase[]
	/** Resolver-definition and exact-selector snapshots exercised. */
	resolverDefinitionCount: number
	resolverValuePartCount: number
	countResolverPartCount: number
	countResolverFields: string[]
	fieldLiveResolverPartCount: number
	rootLiveResolverCount: number
	assertOk: number
	resolveOk: number
	/** Resolve succeeded but materialization failed. Fulfilled violations are never expected upstream gaps. */
	fulfilledButAssertFailed: AssertLoadedResolverProbeCase[]
	categorySummary: AssertLoadedResolverProbeCategorySummary
}
