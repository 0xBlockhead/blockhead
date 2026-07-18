import {
	ProposalCategory as OwnedProposalCategory,
	SpecificationRealm as OwnedSpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'

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
		[EntityMetaKey.Selector]: {
			realm: SpecificationRealm.Hyperliquid,
			category: ProposalCategory.Hip,
			number: hyperliquidHip.number,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: 'HIP',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: hyperliquidHip.title,
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: 'Documented',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')]: `HIP-${hyperliquidHip.number.toString()}: ${hyperliquidHip.title}`,
		},
	}))
}

export default {
	source: Source.HyperliquidDocs_Rest,

	resolvers: [
		defineResolver(Source.HyperliquidDocs_Rest, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: {
					appliesTo: [
						{
							realm: OwnedSpecificationRealm.Hyperliquid,
							category: OwnedProposalCategory.Hip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
						if (realm !== SpecificationRealm.Hyperliquid || category !== ProposalCategory.Hip) {
							throw new Error('HyperliquidDocs_Rest: proposal resolver only supports Hyperliquid HIPs')
						}
						const proposal = (await hyperliquidHipRows()).find((hyperliquidHip) => hyperliquidHip[EntityMetaKey.Selector].number === number)
						if (proposal == null) throw new Error(`HyperliquidDocs_Rest: HIP not found ${number.toString()}`)
						return proposal
					},
				},
			},
		})({
				documentCategory: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')],
				documentTitle: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')],
				documentStatus: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')],
				documentBody: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')],
			}),

		defineResolver(Source.HyperliquidDocs_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: {
					resolve: hyperliquidHipRows,
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
}
