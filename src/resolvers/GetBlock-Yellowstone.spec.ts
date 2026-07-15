import {
	createServer,
	type Http2Server,
	type ServerHttp2Stream,
} from 'node:http2'
import { base58btc } from 'multiformats/bases/base58'
import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { SolanaAccount_TimestampSelector } from '$/schema/SolanaAccount_Timestamp.ts'
import accountUpdate from '$/sources/GetBlock/Yellowstone/fixtures/account-update.json'
import { subscribeSolanaAccountUpdates } from '$/sources/GetBlock/Yellowstone/queries.ts'
import type { SourceLiveRequest } from '$/sources/_runtime/live.server.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const resolverBinding = vi.hoisted(() => ({
	source: 'GetBlockYellowstone_Grpc',
	target: {
		kind: 'Caip2Network',
		key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
	endpoints: [{
		endpointKind: 'HttpUrl',
		locator: 'http://127.0.0.1/{accessToken}',
	}],
	wireProtocol: 'Grpc',
	apiFamily: 'GrpcService',
	operationGroups: ['GenericSubscribe'],
	delivery: 'RemoteLive',
	credentials: [{
		scope: 'RuntimeSecret',
	}],
	serverCredentialId: 'getblock-yellowstone-test',
}))

vi.mock('$/sources/$sourceProviders.ts', () => ({
	sourceProviderDefinitions: [{
		bindings: [resolverBinding],
	}],
}))
vi.mock('$/sources/index.server.ts', () => ({
	remoteLiveBindings: [resolverBinding],
}))
vi.mock('$/sources/$sourceServerCredentials.server.ts', () => ({
	sourceServerCredentialsById: {
		'getblock-yellowstone-test': {
			envKey: 'GETBLOCK_API_KEY',
			injection: {
				endpointTemplate: {
					slot: 'accessToken',
				},
			},
		},
	},
}))
vi.mock('$/sources/_runtime/live.remote.ts', async () => {
	const { iterateSourceLive } = await import('$/sources/_runtime/live.server.ts')
	return {
		sourceLive: (request: SourceLiveRequest) => {
			const requestAbortController = new AbortController()
			const iterator = iterateSourceLive(
				request,
				requestAbortController.signal
			)[Symbol.asyncIterator]()
			return {
				[Symbol.asyncIterator]: () => ({
					next: () => iterator.next(),
					return: async () => {
						requestAbortController.abort()
						return iterator.return()
					},
				}),
			}
		},
	}
})

const { default: getBlockYellowstone } = await import('$/resolvers/GetBlock-Yellowstone.ts')
const servers: Http2Server[] = []
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
const frame = (message: Uint8Array) => {
	const bytes = new Uint8Array(message.length + 5)
	new DataView(bytes.buffer).setUint32(1, message.length)
	bytes.set(message, 5)
	return bytes
}
const startServer = async (
	handle: (stream: ServerHttp2Stream) => void
): Promise<{
	locator: string
	requestBody: Uint8Array[]
}> => {
	const requestBody: Uint8Array[] = []
	const server = createServer()
	servers.push(server)
	server.on('stream', (stream, headers) => {
		stream.on('data', (chunk: Buffer) => requestBody.push(new Uint8Array(chunk)))
		expect(headers[':path']).toBe('/test-token/geyser.Geyser/Subscribe')
		expect(headers['content-type']).toBe('application/grpc')
		handle(stream)
	})
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
	// Node returns AddressInfo for TCP listeners; this guard protects the test harness boundary.
	const address = server.address()
	if (address == null || typeof address === 'string')
		throw new Error('Yellowstone test HTTP/2 server did not acquire a TCP port')
	return {
		locator: `http://127.0.0.1:${address.port}/{accessToken}`,
		requestBody,
	}
}
const respond = (
	stream: ServerHttp2Stream,
	status: string,
	message?: Uint8Array
) => {
	stream.respond({
		':status': 200,
		'content-type': 'application/grpc',
	}, { waitForTrailers: true })
	stream.once('wantTrailers', () => stream.sendTrailers({
		'grpc-status': status,
		...(status === '0' ? {} : { 'grpc-message': 'permission denied' }),
	}))
	stream.end(message == null ? undefined : frame(message))
}
const binding = (locator: string) => ({
	provider: SourceProvider.GetBlock,
	source: Source.GetBlockYellowstone_Grpc,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator,
	}],
	wireProtocol: WireProtocol.Grpc,
	apiFamily: ApiFamily.GrpcService,
	operationGroups: [SourceOperationGroup.GenericSubscribe],
	delivery: SourceDelivery.RemoteLive,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
	}],
	serverCredentialId: 'getblock-yellowstone-test',
} as const satisfies SourceBinding)
const network = {
	caip2: {
		namespace: 'solana',
		reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

afterEach(async () => {
	delete process.env.GETBLOCK_API_KEY
	await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))))
})

