import { describe, expect, it } from 'vitest'

import { BitcoinProtocolId } from '$/constants/BitcoinProtocol.ts'
import {
	decipherRunestoneScript,
	decodeRunestonePayload,
	extractEsploraProtocolPayloads,
	extractProtocolPayloads,
	findOrdinalsEnvelopesInScript,
	readLeb128Integers,
	RunestoneTag,
} from '$/sources/BitcoinCore/JsonRpc/protocol.ts'
import type { BitcoinCoreTransaction } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import type { EsploraTransaction } from '$/sources/Esplora/Rest/types.ts'


/** docs.ordinals.com/inscriptions.html — Hello, world! envelope with push-byte tags. */
const helloWorldInscriptionHex = (
	'0063'
	+ '036f7264'
	+ '0101'
	+ '18746578742f706c61696e3b636861727365743d7574662d38'
	+ '00'
	+ '0d48656c6c6f2c20776f726c6421'
	+ '68'
)

/** Same envelope using OP_1 for the content-type tag. */
const helloWorldInscriptionOp1TagHex = (
	'0063'
	+ '036f7264'
	+ '51'
	+ '18746578742f706c61696e3b636861727365743d7574662d38'
	+ '00'
	+ '0d48656c6c6f2c20776f726c6421'
	+ '68'
)

/** Second inscription body (`Hi`) sharing the same witness script after the first envelope. */
const secondInscriptionHex = (
	'0063'
	+ '036f7264'
	+ '0101'
	+ '0a746578742f706c61696e'
	+ '00'
	+ '024869'
	+ '68'
)

const coreTransaction = ({
	txid = 'aa'.repeat(32),
	vin = [] as BitcoinCoreTransaction['vin'],
	vout = [] as BitcoinCoreTransaction['vout'],
}: {
	txid?: string
	vin?: BitcoinCoreTransaction['vin']
	vout?: BitcoinCoreTransaction['vout']
}): BitcoinCoreTransaction => ({
	txid,
	hash: txid,
	version: 2,
	size: 100,
	vsize: 100,
	weight: 400,
	locktime: 0,
	vin,
	vout,
})


describe('findOrdinalsEnvelopesInScript', () => {
	it('parses the handbook Hello, world! envelope content type and body', () => {
		expect(findOrdinalsEnvelopesInScript(helloWorldInscriptionHex)).toEqual([
			{
				payloadHex: '010118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c6421',
				contentType: 'text/plain;charset=utf-8',
				bodyHex: '48656c6c6f2c20776f726c6421',
			},
		])
	})

	it('accepts OP_1 content-type tags and envelopes embedded mid-script', () => {
		expect(findOrdinalsEnvelopesInScript(`51${helloWorldInscriptionOp1TagHex}ac`)).toEqual([
			{
				payloadHex: '5118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c6421',
				contentType: 'text/plain;charset=utf-8',
				bodyHex: '48656c6c6f2c20776f726c6421',
			},
		])
	})

	it('finds multiple envelopes in one witness script', () => {
		expect(findOrdinalsEnvelopesInScript(helloWorldInscriptionHex + secondInscriptionHex)).toEqual([
			{
				payloadHex: '010118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c6421',
				contentType: 'text/plain;charset=utf-8',
				bodyHex: '48656c6c6f2c20776f726c6421',
			},
			{
				payloadHex: '01010a746578742f706c61696e00024869',
				contentType: 'text/plain',
				bodyHex: '4869',
			},
		])
	})

	it('accepts OP_PUSHDATA1 content-type pushes', () => {
		const contentType = 'text/plain'
		const contentTypeHex = [...contentType].map((character) => character.charCodeAt(0).toString(16).padStart(2, '0')).join('')
		const envelope = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ `4c${(contentType.length).toString(16).padStart(2, '0')}${contentTypeHex}`
			+ '00'
			+ '024869'
			+ '68'
		)
		expect(findOrdinalsEnvelopesInScript(envelope)).toEqual([
			{
				payloadHex: `01014c${(contentType.length).toString(16).padStart(2, '0')}${contentTypeHex}00024869`,
				contentType,
				bodyHex: '4869',
			},
		])
	})
})


