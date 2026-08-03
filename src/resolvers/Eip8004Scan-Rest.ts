import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector } from '$/resolvers/evm.ts'
import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	Eip8004ScanAgentDetail,
	Eip8004ScanAgentListItem,
} from '$/sources/Eip8004Scan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const loadEip8004ScanQueries = () => import('$/sources/Eip8004Scan/Rest/queries.ts')

const agentFromWire = (row: Eip8004ScanAgentListItem) => {
	const tokenId = row.token_id.trim()
	const contractAddress = hexLowerOfByteSize(row.contract_address, 20)
	const agentWallet = hexLowerOfByteSize(row.agent_wallet ?? '', 20)
	if (tokenId === '' || contractAddress == null)
		return

	return {
		chainId: row.chain_id,
		tokenId,
		contractAddress,
		...(agentWallet != null && { agentWallet }),
	}
}

const agentDetailFromWire = (row: Eip8004ScanAgentDetail | undefined) => {
	if (row == null)
		return

	const agent = agentFromWire(row)
	const contactEndpoint = (
		Object.values(row.services ?? {})
			.map((service) => service.endpoint?.trim())
			.find((endpoint) => endpoint != null && endpoint !== '')
	)
	const offchainUri = row.raw_metadata?.offchain_uri?.trim()
	const agentUri = (
		offchainUri != null && offchainUri !== '' ?
			offchainUri
		:
			contactEndpoint
	)
	if (agent == null || agentUri == null)
		return

	return {
		...agent,
		agentUri,
		fetchedAt: Date.now(),
		services: Object.entries(row.services ?? {}).flatMap(([wireKind, service]) => {
			const endpointKind = wireKind.trim()
			const endpointUrl = service.endpoint?.trim()
			if (endpointKind === '' || endpointUrl == null || endpointUrl === '')
				return []

			return [{
				endpointKind,
				endpointUrl,
				...(service.name != null && service.name.trim() !== '' && {
					name: service.name.trim(),
				}),
				...(service.version != null && service.version.trim() !== '' && {
					version: service.version.trim(),
				}),
				...(service.protocol != null && service.protocol.trim() !== '' && {
					protocolKind: service.protocol.trim(),
				}),
				...(service.active != null && { active: service.active }),
			}]
		}),
		...(row.name != null && row.name !== '' && { name: row.name }),
		...(row.description != null && row.description !== '' && { description: row.description }),
		...(row.image_url != null && row.image_url !== '' && { image: row.image_url }),
		...(row.raw_metadata?.offchain_content?.type != null && {
			registrationTypeIri: row.raw_metadata.offchain_content.type,
		}),
		...(row.x402_supported != null && { x402Support: row.x402_supported }),
		...(row.is_active != null && { active: row.is_active }),
		...(row.supported_trust_models != null && row.supported_trust_models.length > 0 && {
			supportedTrust: row.supported_trust_models,
		}),
		...(contactEndpoint != null && { contactEndpoint }),
	}
}

export default {
	source: Source.Eip8004Scan_Rest,

	resolvers: [
		defineResolver({
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

						const { fetchAgentDetail } = await loadEip8004ScanQueries()
						const detail = agentDetailFromWire(
							(await fetchAgentDetail(
								{
									chainId,
									tokenId: agentId,
								}
							)).data
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

		defineResolver({
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

						const { fetchAgentDetail } = await loadEip8004ScanQueries()
						const detail = agentDetailFromWire(
							(await fetchAgentDetail(
								{
									chainId,
									tokenId: agentId,
								}
							)).data
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
			$registrationFile: (endpoint) => ({
				[EntityMetaKey.Selector]: endpoint.$registrationFile,
			}),
			endpointKind: (endpoint) => endpoint.endpointKind,
			endpointUrl: (endpoint) => endpoint.endpointUrl,
			name: (endpoint) => endpoint.name,
			version: (endpoint) => endpoint.version,
			protocolKind: (endpoint) => endpoint.protocolKind,
			active: (endpoint) => endpoint.active,
		}),

		defineResolver({
			entityType: EntityType.EvmNft,
			resolve: {
				EvmContractTokenId: {
					resolve: async ({ $contract, tokenId }) => {
						const chainId = evmChainIdFromNetworkSelector($contract.$network)
						const { fetchAgentDetail } = await loadEip8004ScanQueries()
						const detail = agentDetailFromWire(
							(await fetchAgentDetail(
								{
									chainId,
									tokenId,
								}
							)).data
						)
						if (detail == null) {
							throw new Error(
								`Eip8004Scan_Rest: agent ${chainId}/${tokenId} not found`
							)
						}
						if (detail.contractAddress !== $contract.address.toLowerCase()) {
							throw new Error(
								`Eip8004Scan_Rest: agent ${chainId}/${$contract.address}/${tokenId} not found`
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

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { fetchAgentList } = await loadEip8004ScanQueries()
						const limit = resolverContextRowLimit(context)
						return (
							(await fetchAgentList(
								{ limit }
							)).data?.flatMap((row) => {
								const agent = agentFromWire(row)
								return (
									agent == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$contract: {
													$network: {
														caip2: {
															namespace: 'eip155' as const,
															reference: String(agent.chainId),
														},
													},
													address: EvmAddress.assert(agent.contractAddress),
												},
												tokenId: agent.tokenId,
											},
										}]
								)
							}) ?? []
						)
					},
				},
			},
		})({
				$$eip8004Services: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule
