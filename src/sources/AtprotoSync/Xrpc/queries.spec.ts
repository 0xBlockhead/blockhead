import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { encode } from 'cborg'

import bindings from '$/sources/AtprotoSync/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceDelivery,
	SourceEndpointKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'


const sourceFetch = vi.hoisted(() => vi.fn())
const sourceLive = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))
vi.mock('$/sources/_runtime/live.remote.ts', () => ({
	sourceLive,
}))

const {
	getBlocks,
	getHostStatus,
	getLatestCommit,
	getRepo,
	getRepoStatus,
	listHosts,
	listRepos,
	subscribeRepos,
} = await import('$/sources/AtprotoSync/Xrpc/queries.ts')

const remoteQueryBinding = bindings[Source.AtprotoSync_Xrpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteQuery
	&& binding.wireProtocol === WireProtocol.Xrpc
))
const remoteLiveBinding = bindings[Source.AtprotoSync_Xrpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteLive
))

if (remoteQueryBinding == null)
	throw new Error('AtprotoSync_Xrpc: RemoteQuery binding is missing')
if (remoteLiveBinding == null)
	throw new Error('AtprotoSync_Xrpc: RemoteLive binding is missing')

const serviceOrigin = 'https://pds.example'
const did = 'did:plc:example'
const carBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04])

const resolvedRemoteQueryBinding = {
	...remoteQueryBinding,
	endpoints: remoteQueryBinding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: 'https://pds.example',
	})),
}


describe('AtprotoSync_Xrpc getRepo RemoteQuery transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(carBytes, {
			status: 200,
			headers: {
				'content-type': 'application/vnd.ipld.car',
			},
		}))
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('GETs com.atproto.sync.getRepo through sourceFetch with the resolved RemoteQuery binding', async () => {
		await expect(getRepo({
			serviceOrigin,
			did,
			since: '3jzfcijpj2z2a',
		})).resolves.toEqual(carBytes)

		expect(sourceFetch).toHaveBeenCalledTimes(1)
		expect(sourceFetch).toHaveBeenCalledWith(
			resolvedRemoteQueryBinding,
			'https://pds.example/xrpc/com.atproto.sync.getRepo?did=did%3Aplc%3Aexample&since=3jzfcijpj2z2a',
			{
				redirect: 'manual',
				signal: undefined,
			}
		)
		expect(resolvedRemoteQueryBinding.delivery).toBe(SourceDelivery.RemoteQuery)
		expect(remoteQueryBinding.endpoints[0].locator).toBe('https://{pds-host}')
	})

	it('GETs an explicit commit block CAR without acquiring the full repository', async () => {
		await expect(getBlocks({
			serviceOrigin,
			did,
			cids: [
				'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			],
		})).resolves.toEqual(carBytes)

		expect(sourceFetch).toHaveBeenCalledWith(
			resolvedRemoteQueryBinding,
			'https://pds.example/xrpc/com.atproto.sync.getBlocks?did=did%3Aplc%3Aexample&cids=bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			{
				redirect: 'manual',
				signal: undefined,
			}
		)
	})

	it('rejects a block request without a CID before transport', async () => {
		await expect(getBlocks({
			serviceOrigin,
			did,
			cids: [],
		})).rejects.toThrow('getBlocks requires at least one CID')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects malformed block CIDs before transport', async () => {
		await expect(getBlocks({
			serviceOrigin,
			did,
			cids: ['not-a-cid'],
		})).rejects.toThrow('getBlocks received a malformed CID')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects browser-side RemoteQuery before transport', async () => {
		vi.stubGlobal('window', {})

		await expect(getRepo({
			serviceOrigin,
			did,
		})).rejects.toThrow('AtprotoSync_Xrpc: RemoteQuery must run through a SvelteKit query')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed with AtprotoSync_Xrpc prefix on non-OK responses', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			error: 'RepoNotFound',
			message: 'Repo not found',
		}), {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getRepo({
			serviceOrigin,
			did,
		})).rejects.toThrow(/AtprotoSync_Xrpc:.*400/)
	})

	it.each([
		'http://pds.example',
		'https://user:p4ss@pds.example',
		'https://127.0.0.1',
		'https://10.0.0.1',
		'https://169.254.169.254',
		'https://[::1]',
		'https://metadata.google.internal',
		'https://pds.example/override',
	])('rejects unsafe or non-origin service input %s before transport', async (unsafeServiceOrigin) => {
		await expect(getRepo({
			serviceOrigin: unsafeServiceOrigin,
			did,
		})).rejects.toThrow('AtprotoSync_Xrpc: invalid public HTTPS service origin')

		expect(sourceFetch).not.toHaveBeenCalled()
	})
})


