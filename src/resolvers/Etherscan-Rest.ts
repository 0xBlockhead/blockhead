import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	source: Source.Etherscan_Rest,

	entityResolvers: [],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId, context) => {
				const { getContractAbiJsonString } = await import('$/sources/Etherscan/Rest/queries.ts')
				const { isEtherscanRestSupportedChainId } = await import('$/sources/Etherscan/Rest/client.ts')
				const chainId = entityId.$network.chainId
				if (!isEtherscanRestSupportedChainId(chainId)) return undefined
				const abi = await singleFlight(getContractAbiJsonString)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				return abi ?? undefined
			},
		}),
	],
}
