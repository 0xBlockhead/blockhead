import {
	BitcoinProtocolId,
	bitcoinProtocolById,
} from '$/constants/BitcoinProtocol.ts'
import type { BitcoinCoreTransaction } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import type { EsploraTransaction } from '$/sources/Esplora/Rest/types.ts'


export type BitcoinOrdinalsProtocolPayload = {
	protocol: BitcoinProtocolId.Ordinals
	transactionId: string
	location: {
		inputIndex: number
		witnessIndex: number
	}
	/** Raw hex after the `ord` marker push through (not including) `OP_ENDIF`. */
	payloadHex: string
	contentType?: string
	bodyHex?: string
}

export type BitcoinRunesProtocolPayload = {
	protocol: BitcoinProtocolId.Runes
	transactionId: string
	location: {
		outputIndex: number
	}
	/** Concatenated data-push bytes after `OP_RETURN OP_13` (Runes payload buffer). */
	payloadHex: string
	/** True when a non-data-push opcode appears in the runestone script after `OP_13`. */
	isCenotaph: boolean
}

export type BitcoinProtocolPayload =
	| BitcoinOrdinalsProtocolPayload
	| BitcoinRunesProtocolPayload


const ordinalsEnvelopePrefixHex = bitcoinProtocolById[BitcoinProtocolId.Ordinals].scriptPrefixHex
const runesScriptPrefixHex = bitcoinProtocolById[BitcoinProtocolId.Runes].scriptPrefixHex

const hexByte = (hex: string, offset: number) => (
	Number.parseInt(hex.slice(offset, offset + 2), 16)
)

const readDataPush = (scriptHex: string, offset: number) => {
	if (offset + 2 > scriptHex.length)
		return undefined

	const opcode = hexByte(scriptHex, offset)

	if (opcode === 0)
		return {
			dataHex: '',
			nextOffset: offset + 2,
		}

	if (opcode >= 1 && opcode <= 75) {
		const start = offset + 2
		const end = start + opcode * 2
		return end <= scriptHex.length ?
			{
				dataHex: scriptHex.slice(start, end),
				nextOffset: end,
			}
		:
			undefined
	}

	if (opcode === 76) {
		if (offset + 4 > scriptHex.length)
			return undefined
		const length = hexByte(scriptHex, offset + 2)
		const start = offset + 4
		const end = start + length * 2
		return end <= scriptHex.length ?
			{
				dataHex: scriptHex.slice(start, end),
				nextOffset: end,
			}
		:
			undefined
	}

	if (opcode === 77) {
		if (offset + 6 > scriptHex.length)
			return undefined
		const length = (
			hexByte(scriptHex, offset + 2)
			+ (hexByte(scriptHex, offset + 4) << 8)
		)
		const start = offset + 6
		const end = start + length * 2
		return end <= scriptHex.length ?
			{
				dataHex: scriptHex.slice(start, end),
				nextOffset: end,
			}
		:
			undefined
	}

	if (opcode === 78) {
		if (offset + 10 > scriptHex.length)
			return undefined
		const length = (
			hexByte(scriptHex, offset + 2)
			+ (hexByte(scriptHex, offset + 4) << 8)
			+ (hexByte(scriptHex, offset + 6) << 16)
			+ (hexByte(scriptHex, offset + 8) << 24)
		)
		const start = offset + 10
		const end = start + length * 2
		return end <= scriptHex.length ?
			{
				dataHex: scriptHex.slice(start, end),
				nextOffset: end,
			}
		:
			undefined
	}

	return undefined
}

const utf8FromHex = (hex: string) => (
	[...hex.matchAll(/../g)]
		.map((match) => String.fromCharCode(Number.parseInt(match[0], 16)))
		.join('')
)

