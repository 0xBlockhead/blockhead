import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

const hyperliquidHips = [
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
] as const

export default {
	source: Source.HyperliquidDocs_Rest,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Hyperliquid,
				category: ProposalCategory.Hip,
			},
		],
		resolveProposal: async ({ number }) => {
			const proposal = hyperliquidHips.find((hyperliquidHip) => hyperliquidHip.number === number)
			if (proposal == null)
				throw new Error(`HyperliquidDocs_Rest: HIP not found ${number.toString()}`)

			return {
				documentBody: `HIP-${proposal.number.toString()}: ${proposal.title}`,
				documentCategory: 'HIP',
				documentStatus: 'Documented',
				documentTitle: proposal.title,
			}
		},
		resolveProposalIndex: async () => hyperliquidHips.map(({ number }) => ({
			[EntityMetaKey.Selector]: {
				realm: SpecificationRealm.Hyperliquid,
				category: ProposalCategory.Hip,
				number,
			},
		})),
	}),
} satisfies RegisteredSourceResolverModule
