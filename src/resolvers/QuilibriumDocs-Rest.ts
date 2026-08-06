import { networkBySlug } from '$/constants/Network.ts'
import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	type RegisteredSourceResolverModule,
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.QuilibriumDocs_Rest,

	resolvers: [
		...defineSpecificationProposalResolvers({
			appliesTo: [
				{
					realm: SpecificationRealm.Quilibrium,
					category: ProposalCategory.ProtocolDocument,
				},
			],
			resolveProposal: async ({ number }) => {
				const { getProtocolDocument } = await import('$/sources/QuilibriumDocs/Rest/queries.ts')
				return getProtocolDocument({ number })
			},
			resolveProposalIndex: async () => {
				const { listProtocolDocuments } = await import('$/sources/QuilibriumDocs/Rest/queries.ts')
				return listProtocolDocuments().map((document) => ({
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
				}))
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [{ slug: networkBySlug.quilibrium.slug }],
					resolve: async () => {
						const {
							getDocsEndpoints,
							getNodeInterfaces,
							getPrimaryProtocolDocument,
							getProtocolFacts,
							getServiceLayers,
						} = await import('$/sources/QuilibriumDocs/Rest/queries.ts')
						const networkSlug = networkBySlug.quilibrium.slug

						return {
							docsEndpoints: getDocsEndpoints(),
							nodeInterfaces: getNodeInterfaces({ networkSlug }),
							protocolFacts: getProtocolFacts({ networkSlug }),
							serviceLayers: getServiceLayers({ networkSlug }),
							protocolDocumentNumber: getPrimaryProtocolDocument().number,
						}
					},
				},
			},
		})({
			Quilibrium: {
				docsEndpoints: (snapshot) => snapshot.docsEndpoints,
				nodeInterfaces: (snapshot) => snapshot.nodeInterfaces,
				protocolFacts: (snapshot) => snapshot.protocolFacts,
				serviceLayers: (snapshot) => snapshot.serviceLayers,
				$protocolDocument: (snapshot) => ({
					[EntityMetaKey.Selector]: {
						realm: SpecificationRealm.Quilibrium,
						category: ProposalCategory.ProtocolDocument,
						number: snapshot.protocolDocumentNumber,
					},
				}),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
