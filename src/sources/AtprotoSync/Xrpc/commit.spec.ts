import {
	encode,
	Tagged,
} from 'cborg'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	parseGetHostStatusResponse,
	parseListHostsResponse,
	parseListReposResponse,
	projectAtprotoRepoCommitBlock,
	projectAtprotoRepoCommitFromSubscribeReposBody,
} from '$/sources/AtprotoSync/Xrpc/commit.ts'
import { Source } from '$/sources/Source.ts'


const commitCid = CID.parse('bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya')
const recordCid = CID.parse('bafkreidqz2dr7cr5h62etpb4hlhgkr6o6aw7y5h74sgzcjjsu4sl7w7fxe')

const cidLink = (cid: CID) => new Tagged(42, new Uint8Array([
	0,
	...cid.bytes,
]))

const unsignedVarint = (value: number) => {
	const bytes: number[] = []
	let remaining = value
	do {
		bytes.push((remaining & 0x7f) | (remaining > 0x7f ? 0x80 : 0))
		remaining = Math.floor(remaining / 128)
	} while (remaining > 0)
	return new Uint8Array(bytes)
}

const concatenateBytes = (...parts: Uint8Array[]) => {
	const bytes = new Uint8Array(parts.reduce((length, part) => length + part.byteLength, 0))
	let offset = 0
	for (const part of parts) {
		bytes.set(part, offset)
		offset += part.byteLength
	}
	return bytes
}


describe('AtprotoSync #commit → AtprotoRepoCommit projection', () => {
	it('maps enrolled firehose commit fields without inventing historical CAR state', () => {
		expect(projectAtprotoRepoCommitFromSubscribeReposBody({
			body: {
				seq: 42,
				rebase: false,
				tooBig: false,
				repo: 'did:plc:example',
				commit: commitCid,
				rev: '3jzfcijpj2z2a',
				since: '3jzfcijpj2z29',
				blocks: new Uint8Array([1, 2, 3, 4]),
				ops: [
					{
						action: 'create',
						path: 'app.bsky.feed.post/3jzfcijpj2z2a',
						cid: recordCid,
					},
					{
						action: 'delete',
						path: 'app.bsky.feed.like/old',
						cid: null,
					},
				],
				blobs: [commitCid],
				time: '2024-06-01T12:00:00.000Z',
				prevData: commitCid,
			},
			serviceOrigin: 'https://bsky.network',
		})).toEqual({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			source: Source.AtprotoSync_Xrpc,
			commitCid: commitCid.toString(),
			previousRev: '3jzfcijpj2z29',
			previousDataCid: commitCid.toString(),
			sequence: 42n,
			relayHost: 'bsky.network',
			time: Date.parse('2024-06-01T12:00:00.000Z'),
			tooBig: false,
			rebase: false,
			operationCount: 2,
			blobCount: 1,
			carByteLength: 4,
			operationPaths: [
				'app.bsky.feed.post/3jzfcijpj2z2a',
				'app.bsky.feed.like/old',
			],
			createdRecordCids: [
				recordCid.toString(),
			],
			updatedRecordCids: [],
			deletedRecordPaths: [
				'app.bsky.feed.like/old',
			],
			$$posts: [
				{
					uri: 'at://did:plc:example/app.bsky.feed.post/3jzfcijpj2z2a',
				},
			],
		})
	})

	it('fails closed on malformed required commit fields', () => {
		expect(() => projectAtprotoRepoCommitFromSubscribeReposBody({
			body: {
				seq: 1,
			},
		})).toThrow('malformed #commit body')
	})
})


