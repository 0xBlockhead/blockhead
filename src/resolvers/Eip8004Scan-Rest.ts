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
import { _GlobalSelector } from '$/schema/_Global.ts'
import { EvmNftSelector } from '$/schema/EvmNft.ts'

export default {
	source: Source.Eip8004Scan_Rest,

	resolvers: [
		defineResolver(Source.Eip8004Scan_Rest, {
			entityType: EntityType.EvmNft,
			resolve: {
				[EvmNftSelector.EvmContractTokenId]: async ({ $contract, tokenId }) => {
					const { fetchAgentDetail } = await import(
						'$/sources/Eip8004Scan/Rest/queries.ts'
					)
					const detail = await fetchAgentDetail({
						chainId: Number($contract.$network.caip2.reference),
						tokenId,
					})
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
			}
		})({
				standard: (snapshot) => snapshot.standard,
				format: (snapshot) => snapshot.format,
				tokenUri: (snapshot) => snapshot.tokenUri,
				agentRegistry: (snapshot) => snapshot.agentRegistry,
				agentId: (snapshot) => snapshot.agentId,
				agentUri: (snapshot) => snapshot.agentUri,
				fetchedAt: (snapshot) => snapshot.fetchedAt,
				$agentWallet: (snapshot) => snapshot.$agentWallet,
				name: (snapshot) => snapshot.name,
				description: (snapshot) => snapshot.description,
				image: (snapshot) => snapshot.image,
				registrationTypeIri: (snapshot) => snapshot.registrationTypeIri,
				x402Support: (snapshot) => snapshot.x402Support,
				active: (snapshot) => snapshot.active,
				supportedTrust: (snapshot) => snapshot.supportedTrust,
				contactEndpoint: (snapshot) => snapshot.contactEndpoint,
			}),

		defineResolver(Source.Eip8004Scan_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_entitySelector, context) => {
					const { fetchAgentList } = await import(
						'$/sources/Eip8004Scan/Rest/queries.ts'
					)
					const limit = resolverContextRowLimit(context)
					const agents = await fetchAgentList({ limit })
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
		})({
				$$eip8004Services: (snapshot) => snapshot,
			}),
	],
}
