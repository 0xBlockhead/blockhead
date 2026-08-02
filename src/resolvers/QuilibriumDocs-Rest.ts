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
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const quilibriumDocuments = [
	{
		number: 1,
		documentCategory: 'Protocol document',
		documentTitle: 'Quilibrium peer-to-peer MPC platform whitepaper',
		documentStatus: 'Published',
		documentBody: 'Quilibrium protocol whitepaper and architecture reference.',
	},
]

export default {
	source: Source.QuilibriumDocs_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Quilibrium,
							category: ProposalCategory.ProtocolDocument,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.Quilibrium || category !== ProposalCategory.ProtocolDocument)
							throw new Error('QuilibriumDocs_Rest: proposal resolver only supports Quilibrium protocol documents')
						const document = quilibriumDocuments.find((quilibriumDocument) => quilibriumDocument.number === number)
						if (document == null) throw new Error(`QuilibriumDocs_Rest: document not found ${number.toString()}`)
						return document
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
					resolve: async () => quilibriumDocuments.map((document) => ({
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Quilibrium,
							category: ProposalCategory.ProtocolDocument,
							number: document.number,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: document.documentCategory,
							[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: document.documentTitle,
							[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: document.documentStatus,
							[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')]: document.documentBody,
						},
					})),
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule
