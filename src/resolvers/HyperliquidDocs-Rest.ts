import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const hyperliquidHipRows = async () => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return [
		{
			number: 1,
			title: 'Native token standard and spot deploys',
		},
		{
			number: 2,
			title: 'Hyperliquidity',
		},
		{
			number: 3,
			title: 'Builder-deployed perpetuals',
		},
		{
			number: 4,
			title: 'Outcome contracts',
		},
	].map((hyperliquidHip) => ({
		[EntityMetaKey.Id]: {
			realm: SpecificationRealm.Hyperliquid,
			category: ProposalCategory.Hip,
			number: hyperliquidHip.number,
		},
		documentCategory: 'HIP',
		documentTitle: hyperliquidHip.title,
		documentStatus: 'Documented',
		documentBody: `HIP-${hyperliquidHip.number.toString()}: ${hyperliquidHip.title}`,
	}))
}

export default {
	source: Source.HyperliquidDocs_Rest,

	resolvers: [
		defineResolver(Source.HyperliquidDocs_Rest, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Hyperliquid || entityId.category !== ProposalCategory.Hip) {
					throw new Error('HyperliquidDocs_Rest: proposal resolver only supports Hyperliquid HIPs')
				}
				const proposal = (await hyperliquidHipRows()).find((hyperliquidHip) => hyperliquidHip[EntityMetaKey.Id].number === entityId.number)
				if (proposal == null) throw new Error(`HyperliquidDocs_Rest: HIP not found ${entityId.number.toString()}`)
				return proposal
			}
			},
			fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}
		}),

		defineResolver(Source.HyperliquidDocs_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: hyperliquidHipRows
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver(Source.HyperliquidDocs_Rest, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Hyperliquid) throw new Error('HyperliquidDocs_Rest: $$proposals only supports Hyperliquid')
				return hyperliquidHipRows()
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver(Source.HyperliquidDocs_Rest, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Hyperliquid || entityId.category !== ProposalCategory.Hip) throw new Error('HyperliquidDocs_Rest: $$proposals only supports Hyperliquid HIPs')
				return hyperliquidHipRows()
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),
	],
}
