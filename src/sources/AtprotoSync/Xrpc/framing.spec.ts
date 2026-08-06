import {
	decode,
	encode,
	Tagged,
} from 'cborg'
import { CID } from 'multiformats/cid'
import {
	describe,
	expect,
	it,
} from 'vitest'

import { decodeAtprotoSyncFrame } from '$/sources/AtprotoSync/Xrpc/framing.ts'


const frame = (
	header: object,
	body: object
) => new Uint8Array([
	...encode(header),
	...encode(body),
])


describe('AtprotoSync DRISL-CBOR framing', () => {
	it.each([
		'#account',
		'#commit',
		'#identity',
		'#info',
		'#sync',
	])('decodes a known %s event from two concatenated CBOR objects', (messageType) => {
		expect(decodeAtprotoSyncFrame(frame({
			op: 1,
			t: messageType,
		}, {
			sequence: 42,
		}))).toEqual({
			type: messageType,
			body: {
				sequence: 42,
			},
		})
	})

	it('skips unknown operations and message types after validating both objects', () => {
		expect(decodeAtprotoSyncFrame(frame({
			op: 2,
			t: '#commit',
		}, {}))).toBeUndefined()
		expect(decodeAtprotoSyncFrame(frame({
			op: 1,
			t: '#future',
		}, {}))).toBeUndefined()
	})

	it('hard-fails malformed, missing, and extra framing objects', () => {
		expect(() => decodeAtprotoSyncFrame(new Uint8Array([0xff]))).toThrow(
			'malformed subscribeRepos frame header'
		)
		expect(() => decodeAtprotoSyncFrame(encode({
			op: 1,
			t: '#commit',
		}))).toThrow('malformed subscribeRepos frame body')
		expect(() => decodeAtprotoSyncFrame(new Uint8Array([
			...frame({
				op: 1,
				t: '#commit',
			}, {}),
			...encode({ extra: true }),
		]))).toThrow('malformed subscribeRepos frame body')
	})

	it('throws protocol errors from op=-1 frames', () => {
		expect(() => decodeAtprotoSyncFrame(frame({
			op: -1,
		}, {
			error: 'FutureCursor',
			message: 'Cursor is ahead',
		}))).toThrow('AtprotoSync_Xrpc: FutureCursor: Cursor is ahead')
	})

	it('preserves byte strings in decoded bodies', () => {
		const message = decodeAtprotoSyncFrame(frame({
			op: 1,
			t: '#commit',
		}, {
			blocks: new Uint8Array([1, 2, 3]),
		}))

		expect(message?.type).toBe('#commit')
		expect(decode(encode(message?.body))).toEqual({
			blocks: new Uint8Array([1, 2, 3]),
		})
	})

	it('decodes CID link tag 42 into multiformats CID values', () => {
		const cid = CID.parse('bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya')
		const linkBytes = new Uint8Array(1 + cid.bytes.length)
		linkBytes[0] = 0
		linkBytes.set(cid.bytes, 1)

		const message = decodeAtprotoSyncFrame(frame({
			op: 1,
			t: '#commit',
		}, {
			commit: new Tagged(42, linkBytes),
			blocks: new Uint8Array([9]),
		}))

		expect(message?.type).toBe('#commit')
		expect(CID.asCID((message?.body as { commit: unknown }).commit)?.toString()).toBe(cid.toString())
	})
})
