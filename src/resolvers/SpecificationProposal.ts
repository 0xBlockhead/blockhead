import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
	type ResolverSelectorPattern,
} from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'

type SpecificationProposalSelector = EntitySelectorForSelectorName<
	typeof schema,
	typeof EntityType.SpecificationProposal,
	'RealmCategoryNumber'
>

type SpecificationProposalDocument = {
	documentBody: string | undefined
	documentCategory: string | undefined
	documentStatus: string | undefined
	documentTitle: string | undefined
}

export type SpecificationProposalReference = {
	readonly [EntityMetaKey.Selector]: SpecificationProposalSelector
}

export const specificationProposalIndexRows = (
	rows: readonly SpecificationProposalReference[],
	errorPrefix: string
) => {
	const sorted = rows.toSorted((left, right) => {
		const leftSelector = left[EntityMetaKey.Selector]
		const rightSelector = right[EntityMetaKey.Selector]
		return (
			leftSelector.realm !== rightSelector.realm ?
				leftSelector.realm.localeCompare(rightSelector.realm)
			: leftSelector.category !== rightSelector.category ?
				leftSelector.category.localeCompare(rightSelector.category)
			:
				leftSelector.number - rightSelector.number
		)
	})
	const seen = new Set<string>()
	for (const row of sorted) {
		const { realm, category, number } = row[EntityMetaKey.Selector]
		const identity = `${realm}:${category}:${number}`
		if (seen.has(identity))
			throw new Error(`${errorPrefix}: duplicate proposal identity ${identity}`)
		seen.add(identity)
	}
	return sorted
}

export const specificationProposalIndexPage = (
	rows: readonly SpecificationProposalReference[],
	context: ResolverContext,
	errorPrefix: string
) => {
	const offset = context.pagination.offset ?? 0
	const limit = resolverContextRowLimit(context)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`${errorPrefix}: invalid proposal index offset`)
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error(`${errorPrefix}: invalid proposal index limit`)

	return {
		rows: rows.slice(offset, offset + limit),
		totalCount: rows.length,
	}
}

export default ({
	appliesTo,
	resolveProposal,
	resolveProposalIndex,
}: {
	appliesTo: readonly [
		ResolverSelectorPattern<SpecificationProposalSelector>,
		...ResolverSelectorPattern<SpecificationProposalSelector>[],
	]
	resolveProposal: (
		selector: SpecificationProposalSelector
	) => Promise<SpecificationProposalDocument>
	resolveProposalIndex: () => Promise<readonly SpecificationProposalReference[]>
}) => ([
	defineResolver({
		entityType: EntityType.SpecificationProposal,
		resolve: {
			RealmCategoryNumber: {
				appliesTo,
				resolve: resolveProposal,
			},
		},
	})({
		documentBody: (snapshot) => snapshot.documentBody,
		documentCategory: (snapshot) => snapshot.documentCategory,
		documentStatus: (snapshot) => snapshot.documentStatus,
		documentTitle: (snapshot) => snapshot.documentTitle,
	}),

	defineResolver({
		entityType: EntityType._Global,
		resolve: {
			Scope: {
				resolve: async () => specificationProposalIndexRows(
					await resolveProposalIndex(),
					'SpecificationProposal'
				),
			},
		},
	})({
		$$proposals: {
			select: (snapshot, _selector, context) => specificationProposalIndexPage(
				snapshot,
				context,
				'SpecificationProposal'
			).rows,
			resolveCount: (snapshot) => snapshot.length,
		},
	}),
] as const)
