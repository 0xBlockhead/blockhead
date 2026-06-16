import {
	describe,
	expect,
	it,
} from 'vitest'

import { MediaTransport } from '$/schema/Media.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'

const ipfsCid = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
const arweaveTransactionId = '1234567890123456789012345678901234567890123'

describe('resolveMediaUrlTransport', () => {
	it('rejects empty and unsupported inputs', () => {
		expect(resolveMediaUrlTransport(undefined)).toBeUndefined()
		expect(resolveMediaUrlTransport(null)).toBeUndefined()
		expect(resolveMediaUrlTransport('')).toBeUndefined()
		expect(resolveMediaUrlTransport('   ')).toBeUndefined()
		expect(resolveMediaUrlTransport('ftp://example.com/file.png')).toBeUndefined()
		expect(resolveMediaUrlTransport('data:image/png;base64,AAAA')).toBeUndefined()
		expect(resolveMediaUrlTransport('not-a-cid')).toBeUndefined()
	})

	it('keeps HTTP URLs and protocol-relative URLs as HTTP transport', () => {
		expect(resolveMediaUrlTransport('https://example.com/image.png')).toEqual({
			url: 'https://example.com/image.png',
			transport: MediaTransport.Http,
		})
		expect(resolveMediaUrlTransport('http://example.com/image.png')).toEqual({
			url: 'http://example.com/image.png',
			transport: MediaTransport.Http,
		})
		expect(resolveMediaUrlTransport('//example.com/image.png')).toEqual({
			url: 'https://example.com/image.png',
			transport: MediaTransport.Http,
		})
	})

	it('normalizes IPFS protocol, gateway, subdomain, and bare CID URLs before HTTP fallback', () => {
		expect(resolveMediaUrlTransport(` ipfs:///${ipfsCid}/path.png?x=1#hash `)).toEqual({
			url: `https://ipfs.io/ipfs/${ipfsCid}/path.png?x=1#hash`,
			transport: MediaTransport.Ipfs,
		})
		expect(resolveMediaUrlTransport(`https://gateway.pinata.cloud/ipfs/${ipfsCid}/file.png?x=1#hash`)).toEqual({
			url: `https://ipfs.io/ipfs/${ipfsCid}/file.png?x=1#hash`,
			transport: MediaTransport.Ipfs,
		})
		expect(resolveMediaUrlTransport(`https://${ipfsCid}.ipfs.ipfs.io/path.png?x=1`)).toEqual({
			url: `https://ipfs.io/ipfs/${ipfsCid}/path.png?x=1`,
			transport: MediaTransport.Ipfs,
		})
		expect(resolveMediaUrlTransport(` ${ipfsCid} `)).toEqual({
			url: `https://ipfs.io/ipfs/${ipfsCid}`,
			transport: MediaTransport.Ipfs,
		})
	})

	it('normalizes Arweave protocol, gateway, and bare transaction ids before HTTP fallback', () => {
		expect(resolveMediaUrlTransport(`ar://${arweaveTransactionId}`)).toEqual({
			url: `https://arweave.net/${arweaveTransactionId}`,
			transport: MediaTransport.Arweave,
		})
		expect(resolveMediaUrlTransport(`https://arweave.net/${arweaveTransactionId}?x=1#hash`)).toEqual({
			url: `https://arweave.net/${arweaveTransactionId}?x=1#hash`,
			transport: MediaTransport.Arweave,
		})
		expect(resolveMediaUrlTransport(arweaveTransactionId)).toEqual({
			url: `https://arweave.net/${arweaveTransactionId}`,
			transport: MediaTransport.Arweave,
		})
	})
})
