const PSBT_MAGIC = [
	0x70,
	0x73,
	0x62,
	0x74,
	0xff,
] as const

const PSBT_GLOBAL_UNSIGNED_TX = 0x00
const PSBT_GLOBAL_TX_VERSION = 0x02
const PSBT_GLOBAL_FALLBACK_LOCKTIME = 0x03
const PSBT_GLOBAL_INPUT_COUNT = 0x04
const PSBT_GLOBAL_OUTPUT_COUNT = 0x05
const PSBT_GLOBAL_VERSION = 0xfb

const PSBT_IN_NON_WITNESS_UTXO = 0x00
const PSBT_IN_WITNESS_UTXO = 0x01
const PSBT_IN_PARTIAL_SIG = 0x02
const PSBT_IN_SIGHASH_TYPE = 0x03
const PSBT_IN_REDEEM_SCRIPT = 0x04
const PSBT_IN_WITNESS_SCRIPT = 0x05
const PSBT_IN_BIP32_DERIVATION = 0x06
const PSBT_IN_FINAL_SCRIPTSIG = 0x07
const PSBT_IN_FINAL_SCRIPTWITNESS = 0x08
const PSBT_IN_OUTPUT_INDEX = 0x0f

const PSBT_OUT_REDEEM_SCRIPT = 0x00
const PSBT_OUT_WITNESS_SCRIPT = 0x01
const PSBT_OUT_BIP32_DERIVATION = 0x02
const PSBT_OUT_AMOUNT = 0x03

type PsbtMapEntry = Readonly<{
	key: Uint8Array
	value: Uint8Array
}>

export type PsbtInputInspection = Readonly<{
	index: number
	isFinalized: boolean
	hasNonWitnessUtxo: boolean
	hasWitnessUtxo: boolean
	hasPartialSig: boolean
	hasRedeemScript: boolean
	hasWitnessScript: boolean
	hasBip32Derivation: boolean
	sighashType?: number
	valueSats?: bigint
}>

export type PsbtOutputInspection = Readonly<{
	index: number
	hasRedeemScript: boolean
	hasWitnessScript: boolean
	hasBip32Derivation: boolean
	valueSats?: bigint
}>

export type PsbtInspection = Readonly<{
	psbtVersion: number
	txVersion?: number
	locktime?: number
	inputCount: number
	outputCount: number
	/** Number of inputs with a present finalScriptSig or finalScriptWitness field. */
	finalizedInputCount: number
	inputs: readonly PsbtInputInspection[]
	outputs: readonly PsbtOutputInspection[]
}>

const createReader = (
	bytes: Uint8Array
) => {
	let offset = 0

	const remaining = () => bytes.length - offset

	const requireBytes = (
		length: number
	) => {
		if (remaining() < length)
			throw new Error('PSBT: unexpected end of data')
	}

	const readBytes = (
		length: number
	) => {
		requireBytes(length)
		const slice = bytes.subarray(offset, offset + length)
		offset += length
		return slice
	}

	const peekBytes = (
		length: number
	) => {
		requireBytes(length)
		return bytes.subarray(offset, offset + length)
	}

	const readU8 = () => readBytes(1)[0] ?? 0

	const readU16 = () => {
		const slice = readBytes(2)
		return slice[0]! | (slice[1]! << 8)
	}

	const readU32 = () => {
		const slice = readBytes(4)
		return (
			slice[0]!
			| (slice[1]! << 8)
			| (slice[2]! << 16)
			| (slice[3]! << 24)
		) >>> 0
	}

	const readU64 = () => {
		const slice = readBytes(8)
		return (
			BigInt(slice[0]!)
			| (BigInt(slice[1]!) << 8n)
			| (BigInt(slice[2]!) << 16n)
			| (BigInt(slice[3]!) << 24n)
			| (BigInt(slice[4]!) << 32n)
			| (BigInt(slice[5]!) << 40n)
			| (BigInt(slice[6]!) << 48n)
			| (BigInt(slice[7]!) << 56n)
		)
	}

	const readCompactSize = () => {
		const first = readU8()
		if (first < 0xfd)
			return first
		if (first === 0xfd)
			return readU16()
		if (first === 0xfe)
			return readU32()

		throw new Error('PSBT: oversized compact size')
	}

	const readMap = () => {
		const entries: PsbtMapEntry[] = []
		for (;;) {
			const keyLength = readCompactSize()
			if (keyLength === 0)
				return entries

			const key = readBytes(keyLength)
			entries.push({
				key,
				value: readBytes(readCompactSize()),
			})
		}
	}

	return {
		readBytes,
		peekBytes,
		readU8,
		readU32,
		readU64,
		readCompactSize,
		readMap,
		remaining,
	}
}

