import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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

const hyperliquidHipDocument = ({
	number,
}: {
	number: number
}) => {
	const proposal = hyperliquidHips.find((hyperliquidHip) => hyperliquidHip.number === number)
	if (proposal == null)
		throw new Error(`HyperliquidDocs_Rest: HIP not found ${number.toString()}`)

	return {
		documentBody: `HIP-${proposal.number.toString()}: ${proposal.title}`,
		documentCategory: 'HIP',
		documentStatus: 'Documented',
		documentTitle: proposal.title,
	}
}

export default {
	source: Source.HyperliquidDocs_Rest,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Hyperliquid,
				category: ProposalCategory.Hip,
			},
		],
		resolveProposal: hyperliquidHipDocument,
		resolveProposalIndex: async () => hyperliquidHips.map(({ number }) => {
			const document = hyperliquidHipDocument({ number })
			return {
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Hyperliquid,
					category: ProposalCategory.Hip,
					number,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: document.documentCategory,
					[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: document.documentStatus,
					[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: document.documentTitle,
				},
			}
		}),
	}),
} satisfies RegisteredSourceResolverModule