describe('AtprotoSync getBlocks CAR → repository commit projection', () => {
	it('binds the requested CAR root to its signed repository commit facts', async () => {
		const dataCid = CID.createV1(0x71, await sha256.digest(new Uint8Array([1, 2, 3])))
		const previousDataCid = CID.createV1(0x71, await sha256.digest(new Uint8Array([4, 5, 6])))
		const blockBytes = encode({
			did: 'did:plc:example',
			version: 3,
			data: cidLink(dataCid),
			rev: '3jzfcijpj2z2a',
			prev: cidLink(previousDataCid),
			sig: new Uint8Array([7, 8, 9]),
		})
		const rootCid = CID.createV1(0x71, await sha256.digest(blockBytes))
		const headerBytes = encode({
			version: 1,
			roots: [cidLink(rootCid)],
		})
		const car = concatenateBytes(
			unsignedVarint(headerBytes.byteLength),
			headerBytes,
			unsignedVarint(rootCid.bytes.byteLength + blockBytes.byteLength),
			rootCid.bytes,
			blockBytes
		)

		await expect(projectAtprotoRepoCommitBlock({
			car,
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			commitCid: rootCid.toString(),
		})).resolves.toEqual({
			rev: '3jzfcijpj2z2a',
			dataCid: dataCid.toString(),
			previousDataCid: previousDataCid.toString(),
			carByteLength: car.byteLength,
		})
	})

	it('rejects a CAR whose declared root is not the requested commit', async () => {
		const otherCid = CID.createV1(0x71, await sha256.digest(new Uint8Array([9])))
		const headerBytes = encode({
			version: 1,
			roots: [cidLink(otherCid)],
		})

		await expect(projectAtprotoRepoCommitBlock({
			car: concatenateBytes(unsignedVarint(headerBytes.byteLength), headerBytes),
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			commitCid: commitCid.toString(),
		})).rejects.toThrow('CAR root does not match requested commit CID')
	})

	it('rejects commit bytes that do not match the declared CAR block CID', async () => {
		const declaredCid = CID.createV1(0x71, await sha256.digest(new Uint8Array([1])))
		const blockBytes = encode({
			did: 'did:plc:example',
			version: 3,
			data: cidLink(recordCid),
			rev: '3jzfcijpj2z2a',
			prev: null,
			sig: new Uint8Array([7]),
		})
		const headerBytes = encode({
			version: 1,
			roots: [cidLink(declaredCid)],
		})

		await expect(projectAtprotoRepoCommitBlock({
			car: concatenateBytes(
				unsignedVarint(headerBytes.byteLength),
				headerBytes,
				unsignedVarint(declaredCid.bytes.byteLength + blockBytes.byteLength),
				declaredCid.bytes,
				blockBytes
			),
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			commitCid: declaredCid.toString(),
		})).rejects.toThrow('does not match its CID digest')
	})
})


describe('AtprotoSync listRepos / listHosts / getHostStatus envelopes', () => {
	it('parses listRepos tip rows with fail-closed head CIDs', () => {
		expect(parseListReposResponse({
			repos: [
				{
					did: 'did:plc:example',
					head: commitCid.toString(),
					rev: '3jzfcijpj2z2a',
					active: true,
					extra: 'strip-me',
				},
			],
			cursor: 'next',
		})).toEqual({
			repos: [
				{
					did: 'did:plc:example',
					commitCid: commitCid.toString(),
					rev: '3jzfcijpj2z2a',
					active: true,
				},
			],
			cursor: 'next',
		})
	})

	it('fails closed on malformed listRepos head CIDs', () => {
		expect(() => parseListReposResponse({
			repos: [
				{
					did: 'did:plc:example',
					head: 'not-a-cid',
					rev: '3jzfcijpj2z2a',
				},
			],
		})).toThrow('malformed head CID')
	})

	it('parses listHosts and getHostStatus relay rows', () => {
		expect(parseListHostsResponse({
			hosts: [
				{
					hostname: 'pds.example',
					seq: 9,
					accountCount: 3,
					status: 'active',
				},
			],
		})).toEqual({
			hosts: [
				{
					hostname: 'pds.example',
					seq: 9,
					accountCount: 3,
					status: 'active',
				},
			],
		})
		expect(parseGetHostStatusResponse({
			hostname: 'pds.example',
			seq: 11,
			status: 'idle',
		})).toEqual({
			hostname: 'pds.example',
			seq: 11,
			status: 'idle',
		})
	})

	it('fails closed on malformed listHosts JSON', () => {
		expect(() => parseListHostsResponse({
			hosts: [
				{
					seq: 1,
				},
			],
		})).toThrow('malformed listHosts response')
	})
})