describe('decipherRunestoneScript', () => {
	it('requires OP_RETURN OP_13 and concatenates following data pushes', () => {
		expect(decipherRunestoneScript('6a5d03010203')).toEqual({
			payloadHex: '010203',
			isCenotaph: false,
		})
		expect(decipherRunestoneScript('6a015d')).toBeUndefined()
		expect(decipherRunestoneScript('6a5d51')).toEqual({
			payloadHex: '',
			isCenotaph: true,
		})
	})

	it('concatenates OP_PUSHDATA1 payload chunks', () => {
		expect(decipherRunestoneScript('6a5d4c03010203')).toEqual({
			payloadHex: '010203',
			isCenotaph: false,
		})
	})
})


describe('readLeb128Integers / decodeRunestonePayload', () => {
	it('decodes unsigned LEB128 integers and truncates incomplete tails', () => {
		expect(readLeb128Integers('00')).toEqual({
			integers: [0n],
			truncated: false,
		})
		expect(readLeb128Integers('e58e26')).toEqual({
			integers: [624485n],
			truncated: false,
		})
		expect(readLeb128Integers('e58e')).toEqual({
			integers: [],
			truncated: true,
		})
	})

	it('parses fields before Body and edicts after Body', () => {
		// Flags=2 value=1, Body=0, then edict (block=1, tx=2, amount=3, output=0)
		const payloadHex = '02010001020300'
		const decoded = decodeRunestonePayload(payloadHex)
		expect(decoded.fields.get(RunestoneTag.Flags)).toEqual([1n])
		expect(decoded.edicts).toEqual([
			{
				runeIdBlock: 1n,
				runeIdTx: 2n,
				amount: 3n,
				output: 0n,
			},
		])
		expect(decoded.isCenotaph).toBe(false)
	})

	it('marks cenotaphs for truncated LEB128, leftover edict limbs, and Cenotaph tag', () => {
		expect(decodeRunestonePayload('e58e').isCenotaph).toBe(true)
		expect(decodeRunestonePayload('000102').isCenotaph).toBe(true)
		expect(decodeRunestonePayload('7e0000').isCenotaph).toBe(true)
		expect(decodeRunestonePayload('00', {
			scriptIsCenotaph: true,
		}).isCenotaph).toBe(true)
	})
})


