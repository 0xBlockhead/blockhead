import { base58btc } from 'multiformats/bases/base58'
import {
	describe,
	expect,
	it,
} from 'vitest'

import accountUpdate from '$/sources/GetBlock/Yellowstone/fixtures/account-update.json'
import {
	decodeGetBlockYellowstoneSubscribeUpdate,
	encodeGetBlockYellowstoneAccountRequest,
} from '$/sources/GetBlock/Yellowstone/protobuf.ts'

const encodeVarint = (value: bigint) => {
	const bytes: number[] = []
	let remaining = value
	do {
		bytes.push(Number(remaining & 0x7fn) | (remaining > 0x7fn ? 0x80 : 0))
		remaining >>= 7n
	} while (remaining > 0n)
	return Uint8Array.from(bytes)
}
const concatBytes = (chunks: readonly Uint8Array[]) => {
	const bytes = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0))
	let offset = 0
	for (const chunk of chunks) {
		bytes.set(chunk, offset)
		offset += chunk.length
	}
	return bytes
}
const varintField = (fieldNumber: number, value: bigint) => concatBytes([
	encodeVarint(BigInt(fieldNumber << 3)),
	encodeVarint(value),
])
const bytesField = (fieldNumber: number, value: Uint8Array) => concatBytes([
	encodeVarint(BigInt(fieldNumber << 3 | 2)),
	encodeVarint(BigInt(value.length)),
	value,
])
const accountUpdateMessage = concatBytes([
	bytesField(2, concatBytes([
		bytesField(1, concatBytes([
			bytesField(1, base58btc.baseDecode(accountUpdate.account)),
			varintField(2, BigInt(accountUpdate.lamports)),
			bytesField(3, base58btc.baseDecode(accountUpdate.ownerProgramId)),
			varintField(5, BigInt(accountUpdate.rentEpoch)),
			bytesField(6, Uint8Array.from(globalThis.atob(accountUpdate.data), (character) => character.charCodeAt(0))),
		])),
		varintField(2, BigInt(accountUpdate.slot)),
	])),
	bytesField(11, varintField(1, BigInt(accountUpdate.timestampMs / 1_000))),
])

describe('GetBlock Yellowstone protobuf account index leftovers', () => {
	it('encodes owner and datasize filters for spaceBytes-shaped account index subscriptions', () => {
		const encoded = encodeGetBlockYellowstoneAccountRequest({
			owners: [accountUpdate.ownerProgramId],
			filters: [{ datasize: 165 }],
			commitment: 'confirmed',
		})
		const text = new TextDecoder().decode(encoded)
		expect(text).toContain(accountUpdate.ownerProgramId)
		expect(Array.from(encoded)).toEqual(
			expect.arrayContaining([
				2 << 3 | 2,
			])
		)
		expect(() => encodeGetBlockYellowstoneAccountRequest({
			commitment: 'confirmed',
		})).toThrow('requires accounts or owners')
		expect(() => encodeGetBlockYellowstoneAccountRequest({
			accounts: ['not-a-pubkey'],
			commitment: 'confirmed',
		})).toThrow('invalid account pubkey')
		expect(() => encodeGetBlockYellowstoneAccountRequest({
			owners: [accountUpdate.ownerProgramId],
			filters: [{ datasize: -1 }],
			commitment: 'confirmed',
		})).toThrow('datasize filter')
	})

	it('decodes account updates and skips ping keepalive frames', () => {
		expect(decodeGetBlockYellowstoneSubscribeUpdate(accountUpdateMessage)).toEqual({
			kind: 'account',
			update: accountUpdate,
		})
		expect(decodeGetBlockYellowstoneSubscribeUpdate(bytesField(6, new Uint8Array()))).toEqual({
			kind: 'ping',
		})
		expect(decodeGetBlockYellowstoneSubscribeUpdate(bytesField(9, varintField(1, 7n)))).toEqual({
			kind: 'pong',
			id: 7,
		})
		expect(() => decodeGetBlockYellowstoneSubscribeUpdate(new Uint8Array([0x08, 0x01]))).toThrow(
			'unsupported subscribe update'
		)
		expect(() => decodeGetBlockYellowstoneSubscribeUpdate(concatBytes([
			bytesField(2, concatBytes([
				bytesField(1, concatBytes([
					bytesField(1, base58btc.baseDecode(accountUpdate.account)),
					bytesField(3, base58btc.baseDecode(accountUpdate.ownerProgramId)),
				])),
				varintField(2, 0n),
			])),
			bytesField(11, varintField(1, BigInt(accountUpdate.timestampMs / 1_000))),
		]))).toThrow('invalid account slot')
	})
})