const parseOrdinalsEnvelope = (scriptHex: string, envelopeOffset: number) => {
	let offset = envelopeOffset + ordinalsEnvelopePrefixHex.length
	let contentType: string | undefined
	let bodyHex = ''
	let inBody = false

	while (offset + 2 <= scriptHex.length) {
		const opcode = hexByte(scriptHex, offset)

		if (opcode === 0x68) {
			return {
				payloadHex: scriptHex.slice(envelopeOffset + ordinalsEnvelopePrefixHex.length, offset),
				...(contentType != null && { contentType }),
				...(bodyHex !== '' && { bodyHex }),
			}
		}

		if (opcode >= 0x51 && opcode <= 0x60) {
			const tag = opcode - 0x50
			offset += 2
			if (tag === 0) {
				inBody = true
				continue
			}
			const value = readDataPush(scriptHex, offset)
			if (value == null)
				return undefined
			if (tag === 1)
				contentType = utf8FromHex(value.dataHex)
			offset = value.nextOffset
			continue
		}

		const push = readDataPush(scriptHex, offset)
		if (push == null)
			return undefined

		if (inBody) {
			bodyHex += push.dataHex
			offset = push.nextOffset
			continue
		}

		// Tag 0 is `OP_0` / empty push; other tags are single-byte pushes (`OP_PUSH 1`, …).
		if (push.dataHex.length === 0) {
			inBody = true
			offset = push.nextOffset
			continue
		}

		if (push.dataHex.length === 2) {
			const tag = Number.parseInt(push.dataHex, 16)
			offset = push.nextOffset
			if (tag === 0) {
				inBody = true
				continue
			}
			const value = readDataPush(scriptHex, offset)
			if (value == null)
				return undefined
			if (tag === 1)
				contentType = utf8FromHex(value.dataHex)
			offset = value.nextOffset
			continue
		}

		offset = push.nextOffset
	}

	return undefined
}

export const findOrdinalsEnvelopesInScript = (scriptHex: string) => {
	const envelopes: NonNullable<ReturnType<typeof parseOrdinalsEnvelope>>[] = []
	let searchFrom = 0

	while (searchFrom < scriptHex.length) {
		const envelopeOffset = scriptHex.indexOf(ordinalsEnvelopePrefixHex, searchFrom)
		if (envelopeOffset < 0)
			break

		const parsed = parseOrdinalsEnvelope(scriptHex, envelopeOffset)
		if (parsed != null)
			envelopes.push(parsed)

		searchFrom = envelopeOffset + ordinalsEnvelopePrefixHex.length
	}

	return envelopes
}

export const decipherRunestoneScript = (scriptHex: string) => {
	if (!scriptHex.startsWith(runesScriptPrefixHex))
		return undefined

	let offset = runesScriptPrefixHex.length
	let payloadHex = ''
	let isCenotaph = false

	while (offset + 2 <= scriptHex.length) {
		const push = readDataPush(scriptHex, offset)
		if (push == null) {
			isCenotaph = true
			break
		}
		payloadHex += push.dataHex
		offset = push.nextOffset
	}

	return {
		payloadHex,
		isCenotaph,
	}
}

/**
 * Unsigned LEB128 integers from a Runestone payload buffer.
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const readLeb128Integers = (payloadHex: string) => {
	const integers: bigint[] = []
	let offset = 0
	let truncated = false

	while (offset + 2 <= payloadHex.length) {
		let value = 0n
		let shift = 0n
		let completed = false

		while (offset + 2 <= payloadHex.length) {
			const byte = BigInt(hexByte(payloadHex, offset))
			offset += 2
			value |= (byte & 0x7fn) << shift
			if ((byte & 0x80n) === 0n) {
				completed = true
				break
			}
			shift += 7n
			if (shift > 63n) {
				truncated = true
				return {
					integers,
					truncated: true,
				}
			}
		}

		if (!completed) {
			truncated = true
			break
		}

		integers.push(value)
	}

	if (offset < payloadHex.length)
		truncated = true

	return {
		integers,
		truncated,
	}
}

/**
 * Even tags are protocol fields; tag `0` (Body) begins the edict stream.
 * Odd tags are recognized for etching metadata but left as raw integers here
 * (APP owns typed Rune / Runestone Research selectors).
 */
export const RunestoneTag = {
	Body: 0n,
	Flags: 2n,
	Rune: 4n,
	Premine: 6n,
	Cap: 8n,
	Amount: 10n,
	HeightStart: 12n,
	HeightEnd: 14n,
	OffsetStart: 16n,
	OffsetEnd: 18n,
	Mint: 20n,
	Pointer: 22n,
	Cenotaph: 126n,
	Divisibility: 1n,
	Spacers: 3n,
	Symbol: 5n,
	Nop: 127n,
} as const

