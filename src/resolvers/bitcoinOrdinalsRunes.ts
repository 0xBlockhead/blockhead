import { BitcoinProtocolId } from '$/constants/BitcoinProtocol.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import {
	decodeRunestonePayload,
	type BitcoinOrdinalsProtocolPayload,
	type BitcoinProtocolPayload,
	type BitcoinRunesProtocolPayload,
} from '$/sources/BitcoinCore/JsonRpc/protocol.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type UtxoTransactionId = EntitySelector<typeof schema, EntityType.UtxoTransaction>

const bitcoinInscriptionId = (
	txId: string,
	inscriptionIndex: number
) => `${txId}i${inscriptionIndex}`

export const parseBitcoinInscriptionId = (
	inscriptionId: string
) => {
	const separator = inscriptionId.lastIndexOf('i')
	if (separator <= 0 || separator === inscriptionId.length - 1)
		return undefined

	const txId = inscriptionId.slice(0, separator)
	const inscriptionIndex = Number(inscriptionId.slice(separator + 1))
	if (
		txId.length < 1
		|| !/^[0-9a-fA-F]+$/.test(txId)
		|| !Number.isSafeInteger(inscriptionIndex)
		|| inscriptionIndex < 0
	)
		return undefined

	return {
		txId,
		inscriptionIndex,
	}
}

export const ordinalsPayloads = (
	payloads: BitcoinProtocolPayload[]
) => (
	payloads.filter((payload): payload is BitcoinOrdinalsProtocolPayload => (
		payload.protocol === BitcoinProtocolId.Ordinals
	))
)

export const runestonePayload = (
	payloads: BitcoinProtocolPayload[]
) => (
	payloads.find((payload): payload is BitcoinRunesProtocolPayload => (
		payload.protocol === BitcoinProtocolId.Runes
	))
)

export const bitcoinOrdinalInscriptionRefsFromPayloads = (
	$network: NetworkId,
	payloads: BitcoinProtocolPayload[]
) => (
	ordinalsPayloads(payloads)
		.map((payload, inscriptionIndex) => ({
			[EntityMetaKey.Selector]: {
				$network,
				inscriptionId: bitcoinInscriptionId(payload.transactionId, inscriptionIndex),
			},
		}))
)

export const bitcoinRunestoneRefFromPayloads = (
	$transaction: UtxoTransactionId,
	payloads: BitcoinProtocolPayload[]
) => {
	const runestone = runestonePayload(payloads)
	return runestone == null ?
		undefined
	:
		{
			[EntityMetaKey.Selector]: {
				$transaction,
				outputIndex: runestone.location.outputIndex,
			},
		}
}

export const bitcoinOrdinalInscriptionSnapshotFromPayload = (
	$network: NetworkId,
	inscriptionId: string,
	inscriptionIndex: number,
	payload: BitcoinOrdinalsProtocolPayload
) => ({
	inscriptionId,
	inscriptionIndex,
	$revealTransaction: {
		[EntityMetaKey.Selector]: {
			$network,
			txId: payload.transactionId,
		},
	},
	revealInputIndex: payload.location.inputIndex,
	revealWitnessIndex: payload.location.witnessIndex,
	...(payload.contentType != null && {
		contentType: payload.contentType,
	}),
	...(payload.bodyHex != null && {
		bodyHex: payload.bodyHex,
	}),
	payloadHex: payload.payloadHex,
})

export const bitcoinRunestoneSnapshotFromPayload = (
	$transaction: UtxoTransactionId,
	payload: BitcoinRunesProtocolPayload
) => ({
	outputIndex: payload.location.outputIndex,
	$output: {
		[EntityMetaKey.Selector]: {
			$transaction,
			indexInTransaction: payload.location.outputIndex,
		},
	},
	payloadHex: payload.payloadHex,
	isCenotaph: decodeRunestonePayload(payload.payloadHex, {
		scriptIsCenotaph: payload.isCenotaph,
	}).isCenotaph,
})

export const bitcoinOrdinalInscriptionRefsFromUtxoInscriptions = (
	$network: NetworkId,
	inscriptions: readonly {
		inscriptionId: string
		inscriptionNumber?: number
		contentType?: string
		offset?: number
		utxo?: {
			txid: string
			vout: number
			address?: string
			satoshi?: number
			scriptPk?: string
			scriptType?: string
		}
	}[]
) => (
	inscriptions.map((inscription) => {
		const parsed = parseBitcoinInscriptionId(inscription.inscriptionId)
		return {
			[EntityMetaKey.Selector]: {
				$network,
				inscriptionId: inscription.inscriptionId,
			},
			[EntityMetaKey.Fields]: {
				...(parsed != null && {
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'inscriptionIndex')]: parsed.inscriptionIndex,
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], '$revealTransaction')]: {
						[EntityMetaKey.Selector]: {
							$network,
							txId: parsed.txId,
						},
					},
				}),
				...(inscription.inscriptionNumber != null && {
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'inscriptionNumber')]: inscription.inscriptionNumber,
				}),
				...(inscription.contentType != null && {
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'contentType')]: inscription.contentType,
				}),
				...(inscription.offset != null && {
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], 'satOffset')]: inscription.offset,
				}),
				...(inscription.utxo != null && {
					[entityFieldAddressKey(EntityType.BitcoinOrdinalInscription, [], '$contentOutput')]: {
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network,
								txId: inscription.utxo.txid,
							},
							indexInTransaction: inscription.utxo.vout,
						},
						[EntityMetaKey.Fields]: {
							...(inscription.utxo.satoshi != null && {
								[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(inscription.utxo.satoshi),
							}),
							...(inscription.utxo.scriptPk != null && {
								[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: inscription.utxo.scriptPk,
							}),
							...(inscription.utxo.scriptType != null && {
								[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: inscription.utxo.scriptType,
							}),
							...(inscription.utxo.address != null && {
								[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
									[EntityMetaKey.Selector]: {
										$network,
										address: inscription.utxo.address,
									},
								},
							}),
						},
					},
				}),
			},
		}
	})
)