const firstValue = (
	entries: readonly PsbtMapEntry[],
	type: number
) => (
	entries.find((entry) => entry.key[0] === type)?.value
)

const hasType = (
	entries: readonly PsbtMapEntry[],
	type: number
) => (
	entries.some((entry) => entry.key[0] === type)
)

const readExactU32 = (
	value: Uint8Array | undefined
) => {
	if (value == null || value.length !== 4)
		return

	return createReader(value).readU32()
}

const readExactU64 = (
	value: Uint8Array | undefined
) => {
	if (value == null || value.length !== 8)
		return

	return createReader(value).readU64()
}

const readCompactCount = (
	value: Uint8Array | undefined
) => {
	if (value == null)
		return

	const reader = createReader(value)
	const count = reader.readCompactSize()
	if (reader.remaining() !== 0)
		throw new Error('PSBT: invalid compact count')

	return count
}

const parseBitcoinTransaction = (
	bytes: Uint8Array
) => {
	const reader = createReader(bytes)
	const version = reader.readU32()
	const witnessMarker = reader.peekBytes(2)
	const hasWitness = witnessMarker[0] === 0 && witnessMarker[1] === 1
	if (hasWitness) {
		reader.readU8()
		reader.readU8()
	}

	const inputs = Array.from({
		length: reader.readCompactSize(),
	}, () => {
		reader.readBytes(32)
		const vout = reader.readU32()
		reader.readBytes(reader.readCompactSize())
		reader.readU32()
		return {
			vout,
		}
	})

	const outputs = Array.from({
		length: reader.readCompactSize(),
	}, () => {
		const valueSats = reader.readU64()
		reader.readBytes(reader.readCompactSize())
		return {
			valueSats,
		}
	})

	if (hasWitness) {
		for (const _input of inputs) {
			const itemCount = reader.readCompactSize()
			for (let item = 0; item < itemCount; item++)
				reader.readBytes(reader.readCompactSize())
		}
	}

	const locktime = reader.readU32()
	if (reader.remaining() !== 0)
		throw new Error('PSBT: invalid unsigned transaction')

	return {
		version,
		locktime,
		inputs,
		outputs,
	}
}

const witnessUtxoValueSats = (
	value: Uint8Array | undefined
) => {
	if (value == null || value.length < 8)
		return

	const reader = createReader(value)
	const valueSats = reader.readU64()
	reader.readBytes(reader.readCompactSize())
	if (reader.remaining() !== 0)
		return

	return valueSats
}

const nonWitnessUtxoValueSats = (
	value: Uint8Array | undefined,
	vout: number | undefined
) => {
	if (value == null || vout == null)
		return

	return parseBitcoinTransaction(value).outputs[vout]?.valueSats
}

export const inspectPsbt = (
	bytes: Uint8Array
): PsbtInspection => {
	if (
		bytes.length < PSBT_MAGIC.length
		|| PSBT_MAGIC.some((byte, index) => bytes[index] !== byte)
	)
		throw new Error('PSBT: invalid magic')

	const reader = createReader(bytes.subarray(PSBT_MAGIC.length))
	const global = reader.readMap()
	const psbtVersion = readExactU32(firstValue(global, PSBT_GLOBAL_VERSION)) ?? 0
	const unsignedTxBytes = firstValue(global, PSBT_GLOBAL_UNSIGNED_TX)
	if (psbtVersion >= 2 && unsignedTxBytes != null)
		throw new Error('PSBTv2: unsigned transaction is not allowed')

	const unsignedTx = unsignedTxBytes == null ? undefined : parseBitcoinTransaction(unsignedTxBytes)
	const inputCount = (
		psbtVersion >= 2 ?
			readCompactCount(firstValue(global, PSBT_GLOBAL_INPUT_COUNT))
		:
			unsignedTx?.inputs.length
	)
	const outputCount = (
		psbtVersion >= 2 ?
			readCompactCount(firstValue(global, PSBT_GLOBAL_OUTPUT_COUNT))
		:
			unsignedTx?.outputs.length
	)
	if (inputCount == null || outputCount == null)
		throw new Error('PSBT: missing input or output count')

	const inputMaps = Array.from({
		length: inputCount,
	}, () => reader.readMap())
	const outputMaps = Array.from({
		length: outputCount,
	}, () => reader.readMap())
	if (reader.remaining() !== 0)
		throw new Error('PSBT: unexpected trailing data')

	const inputs = inputMaps.map((entries, index) => {
		const isFinalized = (
			hasType(entries, PSBT_IN_FINAL_SCRIPTSIG)
			|| hasType(entries, PSBT_IN_FINAL_SCRIPTWITNESS)
		)
		const sighashType = readExactU32(firstValue(entries, PSBT_IN_SIGHASH_TYPE))
		const valueSats = (
			witnessUtxoValueSats(firstValue(entries, PSBT_IN_WITNESS_UTXO))
			?? nonWitnessUtxoValueSats(
				firstValue(entries, PSBT_IN_NON_WITNESS_UTXO),
				readExactU32(firstValue(entries, PSBT_IN_OUTPUT_INDEX))
					?? unsignedTx?.inputs[index]?.vout
			)
		)

		return {
			index,
			isFinalized,
			hasNonWitnessUtxo: hasType(entries, PSBT_IN_NON_WITNESS_UTXO),
			hasWitnessUtxo: hasType(entries, PSBT_IN_WITNESS_UTXO),
			hasPartialSig: hasType(entries, PSBT_IN_PARTIAL_SIG),
			hasRedeemScript: hasType(entries, PSBT_IN_REDEEM_SCRIPT),
			hasWitnessScript: hasType(entries, PSBT_IN_WITNESS_SCRIPT),
			hasBip32Derivation: hasType(entries, PSBT_IN_BIP32_DERIVATION),
			...(sighashType != null && {
				sighashType,
			}),
			...(valueSats != null && {
				valueSats,
			}),
		}
	})

	const outputs = outputMaps.map((entries, index) => {
		const valueSats = (
			readExactU64(firstValue(entries, PSBT_OUT_AMOUNT))
			?? unsignedTx?.outputs[index]?.valueSats
		)

		return {
			index,
			hasRedeemScript: hasType(entries, PSBT_OUT_REDEEM_SCRIPT),
			hasWitnessScript: hasType(entries, PSBT_OUT_WITNESS_SCRIPT),
			hasBip32Derivation: hasType(entries, PSBT_OUT_BIP32_DERIVATION),
			...(valueSats != null && {
				valueSats,
			}),
		}
	})

	const txVersion = (
		unsignedTx?.version
		?? readExactU32(firstValue(global, PSBT_GLOBAL_TX_VERSION))
	)
	const locktime = (
		unsignedTx?.locktime
		?? readExactU32(firstValue(global, PSBT_GLOBAL_FALLBACK_LOCKTIME))
	)

	return {
		psbtVersion,
		...(txVersion != null && {
			txVersion,
		}),
		...(locktime != null && {
			locktime,
		}),
		inputCount,
		outputCount,
		finalizedInputCount: inputs.filter((input) => input.isFinalized).length,
		inputs,
		outputs,
	}
}
