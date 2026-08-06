import { BitcoinProtocolId } from '$/constants/BitcoinProtocol.ts'
import {
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

export const bitcoinInscriptionId = (
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
	}[]
) => (
	inscriptions.map((inscription) => ({
		[EntityMetaKey.Selector]: {
			$network,
			inscriptionId: inscription.inscriptionId,
		},
	}))
)