describe('GetBlock Yellowstone account source', () => {
	it('executes the default managed gRPC path and maps the selector', async () => {
		process.env.GETBLOCK_API_KEY = 'test-token'
		const server = await startServer((stream) => respond(stream, '0', accountUpdateMessage))
		resolverBinding.endpoints[0].locator = server.locator
		const updates = subscribeSolanaAccountUpdates(binding(server.locator), {
			accounts: [accountUpdate.account],
			commitment: 'confirmed',
		})
		const received = []
		for await (const update of updates)
			received.push(update)
		expect(received).toEqual([accountUpdate])
		expect(new TextDecoder().decode(concatBytes(server.requestBody))).toContain(accountUpdate.account)

		const resolved = await getBlockYellowstone.resolvers[0].resolve[SolanaAccount_TimestampSelector.AccountSlotSource]({
			$account: {
				$network: network,
				pubkey: accountUpdate.account,
			},
			slot: BigInt(accountUpdate.slot),
			source: Source.GetBlockYellowstone_Grpc,
		}, context)
		expect(resolved).toMatchObject({
			timestampMs: accountUpdate.timestampMs,
			lamports: BigInt(accountUpdate.lamports),
			$ownerProgram: {
				[EntityMetaKey.Selector]: {
					programId: accountUpdate.ownerProgramId,
				},
			},
			executable: false,
			rentEpoch: BigInt(accountUpdate.rentEpoch),
			spaceBytes: accountUpdate.spaceBytes,
			dataEncoding: 'base64',
		})
	})

	it('fails closed for missing authentication and gRPC errors', async () => {
		const server = await startServer((stream) => respond(stream, '7'))
		resolverBinding.endpoints[0].locator = server.locator
		await expect(async () => {
			for await (const _update of subscribeSolanaAccountUpdates(binding(server.locator), {
				accounts: [accountUpdate.account],
				commitment: 'confirmed',
			})) {
			}
		}).rejects.toThrow('missing runtime credential GETBLOCK_API_KEY')

		process.env.GETBLOCK_API_KEY = 'test-token'
		await expect(async () => {
			for await (const _update of subscribeSolanaAccountUpdates(binding(server.locator), {
				accounts: [accountUpdate.account],
				commitment: 'confirmed',
			})) {
			}
		}).rejects.toThrow('gRPC 7: permission denied')
	})

	it('cancels a quiet managed stream across the remote boundary', async () => {
		process.env.GETBLOCK_API_KEY = 'test-token'
		let opened = false
		let closed = false
		const server = await startServer((stream) => {
			opened = true
			stream.respond({
				':status': 200,
				'content-type': 'application/grpc',
			})
			stream.once('close', () => {
				closed = true
			})
		})
		resolverBinding.endpoints[0].locator = server.locator
		const abortController = new AbortController()
		const updates = subscribeSolanaAccountUpdates(binding(server.locator), {
			accounts: [accountUpdate.account],
			commitment: 'confirmed',
		}, abortController.signal)[Symbol.asyncIterator]()
		const pendingUpdate = updates.next()
		await vi.waitFor(() => expect(opened).toBe(true))
		abortController.abort()
		await expect(pendingUpdate).resolves.toEqual({ done: true, value: undefined })
		await vi.waitFor(() => expect(closed).toBe(true))
	})

	it('owns the schema-supported account observation fields', () => {
		expect(Object.keys(getBlockYellowstone.resolvers[0].projections).sort()).toEqual([
			'$ownerProgram',
			'dataEncoding',
			'executable',
			'lamports',
			'rentEpoch',
			'spaceBytes',
			'timestampMs',
		].sort())
	})
})
