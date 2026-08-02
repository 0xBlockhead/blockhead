import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import type { ResolverSelectorPattern } from '$/resolvers/$resolvers.ts'
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

type SpecificationProposalReference = {
	readonly [EntityMetaKey.Selector]: SpecificationProposalSelector
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
				resolve: resolveProposalIndex,
			},
		},
	})({
		$$proposals: (snapshot) => snapshot,
	}),
] as const)
