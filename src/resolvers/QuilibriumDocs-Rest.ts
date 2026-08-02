import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const quilibriumDocuments = [
	{
		number: 1,
		documentBody: 'Quilibrium protocol whitepaper and architecture reference.',
		documentCategory: 'Protocol document',
		documentStatus: 'Published',
		documentTitle: 'Quilibrium peer-to-peer MPC platform whitepaper',
	},
]

export default {
	source: Source.QuilibriumDocs_Rest,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
			},
		],
		resolveProposal: async ({ number }) => {
			const document = quilibriumDocuments.find((quilibriumDocument) => quilibriumDocument.number === number)
			if (document == null)
				throw new Error(`QuilibriumDocs_Rest: document not found ${number.toString()}`)

			return document
		},
		resolveProposalIndex: async () => quilibriumDocuments.map((document) => ({
			[EntityMetaKey.Selector]: {
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
				number: document.number,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')]: document.documentBody,
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: document.documentCategory,
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: document.documentStatus,
				[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: document.documentTitle,
			},
		})),
	}),
} satisfies RegisteredSourceResolverModule
