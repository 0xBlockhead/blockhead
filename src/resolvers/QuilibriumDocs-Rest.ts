import {
	quilibriumDocsEndpoints,
	quilibriumNodeInterfaces,
	quilibriumProtocolFacts,
	quilibriumServiceLayers,
} from '$/constants/QuilibriumNetwork.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const quilibriumDocumentRows = async () => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return [
		{
			[EntityMetaKey.Id]: {
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
				number: 1,
			},
			documentCategory: 'Protocol document',
			documentTitle: 'Quilibrium peer-to-peer MPC platform whitepaper',
			documentStatus: 'Published',
			documentBody: 'Quilibrium protocol whitepaper and architecture reference.',
		},
	]
}

export default {
	source: Source.QuilibriumDocs_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.QuilibriumNetwork,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.networkSlug !== 'quilibrium') throw new Error('QuilibriumDocs_Rest: unsupported network')
				return {
					docsEndpoints: [
						...quilibriumDocsEndpoints,
					],
					nodeInterfaces: [
						...quilibriumNodeInterfaces,
					],
					protocolFacts: [
						...quilibriumProtocolFacts,
					],
					serviceLayers: [
						...quilibriumServiceLayers,
					],
					$protocolDocument: {
						[EntityMetaKey.Id]: {
							realm: SpecificationRealm.Quilibrium,
							category: ProposalCategory.ProtocolDocument,
							number: 1,
						},
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Quilibrium || entityId.category !== ProposalCategory.ProtocolDocument) {
					throw new Error('QuilibriumDocs_Rest: proposal resolver only supports Quilibrium protocol documents')
				}
				const document = (await quilibriumDocumentRows()).find((row) => row[EntityMetaKey.Id].number === entityId.number)
				if (document == null) throw new Error(`QuilibriumDocs_Rest: document not found ${entityId.number.toString()}`)
				return document
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.QuilibriumNetwork,
			fieldName: '$protocolDocument',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.networkSlug !== 'quilibrium') throw new Error('QuilibriumDocs_Rest: unsupported network')
				return {
					[EntityMetaKey.Id]: {
						realm: SpecificationRealm.Quilibrium,
						category: ProposalCategory.ProtocolDocument,
						number: 1,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: quilibriumDocumentRows,
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Quilibrium) throw new Error('QuilibriumDocs_Rest: $$proposals only supports Quilibrium')
				return quilibriumDocumentRows()
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Quilibrium || entityId.category !== ProposalCategory.ProtocolDocument) throw new Error('QuilibriumDocs_Rest: $$proposals only supports Quilibrium protocol documents')
				return quilibriumDocumentRows()
			},
		}),
	],
}
