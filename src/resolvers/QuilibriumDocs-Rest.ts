import {
	quilibriumDocsEndpoints,
	quilibriumNodeInterfaces,
	quilibriumProtocolFacts,
	quilibriumServiceLayers,
} from '$/constants/QuilibriumNetwork.ts'
import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
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

	resolvers: [
		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
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
			fields: {
			docsEndpoints: (snapshot) => snapshot.docsEndpoints,
			nodeInterfaces: (snapshot) => snapshot.nodeInterfaces,
			protocolFacts: (snapshot) => snapshot.protocolFacts,
			serviceLayers: (snapshot) => snapshot.serviceLayers,
			$protocolDocument: (snapshot) => snapshot.$protocolDocument,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposal,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Quilibrium || entityId.category !== ProposalCategory.ProtocolDocument) {
					throw new Error('QuilibriumDocs_Rest: proposal resolver only supports Quilibrium protocol documents')
				}
				const document = (await quilibriumDocumentRows()).find((quilibriumDocument) => quilibriumDocument[EntityMetaKey.Id].number === entityId.number)
				if (document == null) throw new Error(`QuilibriumDocs_Rest: document not found ${entityId.number.toString()}`)
				return document
			},
			fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}
		}),

		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				return {
					[EntityMetaKey.Id]: {
						realm: SpecificationRealm.Quilibrium,
						category: ProposalCategory.ProtocolDocument,
						number: 1,
					},
				}
			},
			fields: {
			$protocolDocument: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: quilibriumDocumentRows,
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Quilibrium) throw new Error('QuilibriumDocs_Rest: $$proposals only supports Quilibrium')
				return quilibriumDocumentRows()
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Quilibrium || entityId.category !== ProposalCategory.ProtocolDocument) throw new Error('QuilibriumDocs_Rest: $$proposals only supports Quilibrium protocol documents')
				return quilibriumDocumentRows()
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),
	],
}
