import { networkBySlug } from '$/constants/Network.ts'
import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import { TransportType } from '$/constants/TransportType.ts'
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
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'
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

	resolvers: [
		...defineSpecificationProposalResolvers({
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [{ slug: networkBySlug.quilibrium.slug }],
					resolve: async () => {
						const {
							quilibriumNodeInterfaces,
							quilibriumProtocolFacts,
							quilibriumServiceLayers,
						} = await import('$/constants/QuilibriumNetwork.ts')
						const bindings = (await import('$/sources/QuilibriumDocs/bindings.ts')).default

						return {
							docsEndpoints: bindings[Source.QuilibriumDocs_Rest]
								.flatMap((binding) => binding.endpoints)
								.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
								.map((endpoint) => ({
									url: endpoint.locator,
									transportType: TransportType.Http,
									providerName: 'Quilibrium docs',
								})),
							nodeInterfaces: quilibriumNodeInterfaces,
							protocolFacts: quilibriumProtocolFacts,
							serviceLayers: quilibriumServiceLayers,
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
				$protocolDocument: () => ({
					[EntityMetaKey.Selector]: {
						realm: SpecificationRealm.Quilibrium,
						category: ProposalCategory.ProtocolDocument,
						number: quilibriumDocuments[0].number,
					},
				}),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
