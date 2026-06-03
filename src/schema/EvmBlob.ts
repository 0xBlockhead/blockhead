import { type } from 'arktype'

// EIP-4844-style execution blob sidecar: versioned commitment tied to a blob tx hash, not contract storage or IPFS blobs.
import { ZeroExHex } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

const EvmBlobVersionedHash = type(
	'/^0x01[0-9a-fA-F]{62}$/' as type.cast<`0x01${string}`>,
)

const EvmBlobStorageReference = type({
	storage: 'string',
	reference: 'string',
})

export default {
	entityType: EntityType.EvmBlob,

	label: 'EVM blob',
	labelPlural: 'EVM blobs',

	id: type({
		$network: Network.id,
		txHash: ZeroExHex,
		blobIndex: 'number',
	}),

	fields: [
		{
			name: 'versionedHash',
			type: EntityFieldType.Primitive,
			primitiveType: EvmBlobVersionedHash,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'kzgCommitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blobscan_Rest,
			],
		},
		{
			name: 'blobDataStorageReferences',
			type: EntityFieldType.Primitive,
			primitiveType: EvmBlobStorageReference.array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blobscan_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
