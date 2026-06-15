import {
	quilibriumDocsEndpoints,
	quilibriumNodeInterfaces,
	quilibriumProtocolFacts,
	quilibriumServiceLayers,
} from '$/constants/QuilibriumNetwork.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { QuilibriumNetworkSelector } from '$/schema/QuilibriumNetwork.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'

const quilibriumDocumentRows = async () => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return [
		{
			[EntityMetaKey.Selector]: {
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
		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async (entitySelector) => {
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
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Quilibrium,
							category: ProposalCategory.ProtocolDocument,
							number: 1,
						},
					},
				}
			}
			}
		})({
				fields: {
			docsEndpoints: (snapshot) => snapshot.docsEndpoints,
			nodeInterfaces: (snapshot) => snapshot.nodeInterfaces,
			protocolFacts: (snapshot) => snapshot.protocolFacts,
			serviceLayers: (snapshot) => snapshot.serviceLayers,
			$protocolDocument: (snapshot) => snapshot.$protocolDocument,
		},
			}),

		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Quilibrium || category !== ProposalCategory.ProtocolDocument) {
					throw new Error('QuilibriumDocs_Rest: proposal resolver only supports Quilibrium protocol documents')
				}
				const document = (await quilibriumDocumentRows()).find((quilibriumDocument) => quilibriumDocument[EntityMetaKey.Selector].number === number)
				if (document == null) throw new Error(`QuilibriumDocs_Rest: document not found ${number.toString()}`)
				return document
			}
			}
		})({
				fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		},
			}),

		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.Slug]: async (entitySelector) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				return {
					[EntityMetaKey.Selector]: {
						realm: SpecificationRealm.Quilibrium,
						category: ProposalCategory.ProtocolDocument,
						number: 1,
					},
				}
			}
			}
		})({
				fields: {
			$protocolDocument: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: quilibriumDocumentRows
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Quilibrium) throw new Error('QuilibriumDocs_Rest: $$proposals only supports Quilibrium')
				return quilibriumDocumentRows()
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.QuilibriumDocs_Rest, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Quilibrium || category !== ProposalCategory.ProtocolDocument) throw new Error('QuilibriumDocs_Rest: $$proposals only supports Quilibrium protocol documents')
				return quilibriumDocumentRows()
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}
