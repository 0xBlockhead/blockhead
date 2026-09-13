import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

import {
	beforeEach,
	expect,
	expectTypeOf,
	it,
	vi,
} from 'vitest'

import { buildClientSchema, buildSchema, isObjectType, isInterfaceType, isInputObjectType, parse, validate } from 'graphql'
import type { CorsAwareFetchOptions } from '$/lib/http.ts'
import {
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))

vi.mock('$/lib/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/lib/http.ts')>(),
	corsFetch,
}))

const {
	getMessariAmmProfile,
	getMessariGraphqlBinding,
	getMessariAmmFinancialsAtBlockHash,
	getMessariAmmFinancialsLatest,
	getMessariBlockDeployment,
	getMessariEvmBlockAtHash,
	messariGraphqlProfiles,
} = await import('./direct.ts')

const evidenceDir = fileURLToPath(new URL('./fixtures/', import.meta.url))
const cases = [
	{
		name: 'Uniswap',
		deployment: 'uniswap-v3-arbitrum' as const,
		introspection: 'live-uniswap-arbitrum-introspection.json',
		query: 'live-uniswap-arbitrum-introspection.json.query.json',
	},
	{
		name: 'SushiSwap',
		deployment: 'sushiswap-v3-arbitrum' as const,
		introspection: 'live-sushiswap-arbitrum-introspection.json',
		query: 'live-sushiswap-arbitrum-introspection.json.query.json',
	},
]

const textResponseFromCapture = async (file: string) => {
	const text = file.endsWith('.query.json')
		? await readFile(resolve(evidenceDir, file), 'utf8')
		: gunzipSync(Buffer.from(await readFile(resolve(evidenceDir, file + '.gz.base64'), 'utf8'), 'base64')).toString('utf8')
	const capture = JSON.parse(text)
	const responseText = capture.response.result.content.find((block: { type: string }) => block.type === 'text')?.text
	if (typeof responseText !== 'string')
		throw new Error(`Missing captured GraphQL response text: ${file}`)
	return JSON.parse(responseText)
}

it('resolves both profiles to stable canonical binding objects without transport', () => {
	for (const { deployment } of cases) {
		const binding = getMessariGraphqlBinding(deployment)
		expect(binding.target.key).toBe(`messari-subgraph:${messariGraphqlProfiles[deployment].subgraphId}`)
		expect(getMessariGraphqlBinding(deployment)).toBe(binding)
	}

	expect(corsFetch).not.toHaveBeenCalled()
})

it('indexes native protocol/network applicability and preserves manifest versus deployed versions', () => {
	for (const { deployment } of cases) {
		const profile = messariGraphqlProfiles[deployment]
		const selected = getMessariAmmProfile({ protocolKey: profile.protocolKey, caip2: profile.caip2 })
		expect(selected.deployment).toBe(deployment)
		expect(selected.profile).toBe(profile)
		expect(selected.profile.expectedManifestSchemaVersion).toBe('4.0.1')
	}
	const sushi = getMessariAmmProfile({ protocolKey: 'sushiswap-v3', caip2: { namespace: 'eip155', reference: '42161' } })
	expect(sushi.profile.schemaVersion).toBe('4.0.0')
	for (const input of [
		{ protocolKey: 'unknown', caip2: { namespace: 'eip155', reference: '42161' } },
		{ protocolKey: 'uniswap-v3', caip2: { namespace: 'eip155', reference: '1' } },
		{ protocolKey: 'uniswap-v3', caip2: { namespace: 'other', reference: '42161' } },
	]) expect(() => getMessariAmmProfile(input)).toThrow(/does not support/)
	expect(corsFetch).not.toHaveBeenCalled()
})

it('chooses one explicit block authority per supported network', () => {
	expect(getMessariBlockDeployment({ namespace: 'eip155', reference: '42161' })).toBe('uniswap-v3-arbitrum')
	for (const caip2 of [
		{ namespace: 'eip155', reference: '1' },
		{ namespace: 'other', reference: '42161' },
	]) expect(() => getMessariBlockDeployment(caip2)).toThrow(/does not support/)
})

it('loads exact block metadata without querying a provider-shaped protocol entity', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const blockHash = envelope.data._meta.block.hash
	setGraphResponse(envelope)
	const result = await getMessariEvmBlockAtHash({
		binding: getMessariGraphqlBinding('uniswap-v3-arbitrum'),
		deployment: 'uniswap-v3-arbitrum',
		blockHash,
	})
	expect(result).toEqual(envelope.data._meta.block)
	const body = JSON.parse(corsFetch.mock.lastCall?.[1].init.body)
	expect(body.variables).toEqual({ block: { hash: blockHash } })
	expect(body.query).not.toContain('dexAmmProtocols')
})

it('rejects a partial exact block instead of claiming the accepted height/time view', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const blockHash = envelope.data._meta.block.hash
	envelope.data._meta.block.timestamp = null
	setGraphResponse(envelope)
	await expect(getMessariEvmBlockAtHash({
		binding: getMessariGraphqlBinding('uniswap-v3-arbitrum'),
		deployment: 'uniswap-v3-arbitrum',
		blockHash,
	})).rejects.toThrow(/timestamp unavailable/)
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

const deploymentBinding = (deployment: typeof cases[number]['deployment']): SourceBinding => {
	return getMessariGraphqlBinding(deployment)
}

const setGraphResponse = (response: unknown, status = 200) => {
	corsFetch.mockResolvedValueOnce(new Response(JSON.stringify(response), {
		status,
		headers: { 'Content-Type': 'application/json' },
	}))
}

it('uses native Hash32 inference, preserves digit casing, and rejects wrong byte lengths', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const hash = envelope.data._meta.block.hash
	const uppercaseDigits = '0x' + hash.slice(2).toUpperCase()
	envelope.data._meta.block.hash = uppercaseDigits
	setGraphResponse(envelope)
	const result = await getMessariAmmFinancialsAtBlockHash({
		binding: getMessariGraphqlBinding('uniswap-v3-arbitrum'),
		deployment: 'uniswap-v3-arbitrum',
		blockHash: hash,
	})
	expectTypeOf(result.block.hash).toEqualTypeOf<`0x${string}`>()
	expect(result.block.hash).toBe(uppercaseDigits)
	for (const invalid of ['0x' + 'a'.repeat(63), '0x' + 'a'.repeat(65), '0X' + 'a'.repeat(64)]) {
		await expect(getMessariAmmFinancialsAtBlockHash({
			binding: getMessariGraphqlBinding('uniswap-v3-arbitrum'),
			deployment: 'uniswap-v3-arbitrum',
			blockHash: invalid,
		})).rejects.toThrow(/32-byte block hash/)
	}
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

const sentGraphRequest = () => {
	const [url, options] = corsFetch.mock.calls.at(-1) as [string, { init: RequestInit }]
	const body = JSON.parse(options.init.body as string)
	return { url, body }
}

beforeEach(() => {
	corsFetch.mockReset()
})

for (const sample of cases) {
	it(`uses queryTheGraph transport and validates latest response for captured ${sample.name} deployment`, async () => {
		const envelope = await textResponseFromCapture(sample.query)
		setGraphResponse(envelope)
		const binding = deploymentBinding(sample.deployment)
		const result = await getMessariAmmFinancialsLatest({ binding, deployment: sample.deployment })
		const { url, body } = sentGraphRequest()
		const introspection = await textResponseFromCapture(sample.introspection)
		const schema = buildClientSchema(introspection.data)
		const capability = buildSchema(await readFile(new URL('./schema.graphql', import.meta.url), 'utf8'))
		for (const selected of Object.values(capability.getTypeMap())) {
			if (selected.name.startsWith('__')) continue
			const deployed = schema.getType(selected.name)
			if (isObjectType(selected) || isInterfaceType(selected)) {
				if (!isObjectType(deployed) && !isInterfaceType(deployed))
					throw new Error('Missing deployed output type ' + selected.name)
				for (const field of Object.values(selected.getFields())) {
					const actual = deployed.getFields()[field.name]
					expect(String(actual.type)).toBe(String(field.type))
					expect(actual.args.map((arg) => [arg.name, String(arg.type), arg.defaultValue]))
						.toEqual(field.args.map((arg) => [arg.name, String(arg.type), arg.defaultValue]))
				}
			} else if (isInputObjectType(selected)) {
				if (!isInputObjectType(deployed))
					throw new Error('Missing deployed input type ' + selected.name)
				for (const field of Object.values(selected.getFields()))
					expect(String(deployed.getFields()[field.name].type)).toBe(String(field.type))
			}
		}

		expect(url).toBe(`https://gateway.thegraph.com/api/subgraphs/id/${messariGraphqlProfiles[sample.deployment].subgraphId}`)
		expect(validate(schema, parse(body.query)).map((error) => error.message)).toEqual([])
		expect(body.variables).toEqual({ protocolId: messariGraphqlProfiles[sample.deployment].protocolId })
		expect(result.deployment).toBe(messariGraphqlProfiles[sample.deployment].deployment)
		expect(result.protocol.schemaVersion).toBe(sample.deployment === 'uniswap-v3-arbitrum' ? '4.0.1' : '4.0.0')
		expect(result.block.hash).toEqual(envelope.data._meta.block.hash)
		expect(result.protocol.totalValueLockedUSD).toBe(envelope.data.dexAmmProtocols[0].totalValueLockedUSD)
	})

	it(`uses same-selector exact hash query and verifies returned coordinate on ${sample.name}`, async () => {
		const envelope = await textResponseFromCapture(sample.query)
		const blockHash = envelope.data._meta.block.hash as string
		setGraphResponse(envelope)
		const binding = deploymentBinding(sample.deployment)
		const result = await getMessariAmmFinancialsAtBlockHash({ binding, deployment: sample.deployment, blockHash })
		const { body } = sentGraphRequest()
		const introspection = await textResponseFromCapture(sample.introspection)
		const schema = buildClientSchema(introspection.data)

		expect(validate(schema, parse(body.query)).map((error) => error.message)).toEqual([])
		expect(body.variables.block).toEqual({ hash: blockHash })
		expect(result.block.hash?.toLowerCase()).toBe(blockHash.toLowerCase())
		expectTypeOf(result.block.hash).toEqualTypeOf<`0x${string}`>()
	})
}

it('preserves null hash/timestamp on latest reads without claiming exact identity', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	envelope.data._meta.block.hash = null
	envelope.data._meta.block.timestamp = null
	setGraphResponse(envelope)
	const result = await getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
	})
	expect(result.block).toMatchObject({ hash: null, timestamp: null })
})

it.each([
	['GraphQL error', { errors: [{ message: 'historical block pruned' }] }, /The Graph query error: historical block pruned/],
	['missing data', { data: null }, /The Graph query returned no data/],
	['wrong deployment', null, /deployment identity mismatch/],
	['indexing errors', null, /indexing errors/],
	['schema capability mismatch', null, /capability\/version identity mismatch/],
	['malformed decimal', null, /totalValueLockedUSD/],
	['missing protocol row', null, /expected one pinned protocol row, received 0/],
])('rejects %s from direct source response', async (label, override, error) => {
	const envelope = await textResponseFromCapture(cases[0].query)
	if (label === 'wrong deployment') envelope.data._meta.deployment = 'QmWrongDeployment'
	if (label === 'indexing errors') envelope.data._meta.hasIndexingErrors = true
	if (label === 'schema capability mismatch') envelope.data.dexAmmProtocols[0].schemaVersion = '9.9.9'
	if (label === 'malformed decimal') envelope.data.dexAmmProtocols[0].totalValueLockedUSD = 1
	if (label === 'missing protocol row') envelope.data.dexAmmProtocols = []
	setGraphResponse(override ?? envelope)
	await expect(getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
	})).rejects.toThrow(error as RegExp)
})

it('rejects malformed exact hash before transport', async () => {
	await expect(getMessariAmmFinancialsAtBlockHash({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		blockHash: 'not-a-block-hash',
	})).rejects.toThrow(/32-byte block hash/)
	expect(corsFetch).not.toHaveBeenCalled()
})

it('verifies the requested height alongside the hash when supplied', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	setGraphResponse(envelope)
	await expect(getMessariAmmFinancialsAtBlockHash({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		blockHash: envelope.data._meta.block.hash,
		blockNumber: envelope.data._meta.block.number + 1,
	})).rejects.toThrow(/block number mismatch/)
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

it('exact hash retrieval rejects null/mismatched coordinates and never retries latest', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const requestedHash = envelope.data._meta.block.hash as string
	envelope.data._meta.block.hash = null
	setGraphResponse(envelope)
	await expect(getMessariAmmFinancialsAtBlockHash({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		blockHash: requestedHash,
	})).rejects.toThrow(/block hash mismatch or unavailable/)
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

it('exact hash retrieval rejects a different non-null fork coordinate', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const requestedHash = envelope.data._meta.block.hash as string
	envelope.data._meta.block.hash = `0x${'ab'.repeat(32)}`
	setGraphResponse(envelope)
	await expect(getMessariAmmFinancialsAtBlockHash({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		blockHash: requestedHash,
	})).rejects.toThrow(/block hash mismatch or unavailable/)
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

it('rejects a binding enrolled for another deployment before transport', async () => {
	await expect(getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[1].deployment,
	})).rejects.toThrow(/pinned subgraph route/)
	expect(corsFetch).not.toHaveBeenCalled()
})

it('rejects non-OK HTTP response without parsing it as an empty result', async () => {
	setGraphResponse({ data: null }, 503)
	await expect(getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
	})).rejects.toThrow(/503/)
})

it('rejects extra unrelated rows instead of silently filtering a partial identity match', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	envelope.data.dexAmmProtocols.push({ ...envelope.data.dexAmmProtocols[0], id: '0xwrong' })
	setGraphResponse(envelope)
	await expect(getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
	})).rejects.toThrow(/expected one pinned protocol row, received 2/)
})

it.each(['id', 'network', 'subgraphVersion', 'methodologyVersion'])('rejects mismatched response %s identity', async (field) => {
	const envelope = await textResponseFromCapture(cases[0].query)
	envelope.data.dexAmmProtocols[0][field] = 'wrong'
	setGraphResponse(envelope)
	await expect(getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
	})).rejects.toThrow(/identity mismatch/)
})

it('rejects an already-aborted request before transport', async () => {
	setGraphResponse(await textResponseFromCapture(cases[0].query))
	const controller = new AbortController()
	const reason = new Error('consumer cancelled')
	controller.abort(reason)
	await expect(getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		signal: controller.signal,
	})).rejects.toBe(reason)
	expect(corsFetch).not.toHaveBeenCalled()
})

it('forwards cancellation while exact transport is pending without a latest retry', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const controller = new AbortController()
	const reason = new Error('exact consumer cancelled')
	corsFetch.mockImplementationOnce((_url: string, options: CorsAwareFetchOptions) => {
		expect(options.init?.signal).toBe(controller.signal)
		return new Promise<Response>((_resolve, reject) => {
			controller.signal.addEventListener('abort', () => reject(controller.signal.reason), { once: true })
		})
	})
	const pending = getMessariAmmFinancialsAtBlockHash({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		blockHash: envelope.data._meta.block.hash,
		signal: controller.signal,
	})
	const rejected = expect(pending).rejects.toBe(reason)
	controller.abort(reason)
	await rejected
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

it('rejects a late parsed response after cancellation', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const controller = new AbortController()
	const reason = new Error('cancelled while reading body')
	let bodyController!: ReadableStreamDefaultController<Uint8Array>
	const response = new Response(new ReadableStream<Uint8Array>({
		start(controller) { bodyController = controller },
	}))
	corsFetch.mockResolvedValueOnce(response)
	const pending = getMessariAmmFinancialsLatest({
		binding: deploymentBinding(cases[0].deployment),
		deployment: cases[0].deployment,
		signal: controller.signal,
	})
	const rejected = expect(pending).rejects.toBe(reason)
	await vi.waitFor(() => expect(response.bodyUsed).toBe(true))
	controller.abort(reason)
	bodyController.enqueue(new TextEncoder().encode(JSON.stringify(envelope)))
	bodyController.close()
	await rejected
})

it('cancels a queued source request without issuing it or leaking the occupied slots', async () => {
	const envelope = await textResponseFromCapture(cases[0].query)
	const release: ((response: Response) => void)[] = []
	corsFetch.mockImplementation(() => new Promise<Response>((resolve) => release.push(resolve)))
	const args = { binding: deploymentBinding(cases[0].deployment), deployment: cases[0].deployment }
	const holders = Array.from({ length: 4 }, () => getMessariAmmFinancialsLatest(args))
	await vi.waitFor(() => expect(corsFetch).toHaveBeenCalledTimes(4))
	const controller = new AbortController()
	const reason = new Error('queued source cancelled')
	const pending = getMessariAmmFinancialsLatest({ ...args, signal: controller.signal })
	const rejected = expect(pending).rejects.toBe(reason)
	controller.abort(reason)
	await rejected
	expect(corsFetch).toHaveBeenCalledTimes(4)
	for (const resolve of release)
		resolve(Response.json(envelope))
	await Promise.all(holders)
})