describe('AtprotoSync_Xrpc getLatestCommit / getRepoStatus', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('parses getLatestCommit through the RemoteQuery binding', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			cid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			rev: '3jzfcijpj2z2a',
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getLatestCommit({
			serviceOrigin,
			did,
		})).resolves.toEqual({
			commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			rev: '3jzfcijpj2z2a',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			resolvedRemoteQueryBinding,
			'https://pds.example/xrpc/com.atproto.sync.getLatestCommit?did=did%3Aplc%3Aexample',
			{
				redirect: 'manual',
				signal: undefined,
			}
		)
	})

	it('fails closed on malformed getLatestCommit JSON', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			rev: '3jzfcijpj2z2a',
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getLatestCommit({
			serviceOrigin,
			did,
		})).rejects.toThrow('malformed getLatestCommit response')
	})

	it('parses getRepoStatus through the RemoteQuery binding', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			did,
			active: true,
			rev: '3jzfcijpj2z2a',
		}), {
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getRepoStatus({
			serviceOrigin,
			did,
		})).resolves.toEqual({
			did,
			active: true,
			rev: '3jzfcijpj2z2a',
		})
	})

	it('parses listRepos / listHosts / getHostStatus through the RemoteQuery binding', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				repos: [
					{
						did,
						head: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
						rev: '3jzfcijpj2z2a',
						active: true,
					},
				],
				cursor: 'c1',
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				hosts: [
					{
						hostname: 'pds.example',
						seq: 7,
						status: 'active',
					},
				],
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				hostname: 'pds.example',
				seq: 8,
				accountCount: 2,
				status: 'active',
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			}))

		await expect(listRepos({
			serviceOrigin,
			limit: 10,
			cursor: 'prev',
		})).resolves.toEqual({
			repos: [
				{
					did,
					commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
					rev: '3jzfcijpj2z2a',
					active: true,
				},
			],
			cursor: 'c1',
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			1,
			resolvedRemoteQueryBinding,
			'https://pds.example/xrpc/com.atproto.sync.listRepos?limit=10&cursor=prev',
			{
				redirect: 'manual',
				signal: undefined,
			}
		)

		await expect(listHosts({
			serviceOrigin,
			limit: 5,
		})).resolves.toEqual({
			hosts: [
				{
					hostname: 'pds.example',
					seq: 7,
					status: 'active',
				},
			],
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			resolvedRemoteQueryBinding,
			'https://pds.example/xrpc/com.atproto.sync.listHosts?limit=5',
			{
				redirect: 'manual',
				signal: undefined,
			}
		)

		await expect(getHostStatus({
			serviceOrigin,
			hostname: 'pds.example',
		})).resolves.toEqual({
			hostname: 'pds.example',
			seq: 8,
			accountCount: 2,
			status: 'active',
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			3,
			resolvedRemoteQueryBinding,
			'https://pds.example/xrpc/com.atproto.sync.getHostStatus?hostname=pds.example',
			{
				redirect: 'manual',
				signal: undefined,
			}
		)
	})

	it('rejects unsafe listRepos limits before transport', async () => {
		await expect(listRepos({
			serviceOrigin,
			limit: 0,
		})).rejects.toThrow('listRepos limit must be an integer from 1 to 1000')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})


describe('AtprotoSync_Xrpc subscribeRepos RemoteLive transport', () => {
	beforeEach(() => {
		sourceLive.mockReset()
	})

	it('yields binary frames from the existing RemoteLive binding', async () => {
		const frame = new Uint8Array([
			...encode({
				op: 1,
				t: '#commit',
			}),
			...encode({
				sequence: 1,
			}),
		])
		sourceLive.mockImplementation(() => (async function* () {
			yield {
				type: 'connected',
				source: Source.AtprotoSync_Xrpc,
				targetKey: remoteLiveBinding.target.key,
			}
			yield {
				type: 'message',
				source: Source.AtprotoSync_Xrpc,
				targetKey: remoteLiveBinding.target.key,
				payload: frame,
			}
		})())

		const frames = []
		for await (const message of subscribeRepos({
			serviceOrigin,
			cursor: 7,
		}))
			frames.push(message)

		expect(sourceLive).toHaveBeenCalledWith({
			bindingId: sourceBindingId(remoteLiveBinding),
			source: Source.AtprotoSync_Xrpc,
			targetKey: remoteLiveBinding.target.key,
			operationGroup: 'GenericSubscribe',
			serviceOrigin,
			cursor: 7,
		})
		expect(frames).toEqual([{
			type: '#commit',
			body: {
				sequence: 1,
			},
		}])
	})

	it.each([
		-1,
		Number.MAX_SAFE_INTEGER + 1,
	])('rejects unsafe cursor %s before opening the stream', async (cursor) => {
		await expect(async () => {
			for await (const _message of subscribeRepos({
				serviceOrigin,
				cursor,
			}))
				void _message
		}).rejects.toThrow('subscribeRepos cursor must be a non-negative safe integer')

		expect(sourceLive).not.toHaveBeenCalled()
	})

	it.each([
		{
			type: 'message',
			payload: 'not binary',
		},
		{
			type: 'grpc-message',
			messageBase64: '',
		},
	])('rejects non-WebSocket binary data from $type events', async (event) => {
		sourceLive.mockImplementation(() => (async function* () {
			yield {
				...event,
				source: Source.AtprotoSync_Xrpc,
				targetKey: remoteLiveBinding.target.key,
			}
		})())

		await expect(async () => {
			for await (const _message of subscribeRepos({
				serviceOrigin,
			}))
				void _message
		}).rejects.toThrow('AtprotoSync_Xrpc: subscribeRepos received a non-binary WebSocket frame')
	})

	it('returns the remote iterator when aborted and when the consumer unsubscribes', async () => {
		let returned = 0
		sourceLive.mockImplementation(() => ({
			[Symbol.asyncIterator]: () => ({
				next: vi.fn()
					.mockResolvedValueOnce({
						done: false,
						value: {
							type: 'message',
							source: Source.AtprotoSync_Xrpc,
							targetKey: remoteLiveBinding.target.key,
							payload: new Uint8Array([
								...encode({
									op: 1,
									t: '#commit',
								}),
								...encode({}),
							]),
						},
					})
					.mockReturnValue(new Promise(() => {})),
				return: vi.fn(() => {
					returned += 1
					return Promise.resolve({
						done: true,
					})
				}),
			}),
		}))

		const iterator = subscribeRepos({
			serviceOrigin,
		})[Symbol.asyncIterator]()
		await iterator.next()
		await iterator.return()

		expect(returned).toBe(1)

		const controller = new AbortController()
		const abortedIterator = subscribeRepos({
			serviceOrigin,
			signal: controller.signal,
		})[Symbol.asyncIterator]()
		await abortedIterator.next()
		controller.abort()

		expect(returned).toBe(2)
	})

})
