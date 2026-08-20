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

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import accountUpdate from '$/sources/GetBlock/Yellowstone/fixtures/account-update.json'
import { subscribeSolanaAccountUpdates } from '$/sources/GetBlock/Yellowstone/queries.ts'
import type { SourceLiveRequest } from '$/sources/_runtime/live.server.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const resolverBinding = vi.hoisted(() => ({
	source: 'GetBlockYellowstone_Grpc',
	target: {
		kind: 'Caip2Network',
		key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
	endpoints: [{
		endpointKind: 'HttpUrl',
		locator: 'https://go.getblock.io/{GETBLOCK_API_KEY}/',
		corsEnabled: false,
	}],
	wireProtocol: 'Grpc',
	apiFamily: 'GrpcService',
	operationGroups: ['GenericSubscribe'],
	delivery: 'RemoteLive',
	credentials: [{
		scope: 'RuntimeSecret',
	}],
	artifacts: [{
		kind: 'HandwrittenTypes',
		path: 'src/sources/GetBlock/Yellowstone/types.ts',
		referenceUrl: 'https://getblock.io/docs/yellowstone-grpc/',
	}],
}))
const alternateBinding = vi.hoisted(() => ({
	...resolverBinding,
	target: {
		...resolverBinding.target,
		key: 'solana:alternate',
	},
}))

vi.mock('$/sources/index.server.ts', () => ({
	remoteLiveBindings: [
		resolverBinding,
		alternateBinding,
	],
}))
vi.mock('$/sources/GetBlock/bindings.ts', () => ({
	default: {
		GetBlockYellowstone_Grpc: [resolverBinding],
	},
}))
vi.mock('$/sources/$sourceServerCredentials.server.ts', () => ({
	default: new Map([[
		JSON.stringify([
			resolverBinding.source,
			resolverBinding.target.kind,
			resolverBinding.target.key,
			resolverBinding.delivery,
			resolverBinding.apiFamily,
		]),
		{
			envKey: 'GETBLOCK_API_KEY',
			injection: {
				endpointTemplate: {
					slot: 'GETBLOCK_API_KEY',
				},
			},
		},
	]]),
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

const accountResolver = getBlockYellowstone.resolvers.find((
	resolver
): resolver is Extract<
	typeof getBlockYellowstone.resolvers[number],
	{ entityType: EntityType.SolanaAccount }
> => resolver.entityType === EntityType.SolanaAccount)

const timestampResolver = getBlockYellowstone.resolvers.find((
	resolver
): resolver is Extract<
	typeof getBlockYellowstone.resolvers[number],
	{ entityType: EntityType.SolanaAccount_Timestamp }
> => resolver.entityType === EntityType.SolanaAccount_Timestamp)

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
		locator: `http://127.0.0.1:${address.port}/{GETBLOCK_API_KEY}`,
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
	sourceBinding: resolverBinding,
}

afterEach(async () => {
	delete process.env.GETBLOCK_API_KEY
	await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))))
})

describe('GetBlock Yellowstone account source', () => {
	it('rejects an exact binding id whose target does not match the subscription', async () => {
		const { iterateSourceLive } = await import('$/sources/_runtime/live.server.ts')

		await expect(iterateSourceLive({
			bindingId: sourceBindingId(alternateBinding),
			source: Source.GetBlockYellowstone_Grpc,
			targetKey: resolverBinding.target.key,
			operationGroup: 'GenericSubscribe',
		}).next()).rejects.toThrow('RemoteLive request does not match binding')
	})

	it('executes the default managed gRPC path and maps the selector', async () => {
		process.env.GETBLOCK_API_KEY = 'test-token'
		const server = await startServer((stream) => respond(stream, '0', accountUpdateMessage))
		resolverBinding.endpoints[0].locator = server.locator
		const updates = subscribeSolanaAccountUpdates(resolverBinding, {
			accounts: [accountUpdate.account],
			commitment: 'confirmed',
		})
		const received = []
		for await (const update of updates)
			received.push(update)
		expect(received).toEqual([accountUpdate])
		expect(new TextDecoder().decode(concatBytes(server.requestBody))).toContain(accountUpdate.account)

		expect(accountResolver).toBeDefined()
		expect(timestampResolver).toBeDefined()
		const resolved = await timestampResolver.resolve.AccountSlotSource.resolve({
			$account: {
				$network: network,
				pubkey: accountUpdate.account,
			},
			slot: BigInt(accountUpdate.slot),
			source: Source.GetBlockYellowstone_Grpc,
		}, context)
		expect(resolved).toMatchObject({
			$account: {
				[EntityMetaKey.Selector]: {
					pubkey: accountUpdate.account,
				},
			},
			slot: BigInt(accountUpdate.slot),
			source: Source.GetBlockYellowstone_Grpc,
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
			for await (const _update of subscribeSolanaAccountUpdates(resolverBinding, {
				accounts: [accountUpdate.account],
				commitment: 'confirmed',
			})) {
			}
		}).rejects.toThrow('missing runtime credential GETBLOCK_API_KEY')

		process.env.GETBLOCK_API_KEY = 'test-token'
		await expect(async () => {
			for await (const _update of subscribeSolanaAccountUpdates(resolverBinding, {
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
		const updates = subscribeSolanaAccountUpdates(resolverBinding, {
			accounts: [accountUpdate.account],
			commitment: 'confirmed',
		}, abortController.signal)[Symbol.asyncIterator]()
		const pendingUpdate = updates.next()
		await vi.waitFor(() => expect(opened).toBe(true))
		abortController.abort()
		await expect(pendingUpdate).resolves.toEqual({ done: true, value: undefined })
		await vi.waitFor(() => expect(closed).toBe(true))
	})

	it('projects a SolanaAccount tip observation with spaceBytes from the live index', async () => {
		process.env.GETBLOCK_API_KEY = 'test-token'
		const server = await startServer((stream) => respond(stream, '0', accountUpdateMessage))
		resolverBinding.endpoints[0].locator = server.locator

		expect(accountResolver).toBeDefined()
		const resolved = await accountResolver.resolve.NetworkPubkey.resolve({
			$network: network,
			pubkey: accountUpdate.account,
		}, context)
		expect(resolved.$$timestamps).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: network,
						pubkey: accountUpdate.account,
					},
					slot: BigInt(accountUpdate.slot),
					source: Source.GetBlockYellowstone_Grpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'timestampMs')]: accountUpdate.timestampMs,
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'lamports')]: BigInt(accountUpdate.lamports),
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], '$ownerProgram')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							programId: accountUpdate.ownerProgramId,
						},
					},
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'executable')]: false,
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'rentEpoch')]: BigInt(accountUpdate.rentEpoch),
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'spaceBytes')]: accountUpdate.spaceBytes,
					[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'dataEncoding')]: 'base64',
				},
			},
		])
	})

})
