import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
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

export default {
	source: Source.HyperliquidDocs_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Hyperliquid,
							category: ProposalCategory.Hip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.Hyperliquid || category !== ProposalCategory.Hip)
							throw new Error('HyperliquidDocs_Rest: proposal resolver only supports Hyperliquid HIPs')

						const proposal = hyperliquidHips.find((hyperliquidHip) => hyperliquidHip.number === number)
						if (proposal == null)
							throw new Error(`HyperliquidDocs_Rest: HIP not found ${number.toString()}`)

						return {
							documentCategory: 'HIP',
							documentTitle: proposal.title,
							documentStatus: 'Documented',
							documentBody: `HIP-${proposal.number.toString()}: ${proposal.title}`,
						}
					},
				},
			},
		})({
				documentCategory: (snapshot) => snapshot.documentCategory,
				documentTitle: (snapshot) => snapshot.documentTitle,
				documentStatus: (snapshot) => snapshot.documentStatus,
				documentBody: (snapshot) => snapshot.documentBody,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => hyperliquidHips.map(({ number }) => ({
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Hyperliquid,
							category: ProposalCategory.Hip,
							number,
						},
					})),
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule
