import { base58btc } from 'multiformats/bases/base58'

import type {
	GetBlockYellowstoneAccountRequest,
	GetBlockYellowstoneAccountUpdate,
	GetBlockYellowstoneSubscribeUpdate,
} from '$/sources/GetBlock/Yellowstone/types.ts'

type ProtobufField =
	| {
		fieldNumber: number
		wireType: 0
		value: bigint
	}
	| {
		fieldNumber: number
		wireType: 2
		value: Uint8Array
	}

const concatBytes = (chunks: readonly Uint8Array[]): Uint8Array => {
	const bytes = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0))
	let offset = 0
	for (const chunk of chunks) {
		bytes.set(chunk, offset)
		offset += chunk.length
	}
	return bytes
}

const encodeVarint = (value: bigint): Uint8Array => {
	if (value < 0n)
		throw new Error('Yellowstone protobuf varints must be unsigned')

	const bytes: number[] = []
	let remaining = value
	do {
		bytes.push(Number(remaining & 0x7fn) | (remaining > 0x7fn ? 0x80 : 0))
		remaining >>= 7n
	} while (remaining > 0n)
	return Uint8Array.from(bytes)
}

const encodeLengthDelimited = (
	fieldNumber: number,
	value: Uint8Array
): Uint8Array => concatBytes([
	encodeVarint(BigInt(fieldNumber << 3 | 2)),
	encodeVarint(BigInt(value.length)),
	value,
])

const encodeVarintField = (
	fieldNumber: number,
	value: bigint
): Uint8Array => concatBytes([
	encodeVarint(BigInt(fieldNumber << 3)),
	encodeVarint(value),
])

const decodeVarint = (
	bytes: Uint8Array,
	offset: number
): {
	offset: number
	value: bigint
} => {
	let value = 0n
	let shift = 0n
	let cursor = offset
	while (cursor < bytes.length && shift <= 63n) {
		const byte = bytes[cursor]
		value |= BigInt(byte & 0x7f) << shift
		cursor += 1
		if ((byte & 0x80) === 0)
			return { offset: cursor, value }
		shift += 7n
	}
	throw new Error('GetBlock Yellowstone returned an invalid protobuf varint')
}

const decodeFields = (bytes: Uint8Array): ProtobufField[] => {
	const fields: ProtobufField[] = []
	let offset = 0
	while (offset < bytes.length) {
		const key = decodeVarint(bytes, offset)
		offset = key.offset
		const fieldNumber = Number(key.value >> 3n)
		const wireType = Number(key.value & 0x07n)
		if (fieldNumber === 0)
			throw new Error('GetBlock Yellowstone returned protobuf field zero')

		if (wireType === 0) {
			const value = decodeVarint(bytes, offset)
			offset = value.offset
			fields.push({ fieldNumber, wireType: 0, value: value.value })
			continue
		}

		if (wireType === 2) {
			const length = decodeVarint(bytes, offset)
			offset = length.offset
			if (length.value > BigInt(bytes.length - offset))
				throw new Error('GetBlock Yellowstone returned a truncated protobuf field')
			const end = offset + Number(length.value)
			fields.push({ fieldNumber, wireType: 2, value: bytes.slice(offset, end) })
			offset = end
			continue
		}

		throw new Error(`GetBlock Yellowstone returned unsupported protobuf wire type ${wireType}`)
	}
	return fields
}

const requiredBytes = (
	fields: readonly ProtobufField[],
	fieldNumber: number,
	fieldName: string
): Uint8Array => {
	const field = fields.find((candidate) => (
		candidate.fieldNumber === fieldNumber
		&& candidate.wireType === 2
	))
	if (field == null || field.wireType !== 2)
		throw new Error(`GetBlock Yellowstone account update lacks ${fieldName}`)
	return field.value
}

const optionalBytes = (
	fields: readonly ProtobufField[],
	fieldNumber: number
): Uint8Array => {
	const field = fields.find((candidate) => (
		candidate.fieldNumber === fieldNumber
		&& candidate.wireType === 2
	))
	return field == null || field.wireType !== 2 ? new Uint8Array() : field.value
}

const optionalVarint = (
	fields: readonly ProtobufField[],
	fieldNumber: number
): bigint => {
	const field = fields.find((candidate) => (
		candidate.fieldNumber === fieldNumber
		&& candidate.wireType === 0
	))
	return field == null || field.wireType !== 0 ? 0n : field.value
}

const bytesToBase64 = (bytes: Uint8Array) => {
	let binary = ''
	for (const byte of bytes)
		binary += String.fromCharCode(byte)
	return globalThis.btoa(binary)
}

const assertSolanaPubkey = (
	value: string,
	label: string
) => {
	try {
		if (base58btc.baseDecode(value).length !== 32)
			throw new Error()
	} catch {
		throw new Error(`GetBlock Yellowstone: invalid ${label}`)
	}
}

const encodeAccountFilter = (
	request: GetBlockYellowstoneAccountRequest
): Uint8Array => {
	const accounts = request.accounts ?? []
	const owners = request.owners ?? []
	const filters = request.filters ?? []
	if (accounts.length === 0 && owners.length === 0)
		throw new Error('GetBlock Yellowstone account subscription requires accounts or owners')

	for (const account of accounts)
		assertSolanaPubkey(account, 'account pubkey')
	for (const owner of owners)
		assertSolanaPubkey(owner, 'owner program id')
	for (const filter of filters) {
		if (!Number.isSafeInteger(filter.datasize) || filter.datasize < 0)
			throw new Error('GetBlock Yellowstone datasize filter must be a non-negative safe integer')
	}

	return concatBytes([
		...accounts.map((account) => (
			encodeLengthDelimited(2, new TextEncoder().encode(account))
		)),
		...owners.map((owner) => (
			encodeLengthDelimited(3, new TextEncoder().encode(owner))
		)),
		...filters.map((filter) => (
			encodeLengthDelimited(4, encodeVarintField(2, BigInt(filter.datasize)))
		)),
	])
}

export const encodeGetBlockYellowstoneAccountRequest = (
	request: GetBlockYellowstoneAccountRequest
): Uint8Array => {
	const accountMapEntry = concatBytes([
		encodeLengthDelimited(1, new TextEncoder().encode('account')),
		encodeLengthDelimited(2, encodeAccountFilter(request)),
	])
	return concatBytes([
		encodeLengthDelimited(1, accountMapEntry),
		encodeVarintField(6, BigInt([
			'processed',
			'confirmed',
			'finalized',
		].indexOf(request.commitment))),
	])
}

const decodeAccountUpdate = (
	updateFields: readonly ProtobufField[],
	timestampMs: number
): GetBlockYellowstoneAccountUpdate => {
	const accountUpdateFields = decodeFields(requiredBytes(updateFields, 2, 'account update'))
	const accountFields = decodeFields(requiredBytes(accountUpdateFields, 1, 'account'))
	const pubkey = requiredBytes(accountFields, 1, 'account.pubkey')
	const owner = requiredBytes(accountFields, 3, 'account.owner')
	if (pubkey.length !== 32)
		throw new Error('GetBlock Yellowstone returned an invalid account pubkey')
	if (owner.length !== 32)
		throw new Error('GetBlock Yellowstone returned an invalid account owner')

	const slot = optionalVarint(accountUpdateFields, 2)
	if (slot === 0n)
		throw new Error('GetBlock Yellowstone returned an invalid account slot')

	const data = optionalBytes(accountFields, 6)
	if (!Number.isSafeInteger(data.length))
		throw new Error('GetBlock Yellowstone returned an invalid account spaceBytes')

	return {
		account: base58btc.baseEncode(pubkey),
		slot: slot.toString(),
		timestampMs,
		lamports: optionalVarint(accountFields, 2).toString(),
		ownerProgramId: base58btc.baseEncode(owner),
		executable: optionalVarint(accountFields, 4) !== 0n,
		rentEpoch: optionalVarint(accountFields, 5).toString(),
		spaceBytes: data.length,
		dataEncoding: 'base64',
		data: bytesToBase64(data),
		isStartup: optionalVarint(accountUpdateFields, 3) !== 0n,
	}
}

export const decodeGetBlockYellowstoneSubscribeUpdate = (
	message: Uint8Array
): GetBlockYellowstoneSubscribeUpdate => {
	const updateFields = decodeFields(message)
	const timestampFields = decodeFields(optionalBytes(updateFields, 11))
	const seconds = optionalVarint(timestampFields, 1)
	const nanos = timestampFields.find((candidate) => (
		candidate.fieldNumber === 2
		&& candidate.wireType === 0
	))
	const timestampMs = Number(seconds * 1_000n) + Math.trunc(Number(
		nanos == null || nanos.wireType !== 0 ? 0n : nanos.value
	) / 1_000_000)
	if (timestampFields.length > 0 && !Number.isSafeInteger(timestampMs))
		throw new Error('GetBlock Yellowstone returned an invalid created_at timestamp')

	if (updateFields.some((field) => field.fieldNumber === 2 && field.wireType === 2)) {
		if (timestampFields.length === 0)
			throw new Error('GetBlock Yellowstone account update lacks created_at')
		return {
			kind: 'account',
			update: decodeAccountUpdate(updateFields, timestampMs),
		}
	}

	if (updateFields.some((field) => field.fieldNumber === 6))
		return { kind: 'ping' }

	const pong = updateFields.find((field) => field.fieldNumber === 9 && field.wireType === 2)
	if (pong != null && pong.wireType === 2) {
		const pongFields = decodeFields(pong.value)
		return {
			kind: 'pong',
			id: Number(optionalVarint(pongFields, 1)),
		}
	}

	throw new Error('GetBlock Yellowstone returned an unsupported subscribe update')
}

export const decodeGetBlockYellowstoneAccountUpdate = (
	message: Uint8Array
): GetBlockYellowstoneAccountUpdate => {
	const update = decodeGetBlockYellowstoneSubscribeUpdate(message)
	if (update.kind !== 'account')
		throw new Error(`GetBlock Yellowstone expected account update, got ${update.kind}`)
	return update.update
}
