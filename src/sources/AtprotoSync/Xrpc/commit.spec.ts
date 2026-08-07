import { CID } from 'multiformats/cid'
import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	parseGetHostStatusResponse,
	parseListHostsResponse,
	parseListReposResponse,
	projectAtprotoRepoCommitFromSubscribeReposBody,
} from '$/sources/AtprotoSync/Xrpc/commit.ts'
import { Source } from '$/sources/Source.ts'


const commitCid = CID.parse('bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya')
const recordCid = CID.parse('bafkreidqz2dr7cr5h62etpb4hlhgkr6o6aw7y5h74sgzcjjsu4sl7w7fxe')


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
