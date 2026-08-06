import { describe, expect, it } from 'vitest'

import { BitcoinProtocolId } from '$/constants/BitcoinProtocol.ts'
import {
	decipherRunestoneScript,
	extractEsploraProtocolPayloads,
	extractProtocolPayloads,
	findOrdinalsEnvelopesInScript,
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
})
