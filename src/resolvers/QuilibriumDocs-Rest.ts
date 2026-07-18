import {
	ProposalCategory as OwnedProposalCategory,
	SpecificationRealm as OwnedSpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	quilibriumNodeInterfaces,
	quilibriumProtocolFacts,
	quilibriumServiceLayers,
} from '$/constants/QuilibriumNetwork.ts'
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

const quilibriumDocumentRows = async () => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return [
		{
			[EntityMetaKey.Selector]: {
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
				number: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: 'Protocol document',
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: 'Quilibrium peer-to-peer MPC platform whitepaper',
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: 'Published',
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')]: 'Quilibrium protocol whitepaper and architecture reference.',
			},
		},
	]
}

export default {
	source: Source.QuilibriumDocs_Rest,

	resolvers: [
		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: {
					appliesTo: [
						{
							realm: OwnedSpecificationRealm.Quilibrium,
							category: OwnedProposalCategory.ProtocolDocument,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
						if (realm !== SpecificationRealm.Quilibrium || category !== ProposalCategory.ProtocolDocument)
							throw new Error('QuilibriumDocs_Rest: proposal resolver only supports Quilibrium protocol documents')
						const document = (await quilibriumDocumentRows()).find((quilibriumDocument) => quilibriumDocument[EntityMetaKey.Selector].number === number)
						if (document == null) throw new Error(`QuilibriumDocs_Rest: document not found ${number.toString()}`)
						return {
							documentCategory: document[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')],
							documentTitle: document[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')],
							documentStatus: document[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')],
							documentBody: document[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')],
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

		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: {
					resolve: quilibriumDocumentRows,
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
}
