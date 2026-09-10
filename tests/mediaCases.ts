import { MediaTransport } from '$/schema/MediaTransport.ts'

const ipfsCid = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
const arweaveTransactionId = '1234567890123456789012345678901234567890123'

export const rejectedMediaUrls = [
	undefined,
	null,
	'',
	'   ',
	'ftp://example.com/file.png',
	'data:image/png;base64,AAAA',
	'not-a-cid',
] as const

// Inputs and independent expected normalization, shared by transport and entity tests.
export const mediaUrlCases = [
	['https://example.com/image.png', 'https://example.com/image.png', MediaTransport.Http],
	['http://example.com/image.png', 'http://example.com/image.png', MediaTransport.Http],
	['//example.com/image.png', 'https://example.com/image.png', MediaTransport.Http],
	[` ipfs:///${ipfsCid}/path.png?x=1#hash `, `https://ipfs.io/ipfs/${ipfsCid}/path.png?x=1#hash`, MediaTransport.Ipfs],
	[`https://gateway.pinata.cloud/ipfs/${ipfsCid}/file.png?x=1#hash`, `https://ipfs.io/ipfs/${ipfsCid}/file.png?x=1#hash`, MediaTransport.Ipfs],
	[`https://${ipfsCid}.ipfs.ipfs.io/path.png?x=1`, `https://ipfs.io/ipfs/${ipfsCid}/path.png?x=1`, MediaTransport.Ipfs],
	[` ${ipfsCid} `, `https://ipfs.io/ipfs/${ipfsCid}`, MediaTransport.Ipfs],
	['ipfs://bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/image.png', 'https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/image.png', MediaTransport.Ipfs],
	[`ar://${arweaveTransactionId}`, `https://arweave.net/${arweaveTransactionId}`, MediaTransport.Arweave],
	[`https://arweave.net/${arweaveTransactionId}?x=1#hash`, `https://arweave.net/${arweaveTransactionId}?x=1#hash`, MediaTransport.Arweave],
	[arweaveTransactionId, `https://arweave.net/${arweaveTransactionId}`, MediaTransport.Arweave],
] as const