export type DecodedRunestoneEdict = {
	runeIdBlock: bigint
	runeIdTx: bigint
	amount: bigint
	output: bigint
}

export type DecodedRunestonePayload = {
	integers: bigint[]
	/** Tag → value list (even protocol tags before Body). */
	fields: Map<bigint, bigint[]>
	edicts: DecodedRunestoneEdict[]
	/** True when LEB128 truncated, Body missing pairing, or Cenotaph tag present. */
	isCenotaph: boolean
}

export const decodeRunestonePayload = (
	payloadHex: string,
	{
		scriptIsCenotaph = false,
	}: {
		scriptIsCenotaph?: boolean
	} = {}
): DecodedRunestonePayload => {
	const {
		integers,
		truncated,
	} = readLeb128Integers(payloadHex)
	const fields = new Map<bigint, bigint[]>()
	const edicts: DecodedRunestoneEdict[] = []
	let isCenotaph = scriptIsCenotaph || truncated
	let index = 0

	while (index < integers.length) {
		const tag = integers[index]!
		index += 1

		if (tag === RunestoneTag.Body)
			break

		if (index >= integers.length) {
			isCenotaph = true
			break
		}

		const value = integers[index]!
		index += 1
		const existing = fields.get(tag)
		if (existing == null)
			fields.set(tag, [value])
		else
			existing.push(value)

		if (tag === RunestoneTag.Cenotaph)
			isCenotaph = true
	}

	while (index + 3 < integers.length) {
		edicts.push({
			runeIdBlock: integers[index]!,
			runeIdTx: integers[index + 1]!,
			amount: integers[index + 2]!,
			output: integers[index + 3]!,
		})
		index += 4
	}

	if (index !== integers.length)
		isCenotaph = true

	return {
		integers,
		fields,
		edicts,
		isCenotaph,
	}
}

const extractFromWitnessAndOutputs = ({
	transactionId,
	vin,
	vout,
}: {
	transactionId: string
	vin: {
		witness?: string[]
	}[]
	vout: {
		outputIndex: number
		scriptHex: string
	}[]
}) => {
	const ordinals = vin.flatMap((input, inputIndex) => (
		(input.witness ?? []).flatMap((witness, witnessIndex) => (
			findOrdinalsEnvelopesInScript(witness)
				.map((envelope) => ({
					protocol: BitcoinProtocolId.Ordinals,
					transactionId,
					location: {
						inputIndex,
						witnessIndex,
					},
					...envelope,
				}) satisfies BitcoinOrdinalsProtocolPayload)
		))
	))

	const runestoneOutput = vout.find(({ scriptHex }) => scriptHex.startsWith(runesScriptPrefixHex))
	const runes = (
		runestoneOutput == null ?
			[]
		:
			(() => {
				const deciphered = decipherRunestoneScript(runestoneOutput.scriptHex)
				return deciphered == null ?
					[]
				:
					[{
						protocol: BitcoinProtocolId.Runes,
						transactionId,
						location: {
							outputIndex: runestoneOutput.outputIndex,
						},
						payloadHex: deciphered.payloadHex,
						isCenotaph: deciphered.isCenotaph,
					} satisfies BitcoinRunesProtocolPayload]
			})()
	)

	return [
		...ordinals,
		...runes,
	] satisfies BitcoinProtocolPayload[]
}

export const extractProtocolPayloads = (transaction: BitcoinCoreTransaction) => (
	extractFromWitnessAndOutputs({
		transactionId: transaction.txid,
		vin: transaction.vin.map((input) => ({
			witness: input.txinwitness,
		})),
		vout: transaction.vout.map((output) => ({
			outputIndex: output.n,
			scriptHex: output.scriptPubKey.hex,
		})),
	})
)

export const extractEsploraProtocolPayloads = (transaction: EsploraTransaction) => (
	extractFromWitnessAndOutputs({
		transactionId: transaction.txid,
		vin: transaction.vin.map((input) => ({
			witness: input.witness,
		})),
		vout: transaction.vout.map((output, outputIndex) => ({
			outputIndex,
			scriptHex: output.scriptpubkey,
		})),
	})
)