describe('extractProtocolPayloads', () => {
	it('extracts Ordinals from Core witness and Runes from the first OP_RETURN OP_13 output', () => {
		const transaction = coreTransaction({
			vin: [
				{
					txid: 'bb'.repeat(32),
					vout: 0,
					sequence: 0xffffffff,
					txinwitness: [
						'01',
						helloWorldInscriptionHex,
					],
				},
			],
			vout: [
				{
					value: 0,
					n: 0,
					scriptPubKey: {
						asm: 'OP_RETURN OP_13 010203',
						hex: '6a5d03010203',
						type: 'nulldata',
					},
				},
				{
					value: 0.00001,
					n: 1,
					scriptPubKey: {
						asm: 'OP_DUP OP_HASH160 …',
						hex: '76a914' + '00'.repeat(20) + '88ac',
						type: 'pubkeyhash',
					},
				},
			],
		})

		expect(extractProtocolPayloads(transaction)).toEqual([
			{
				protocol: BitcoinProtocolId.Ordinals,
				transactionId: transaction.txid,
				location: {
					inputIndex: 0,
					witnessIndex: 1,
				},
				payloadHex: '010118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c6421',
				contentType: 'text/plain;charset=utf-8',
				bodyHex: '48656c6c6f2c20776f726c6421',
			},
			{
				protocol: BitcoinProtocolId.Runes,
				transactionId: transaction.txid,
				location: {
					outputIndex: 0,
				},
				payloadHex: '010203',
				isCenotaph: false,
			},
		])
	})

	it('indexes multiple reveal inscriptions and keeps only the first runestone output', () => {
		const transaction = coreTransaction({
			vin: [
				{
					txid: 'bb'.repeat(32),
					vout: 0,
					sequence: 0xffffffff,
					txinwitness: [
						helloWorldInscriptionHex + secondInscriptionHex,
					],
				},
			],
			vout: [
				{
					value: 0,
					n: 0,
					scriptPubKey: {
						asm: 'OP_RETURN OP_13',
						hex: '6a5d03010203',
						type: 'nulldata',
					},
				},
				{
					value: 0,
					n: 1,
					scriptPubKey: {
						asm: 'OP_RETURN OP_13',
						hex: '6a5d0100',
						type: 'nulldata',
					},
				},
			],
		})

		const payloads = extractProtocolPayloads(transaction)
		expect(payloads.filter((payload) => payload.protocol === BitcoinProtocolId.Ordinals)).toHaveLength(2)
		expect(payloads.filter((payload) => payload.protocol === BitcoinProtocolId.Runes)).toEqual([
			{
				protocol: BitcoinProtocolId.Runes,
				transactionId: transaction.txid,
				location: {
					outputIndex: 0,
				},
				payloadHex: '010203',
				isCenotaph: false,
			},
		])
	})

	it('does not invent empty protocol hits for ordinary spends', () => {
		expect(extractProtocolPayloads(coreTransaction({
			vin: [
				{
					txid: 'cc'.repeat(32),
					vout: 1,
					sequence: 0xffffffff,
					scriptSig: {
						asm: '',
						hex: '',
					},
				},
			],
			vout: [
				{
					value: 1,
					n: 0,
					scriptPubKey: {
						asm: 'OP_DUP OP_HASH160 …',
						hex: '76a914' + '11'.repeat(20) + '88ac',
						type: 'pubkeyhash',
						address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
					},
				},
			],
		}))).toEqual([])
	})
})


describe('extractEsploraProtocolPayloads', () => {
	it('reads Esplora witness + scriptpubkey field names', () => {
		const transaction = {
			txid: 'dd'.repeat(32),
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			status: {
				confirmed: true,
			},
			vin: [
				{
					txid: 'ee'.repeat(32),
					vout: 0,
					is_coinbase: false,
					sequence: 0xffffffff,
					witness: [
						helloWorldInscriptionHex,
					],
				},
			],
			vout: [
				{
					scriptpubkey: '6a5d4c020001',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
		} satisfies EsploraTransaction

		expect(extractEsploraProtocolPayloads(transaction)).toEqual([
			{
				protocol: BitcoinProtocolId.Ordinals,
				transactionId: transaction.txid,
				location: {
					inputIndex: 0,
					witnessIndex: 0,
				},
				payloadHex: '010118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c6421',
				contentType: 'text/plain;charset=utf-8',
				bodyHex: '48656c6c6f2c20776f726c6421',
			},
			{
				protocol: BitcoinProtocolId.Runes,
				transactionId: transaction.txid,
				location: {
					outputIndex: 0,
				},
				payloadHex: '0001',
				isCenotaph: false,
			},
		])
	})

	it('decodes the extracted Esplora runestone payload into LEB128 fields', () => {
		const payloads = extractEsploraProtocolPayloads({
			txid: 'dd'.repeat(32),
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			status: {
				confirmed: true,
			},
			vin: [],
			vout: [
				{
					// OP_RETURN OP_13 + push(7) Flags=2/1 Body=0 edict 1/2/3/0
					scriptpubkey: '6a5d0702010001020300',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
		} satisfies EsploraTransaction)
		const runestone = payloads.find((payload) => payload.protocol === BitcoinProtocolId.Runes)
		expect(runestone).toBeDefined()
		if (runestone == null || runestone.protocol !== BitcoinProtocolId.Runes)
			return

		const decoded = decodeRunestonePayload(runestone.payloadHex, {
			scriptIsCenotaph: runestone.isCenotaph,
		})
		expect(decoded.fields.get(RunestoneTag.Flags)).toEqual([1n])
		expect(decoded.edicts).toEqual([
			{
				runeIdBlock: 1n,
				runeIdTx: 2n,
				amount: 3n,
				output: 0n,
			},
		])
	})
})
