import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
export default {
	source: Source.Eip8004Scan_Rest,

	resolvers: [
		defineResolver(Source.Eip8004Scan_Rest, {
			entityType: EntityType.Eip8004AgentRegistration,
			resolve: {
				NamespaceChainIdIdentityRegistryAgentId: {
					resolve: async ({
						namespace,
						chainId,
						identityRegistry,
						agentId,
					}) => {
						if (namespace !== 'eip155')
							throw new Error('Eip8004Scan_Rest: unsupported registration namespace')
						if (!Number.isSafeInteger(chainId) || chainId <= 0)
							throw new Error('Eip8004Scan_Rest: invalid registration chain ID')

						const { fetchAgentDetail } = await import(
							'$/sources/Eip8004Scan/Rest/queries.ts'
						)
						const detail = await fetchAgentDetail(
							{
								chainId,
								tokenId: agentId,
							}
						)
						if (detail == null)
							throw new Error('Eip8004Scan_Rest: agent registration not found')
						if (
							detail.chainId !== chainId
							|| detail.contractAddress !== identityRegistry.toLowerCase()
							|| detail.tokenId !== agentId
						)
							throw new Error('Eip8004Scan_Rest: response registration does not match request')

						return {
							namespace,
							chainId,
							identityRegistry,
							agentId,
							$evmNft: {
								[EntityMetaKey.Selector]: {
									$contract: {
										$network: {
											caip2: {
												namespace: 'eip155' as const,
												reference: String(chainId),
											},
										},
										address: identityRegistry,
									},
									tokenId: agentId,
								},
							},
						}
					},
				},
			},
		})({
			namespace: (registration) => registration.namespace,
			chainId: (registration) => registration.chainId,
			identityRegistry: (registration) => registration.identityRegistry,
			agentId: (registration) => registration.agentId,
			$evmNft: (registration) => registration.$evmNft,
		}),

		defineResolver(Source.Eip8004Scan_Rest, {
			entityType: EntityType.Eip8004AgentServiceEndpoint,
			resolve: {
				RegistrationFileEndpointKindEndpointUrl: {
					resolve: async ({
						$registrationFile,
						endpointKind,
						endpointUrl,
					}) => {
						const {
							namespace,
							chainId,
							identityRegistry,
							agentId,
						} = $registrationFile.$registration
						if (namespace !== 'eip155')
							throw new Error('Eip8004Scan_Rest: unsupported service endpoint namespace')
						if (!Number.isSafeInteger(chainId) || chainId <= 0)
							throw new Error('Eip8004Scan_Rest: invalid service endpoint chain ID')

						const { fetchAgentDetail } = await import(
							'$/sources/Eip8004Scan/Rest/queries.ts'
						)
						const detail = await fetchAgentDetail(
							{
								chainId,
								tokenId: agentId,
							}
						)
						if (detail == null)
							throw new Error('Eip8004Scan_Rest: service endpoint registration not found')
						if (
							detail.chainId !== chainId
							|| detail.contractAddress !== identityRegistry.toLowerCase()
							|| detail.tokenId !== agentId
							|| detail.agentUri !== $registrationFile.fileUrl
						)
							throw new Error('Eip8004Scan_Rest: service endpoint registration does not match request')

						const service = detail.services.find((candidate) => (
							candidate.endpointKind === endpointKind
							&& candidate.endpointUrl === endpointUrl
						))
						if (service == null)
							throw new Error('Eip8004Scan_Rest: service endpoint not found')

						return {
							$registrationFile,
							...service,
						}
					},
				},
			},
		})({
			$registrationFile: (endpoint) => endpoint.$registrationFile,
			endpointKind: (endpoint) => endpoint.endpointKind,
			endpointUrl: (endpoint) => endpoint.endpointUrl,
			name: (endpoint) => endpoint.name,
			version: (endpoint) => endpoint.version,
			protocolKind: (endpoint) => endpoint.protocolKind,
			active: (endpoint) => endpoint.active,
		}),

		defineResolver(Source.Eip8004Scan_Rest, {
			entityType: EntityType.EvmNft,
			resolve: {
				EvmContractTokenId: {
					resolve: async ({ $contract, tokenId }) => {
						const { fetchAgentDetail } = await import(
							'$/sources/Eip8004Scan/Rest/queries.ts'
						)
						const detail = await fetchAgentDetail(
							{
								chainId: Number($contract.$network.caip2.reference),
								tokenId,
							}
						)
						if (detail == null) {
							throw new Error(
								`Eip8004Scan_Rest: agent ${$contract.$network.caip2.reference}/${tokenId} not found`
							)
						}
						if (detail.contractAddress !== $contract.address.toLowerCase()) {
							throw new Error(
								`Eip8004Scan_Rest: agent ${$contract.$network.caip2.reference}/${$contract.address}/${tokenId} not found`
							)
						}
						return {
							standard: EvmNftStandard.Erc721,
							format: EvmNftFormat.Eip8004Registration,
							tokenUri: detail.agentUri,
							agentRegistry: `eip155:${String(detail.chainId)}:${detail.contractAddress}`,
							agentId: detail.tokenId,
							agentUri: detail.agentUri,
							fetchedAt: detail.fetchedAt,
							...(detail.agentWallet != null && {
								$agentWallet: {
									[EntityMetaKey.Selector]: {
										address: EvmAddress.assert(detail.agentWallet),
									},
								},
							}),
							...(detail.name != null && { name: detail.name }),
							...(detail.description != null && { description: detail.description }),
							...(detail.image != null && { image: detail.image }),
							...(detail.registrationTypeIri != null && {
								registrationTypeIri: detail.registrationTypeIri,
							}),
							...(detail.x402Support != null && { x402Support: detail.x402Support }),
							...(detail.active != null && { active: detail.active }),
							...(detail.supportedTrust != null && { supportedTrust: detail.supportedTrust }),
							...(detail.contactEndpoint != null && { contactEndpoint: detail.contactEndpoint }),
						}
					},
				},
			}
		})({
				standard: (snapshot) => snapshot.standard,
				format: (snapshot) => snapshot.format,
				tokenUri: (snapshot) => snapshot.tokenUri,
				name: (snapshot) => snapshot.name,
				description: (snapshot) => snapshot.description,
				image: (snapshot) => snapshot.image,
				active: (snapshot) => snapshot.active,
				Eip8004Registration: {
					agentRegistry: (snapshot) => snapshot.agentRegistry,
					agentId: (snapshot) => snapshot.agentId,
					agentUri: (snapshot) => snapshot.agentUri,
					fetchedAt: (snapshot) => snapshot.fetchedAt,
					$agentWallet: (snapshot) => snapshot.$agentWallet,
					registrationTypeIri: (snapshot) => snapshot.registrationTypeIri,
					x402Support: (snapshot) => snapshot.x402Support,
					supportedTrust: (snapshot) => snapshot.supportedTrust,
					contactEndpoint: (snapshot) => snapshot.contactEndpoint,
				},
			}),

		defineResolver(Source.Eip8004Scan_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { fetchAgentList } = await import(
							'$/sources/Eip8004Scan/Rest/queries.ts'
						)
						const limit = resolverContextRowLimit(context)
						const agents = await fetchAgentList(
							{ limit }
						)
						return (
							agents.map((agent) => ({
								[EntityMetaKey.Selector]: {
									$contract: {
										$network: {
											caip2: { namespace: 'eip155' as const, reference: String(agent.chainId) },
										},
										address: EvmAddress.assert(agent.contractAddress),
									},
									tokenId: agent.tokenId,
								},
							}))
						)
					},
				},
			},
		})({
				$$eip8004Services: (snapshot) => snapshot,
			}),
	],
}
