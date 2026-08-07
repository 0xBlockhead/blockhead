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
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	eip8004ScanServiceWire,
	type Eip8004ScanAgentDetail,
	type Eip8004ScanAgentListItem,
} from '$/sources/Eip8004Scan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

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

const observationTimestampMsFromWire = (row: Eip8004ScanAgentDetail) => {
	const updatedAtMs = (
		row.updated_at != null ?
			Date.parse(row.updated_at)
		:
			Number.NaN
	)
	if (Number.isFinite(updatedAtMs))
		return updatedAtMs

	const createdAtMs = (
		row.created_at != null ?
			Date.parse(row.created_at)
		:
			Number.NaN
	)
	if (Number.isFinite(createdAtMs))
		return createdAtMs

	return Date.now()
}

const assertAgentService = (value: unknown) => {
	try {
		return eip8004ScanServiceWire.assert(value)
	} catch {
		throw new Error('Eip8004Scan_Rest: invalid agent service response envelope')
	}
}

const agentDetailFromWire = (row: Eip8004ScanAgentDetail | undefined) => {
	if (row == null)
		return

	const agent = agentFromWire(row)
	const services = Object.entries(row.services ?? {}).flatMap(([wireKind, serviceWire]) => {
		const service = assertAgentService(serviceWire)
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
	})
	const contactEndpoint = (
		services
			.map((service) => service.endpointUrl)
			.find((endpoint) => endpoint !== '')
		?? row.a2a_endpoint?.trim()
		?? row.agent_url?.trim()
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

	const supportedTrust = (
		row.supported_trust_models != null && row.supported_trust_models.length > 0 ?
			row.supported_trust_models
		: row.raw_metadata?.offchain_content?.supportedTrust != null
			&& row.raw_metadata.offchain_content.supportedTrust.length > 0 ?
			row.raw_metadata.offchain_content.supportedTrust
		:
			undefined
	)
	const ownerAddress = hexLowerOfByteSize(row.owner_address ?? '', 20)
	const transactionHash = hexLowerOfByteSize(row.created_tx_hash ?? '', 32)

	return {
		...agent,
		agentUri,
		fetchedAt: observationTimestampMsFromWire(row),
		services,
		...(row.name != null && row.name !== '' && { name: row.name }),
		...(row.description != null && row.description !== '' && { description: row.description }),
		...(row.image_url != null && row.image_url !== '' && { image: row.image_url }),
		...(row.raw_metadata?.offchain_content?.type != null && {
			registrationTypeIri: row.raw_metadata.offchain_content.type,
		}),
		...(row.x402_supported != null && { x402Support: row.x402_supported }),
		...(
			row.is_active != null ?
				{ active: row.is_active }
			: row.raw_metadata?.offchain_content?.active != null ?
				{ active: row.raw_metadata.offchain_content.active }
			:
				{}
		),
		...(supportedTrust != null && { supportedTrust }),
		...(contactEndpoint != null && contactEndpoint !== '' && { contactEndpoint }),
		...(ownerAddress != null && { ownerAddress }),
		...(
			row.created_block_number != null
			&& { blockNumber: row.created_block_number }
		),
		...(transactionHash != null && { transactionHash }),
	}
}

const registrationSelector = ({
	namespace,
	chainId,
	identityRegistry,
	agentId,
}: {
	namespace: string
	chainId: number
	identityRegistry: `0x${string}`
	agentId: string
}) => ({
	namespace,
	chainId,
	identityRegistry,
	agentId,
})

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

						const { fetchAgentDetail } = await import('$/sources/Eip8004Scan/Rest/queries.ts')
						const detail = agentDetailFromWire(
							await fetchAgentDetail(
								{
									chainId,
									tokenId: agentId,
								}
							)
						)
						if (detail == null)
							throw new Error('Eip8004Scan_Rest: agent registration not found')
						if (
							detail.chainId !== chainId
							|| detail.contractAddress !== identityRegistry.toLowerCase()
							|| detail.tokenId !== agentId
						)
							throw new Error('Eip8004Scan_Rest: response registration does not match request')

						const $registration = registrationSelector({
							namespace,
							chainId,
							identityRegistry,
							agentId,
						})

						return {
							...$registration,
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
							$$files: [{
								[EntityMetaKey.Selector]: {
									$registration,
									fileUrl: detail.agentUri,
								},
							}],
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$registration,
									timestampMs: detail.fetchedAt,
									source: Source.Eip8004Scan_Rest,
								},
							}],
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
			$$files: (registration) => registration.$$files,
			$$timestamps: (registration) => registration.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.Eip8004AgentRegistration_Timestamp,
			resolve: {
				RegistrationTimestampMsSource: {
					resolve: async ({
						$registration,
					}) => {
						const {
							namespace,
							chainId,
							identityRegistry,
							agentId,
						} = $registration
						if (namespace !== 'eip155')
							throw new Error('Eip8004Scan_Rest: unsupported registration observation namespace')
						if (!Number.isSafeInteger(chainId) || chainId <= 0)
							throw new Error('Eip8004Scan_Rest: invalid registration observation chain ID')

						const { fetchAgentDetail } = await import('$/sources/Eip8004Scan/Rest/queries.ts')
						const detail = agentDetailFromWire(
							await fetchAgentDetail(
								{
									chainId,
									tokenId: agentId,
								}
							)
						)
						if (detail == null)
							throw new Error('Eip8004Scan_Rest: registration observation agent not found')
						if (
							detail.chainId !== chainId
							|| detail.contractAddress !== identityRegistry.toLowerCase()
							|| detail.tokenId !== agentId
						)
							throw new Error('Eip8004Scan_Rest: registration observation does not match request')

						return {
							agentUri: detail.agentUri,
							...(detail.ownerAddress != null && {
								ownerAddress: EvmAddress.assert(detail.ownerAddress),
							}),
							...(detail.agentWallet != null && {
								agentWalletAddress: EvmAddress.assert(detail.agentWallet),
							}),
							...(detail.active != null && { active: detail.active }),
							...(detail.blockNumber != null && { blockNumber: detail.blockNumber }),
							...(detail.transactionHash != null && {
								transactionHash: ZeroExHex.assert(detail.transactionHash),
							}),
						}
					},
				},
			},
		})({
			agentUri: (observation) => observation.agentUri,
			ownerAddress: (observation) => observation.ownerAddress,
			agentWalletAddress: (observation) => observation.agentWalletAddress,
			active: (observation) => observation.active,
			blockNumber: (observation) => observation.blockNumber,
			transactionHash: (observation) => observation.transactionHash,
		}),

		defineResolver({
			entityType: EntityType.Eip8004AgentRegistrationFile,
			resolve: {
				RegistrationFileUrl: {
					resolve: async ({
						$registration,
						fileUrl,
					}) => {
						const {
							namespace,
							chainId,
							identityRegistry,
							agentId,
						} = $registration
						if (namespace !== 'eip155')
							throw new Error('Eip8004Scan_Rest: unsupported registration file namespace')
						if (!Number.isSafeInteger(chainId) || chainId <= 0)
							throw new Error('Eip8004Scan_Rest: invalid registration file chain ID')

						const { fetchAgentDetail } = await import('$/sources/Eip8004Scan/Rest/queries.ts')
						const detail = agentDetailFromWire(
							await fetchAgentDetail(
								{
									chainId,
									tokenId: agentId,
								}
							)
						)
						if (detail == null)
							throw new Error('Eip8004Scan_Rest: registration file agent not found')
						if (
							detail.chainId !== chainId
							|| detail.contractAddress !== identityRegistry.toLowerCase()
							|| detail.tokenId !== agentId
							|| detail.agentUri !== fileUrl
						)
							throw new Error('Eip8004Scan_Rest: registration file does not match request')

						return {
							$registration,
							fileUrl,
						}
					},
				},
			},
		})({
			$registration: (file) => ({
				[EntityMetaKey.Selector]: file.$registration,
			}),
			fileUrl: (file) => file.fileUrl,
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

						const { fetchAgentDetail } = await import('$/sources/Eip8004Scan/Rest/queries.ts')
						const detail = agentDetailFromWire(
							await fetchAgentDetail(
								{
									chainId,
									tokenId: agentId,
								}
							)
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
						const { fetchAgentDetail } = await import('$/sources/Eip8004Scan/Rest/queries.ts')
						const detail = agentDetailFromWire(
							await fetchAgentDetail(
								{
									chainId,
									tokenId,
								}
							)
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
						const { fetchAgentList } = await import('$/sources/Eip8004Scan/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await fetchAgentList(
							{ limit }
						)

						return {
							totalCount: response.meta.pagination.total,
							$$eip8004Services: response.data.flatMap((row) => {
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
							}),
						}
					},
				},
			},
		})({
				$$eip8004Services: {
					select: (snapshot) => snapshot.$$eip8004Services,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			}),
	],
} satisfies RegisteredSourceResolverModule
