import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const lotusRpcUrl = 'http://127.0.0.1:1234/rpc/v1'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertFilecoinMainnet = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'fil' || network.caip2.reference !== 'f') {
		throw new Error('Lotus_JsonRpc: unsupported network')
	}
}

const sectorRows = async (entityId: {
	$network: NetworkId
	minerAddress: string
}) => {
	assertFilecoinMainnet(entityId.$network)
	const { stateMinerSectors } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	return (await stateMinerSectors({
		rpcUrl: lotusRpcUrl,
		minerAddress: entityId.minerAddress,
	})).map((sector) => ({
		[EntityMetaKey.Id]: {
			$miner: entityId,
			sectorNumber: BigInt(sector.SectorNumber),
		},
		...(sector.SealedCID != null && {
			sealedCid: sector.SealedCID['/'],
		}),
		activationEpoch: BigInt(sector.Activation),
		expirationEpoch: BigInt(sector.Expiration),
	}))
}

export default {
	source: Source.Lotus_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FilecoinSector,
			resolve: async (entityId) => {
				const row = (await sectorRows(entityId.$miner)).find((sector) => (
					sector[EntityMetaKey.Id].sectorNumber === entityId.sectorNumber
				))
				if (row == null) throw new Error(`Lotus_JsonRpc: sector not found for ${entityId.$miner.minerAddress}:${entityId.sectorNumber.toString()}`)
				return row
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FilecoinMiner,
			fieldName: '$$sectors',
			resolve: async (entityId, context) => (
				(await sectorRows(entityId)).slice(
					0,
					resolverLoadSubsetRowLimit(context),
				)
			),
		}),
	],
}
