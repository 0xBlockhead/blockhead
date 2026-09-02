import { describe, expect, it, vi } from 'vitest'
import {
	existsSync,
	globSync,
	readFileSync,
} from 'node:fs'
import {
	dirname,
	join,
	relative,
	resolve,
} from 'node:path'

import sourceProviderDefinitions, {
	sourceBindingIdsBySource,
	sourceBindings,
	sourceBindingsBySource,
} from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import pipedBindings from '$/sources/Piped/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	evmExecutionOpenRpcArtifactFailures,
} from '$/sources/validateSourceRegistry.ts'
import {
	narrowRpcLog,
	narrowRpcTransaction,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import type { EvmNativeTransferExecutionTransport } from '$/state/sessions/evmNativeTransferPreparation.ts'

import { voltaireJsonRpcTransports } from '$/sources/Voltaire/JsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	beaconRestByChainId,
} from '$/sources/Beacon/Rest/queries.ts'
import {
	SourceArtifactKind,
	SourceEndpointKind,
	SourceTargetKind,
	sourceBindingId,
	sourceEndpointOrigin,
} from '$/sources/SourceBinding.ts'

const sourceBindingArtifacts = sourceBindings.flatMap((binding) => binding.artifacts ?? [])
const sourceBindingIds = new Set(sourceBindings.map(sourceBindingId))
const {
	transportsByChainId: voltaireJsonRpcTransportsByChainId,
} = voltaireJsonRpcTransports

type OpenApiSchemaSource = {
	schemaFile: string
	typesFile: string
}

type GraphqlSchemaSource = {
	schemaFile: string
	outputFile?: string
	patchFile?: string
}

type OpenRpcSchemaSource = {
	schemaFile?: string
	typesFile?: string
	schemaDirectory?: string
}

type DiscoverySchemaSource = {
	schemaFile: string
	typesFile: string
}

const openApiSchemaSources = import.meta.glob<{ schemaSource: OpenApiSchemaSource }>([
	'./*/OpenApi/schema-source.ts',
	'./*/OpenApi/**/schema-source.ts',
], { eager: true })
const graphqlSchemaSources = import.meta.glob<{ schemaSource: GraphqlSchemaSource }>(
	'./*/Graphql/**/schema-source.ts',
	{ eager: true }
)
const openRpcSchemaSources = import.meta.glob<{ schemaSource: OpenRpcSchemaSource }>([
	'./**/OpenRpc/schema-source.ts',
	'./**/JsonRpc/schema-source.ts',
], { eager: true })
const discoverySchemaSources = import.meta.glob<{ schemaSource: DiscoverySchemaSource }>(
	'./*/Discovery/schema-source.ts',
	{ eager: true }
)

const sourcePathForManifest = (relativeManifestPath: string) => (
	join('src/sources', relativeManifestPath.slice('./'.length))
)

describe('source provider registry', () => {
	it('indexes exact binding provenance across endpoint and delivery variants', () => {
		for (const [source, bindings] of Object.entries(sourceBindingsBySource))
			expect(sourceBindingIdsBySource[source]).toEqual(bindings.map(sourceBindingId))

		expect(sourceBindingsBySource[Source.Snapchain_Rest][0].endpoints.length).toBeGreaterThan(1)
		expect(new Set(sourceBindingsBySource[Source.Voltaire_JsonRpc].map(({ delivery }) => delivery)).size).toBeGreaterThan(1)
		expect(new Set(sourceBindingIdsBySource[Source.Voltaire_JsonRpc]).size).toBe(sourceBindingsBySource[Source.Voltaire_JsonRpc].length)
	})

	it('names every EVM execution binding missing OpenRPC authority', () => {
		expect(evmExecutionOpenRpcArtifactFailures(sourceBindings
			.filter((binding) => (
				binding.source === 'EnvioHyperRpc_JsonRpc'
				|| binding.source === 'GetBlockRpc_JsonRpc'
			))
			.map((binding) => ({
				...binding,
				artifacts: [],
			})))).toEqual([
			'EnvioHyperRpc_JsonRpc / Eip155Chain:1: EVM execution JSON-RPC binding lacks OpenRPC artifact',
			'GetBlockRpc_JsonRpc / Eip155Chain:1: EVM execution JSON-RPC binding lacks OpenRPC artifact',
		])
	})

	it('gates sources only through binding-owned public credential schemas', () => {
		const missingRequiredEnv = indexSourceProviders(sourceProviderDefinitions, {
			PUBLIC_EXTRA_KEY: 'extra-public',
		}, sourceBindingIds)

		expect(missingRequiredEnv.enabledSources.has(Source.Blockchair_Rest)).toBe(false)
		expect(missingRequiredEnv.enabledSources.has(Source.Coingecko_Rest)).toBe(true)
		expect(missingRequiredEnv.enabledSources.has(Source.Lens_Graphql)).toBe(true)
		expect(missingRequiredEnv.resolverPublicEnvBySource.get(Source.Coingecko_Rest)).toEqual({})
		expect(missingRequiredEnv.resolverPublicEnvBySource.get(Source.Lens_Graphql)).toEqual({})
		expect(missingRequiredEnv.resolverPublicEnvBySource.get(Source.Piped_Rest)).toEqual({})

		const configured = indexSourceProviders(sourceProviderDefinitions, {
			PUBLIC_BLOCKCHAIR_API_KEY: 'blockchair-secret',
			PUBLIC_EXTRA_KEY: 'extra-public',
		}, sourceBindingIds)
		expect(configured.resolverPublicEnvBySource.get(Source.Blockchair_Rest)).toEqual({
			PUBLIC_BLOCKCHAIR_API_KEY: 'blockchair-secret',
		})
		expect(configured.resolverPublicEnvBySource.get(Source.Lens_Graphql)).toEqual({})
		expect(configured.resolverPublicEnvBySource.get(Source.Piped_Rest)).toEqual({})
	})

	it('keeps Voltaire transaction source narrowing from dropping signature, blob and authorization fields', () => {
		const tx = narrowRpcTransaction({
			hash: '0xtransaction',
			blockHash: null,
			blockNumber: null,
			transactionIndex: null,
			from: '0xfrom',
			to: null,
			value: '0x0',
			nonce: '0x0',
			input: '0x',
			gas: '0x5208',
			r: '0xr',
			s: '0xs',
			v: '0x1',
			maxFeePerGas: '0x2',
			maxPriorityFeePerGas: '0x3',
			maxFeePerBlobGas: '0x4',
			blobVersionedHashes: [
				'0x01blob',
			],
			authorizationList: [{
				chainId: '0x1',
				address: '0x1111111111111111111111111111111111111111',
				nonce: '0x2',
				yParity: '0x1',
				r: '0x3',
				s: '0x4',
			}],
		})
		if (tx == null)
			throw new Error('Voltaire transaction narrowing rejected valid transaction wire')

		expect(tx).toMatchObject({
			hash: '0xtransaction',
			r: '0xr',
			s: '0xs',
			v: '0x1',
			maxFeePerGas: '0x2',
			maxPriorityFeePerGas: '0x3',
			maxFeePerBlobGas: '0x4',
			blobVersionedHashes: [
				'0x01blob',
			],
			authorizationList: [{
				chainId: '0x1',
				address: '0x1111111111111111111111111111111111111111',
				nonce: '0x2',
				yParity: '0x1',
				r: '0x3',
				s: '0x4',
			}],
		})
		expect(narrowRpcTransaction({
			...tx,
			authorizationList: ['malformed'],
		})).toBeNull()
	})

	it('keeps Voltaire log source narrowing from dropping receipt detail fields', () => {
		expect(narrowRpcLog({
			address: '0xaddress',
			topics: [
				'0xtopic',
			],
			data: '0xdata',
			blockNumber: '0x1',
			blockHash: '0xblock',
			transactionHash: '0xtransaction',
			transactionIndex: '0x2',
			logIndex: '0x3',
			removed: false,
		})).toEqual({
			address: '0xaddress',
			topics: [
				'0xtopic',
			],
			data: '0xdata',
			blockNumber: '0x1',
			blockHash: '0xblock',
			transactionHash: '0xtransaction',
			transactionIndex: '0x2',
			logIndex: '0x3',
			removed: false,
		})
	})

	it('keeps binding origins canonical', () => {
		for (const sourceProvider of sourceProviderDefinitions) {
			expect(sourceProvider.provider, sourceProvider.label).toBeDefined()
			expect(Object.keys(sourceProvider.sources).length, String(sourceProvider.provider)).toBeGreaterThan(0)

			for (const endpoint of Object.values(sourceProvider.bindings).flat().flatMap(({ endpoints }) => endpoints)) {
				const origin = sourceEndpointOrigin(endpoint)
				if (origin != null) {
					expect(new URL(origin).origin, `${sourceProvider.provider}: ${origin}`).toBe(origin)
					expect(origin, String(sourceProvider.provider)).not.toMatch(/[/?#]$/)
				}
			}
		}
	})

	it('keeps source rows registered under their owning provider', () => {
		const sourceProvidersBySource = new Map<PropertyKey, PropertyKey>()

		for (const sourceProvider of sourceProviderDefinitions) {
			for (const source of Object.keys(sourceProvider.sources)) {
				expect(sourceProvidersBySource.has(source), String(source)).toBe(false)
				sourceProvidersBySource.set(source, sourceProvider.provider)
			}
		}
	})

	it('keeps every binding artifact path present', () => {
		for (const artifact of sourceBindingArtifacts)
			expect(existsSync(resolve(artifact.path)), artifact.path).toBe(true)
	})

	it('binds both public TRON REST sources to the canonical CAIP-2 mainnet', () => {
		const bindings = sourceBindings.filter((binding) => (
				binding.source === Source.TronGrid_Rest
				|| binding.source === Source.TronScan_Rest
			))
			.map((binding) => ({
				source: binding.source,
				target: binding.target,
			}))
		expect(bindings).toHaveLength(2)
		expect(bindings).toEqual(expect.arrayContaining([
			{
				source: Source.TronGrid_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tron:0x2b6653dc',
				},
			},
			{
				source: Source.TronScan_Rest,
				target: {
					kind: SourceTargetKind.Caip2Network,
					key: 'tron:0x2b6653dc',
				},
			},
		]))
	})

	it('keeps browser source callers bound to source runtime transport', () => {
		let sourceCallerCount = 0
		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.includes('/_runtime/')
				||
				filePath.endsWith('/index.ts')
				|| filePath.endsWith('/constants.ts')
				|| filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
			)
				continue

			const source = readFileSync(filePath, 'utf8')
			if (!/\b(?:sourceFetch|sourceGetJson|sourceGetText)\b/.test(source))
				continue
			sourceCallerCount++

			expect(source, filePath).toMatch(/from '\$\/sources\/_runtime\/http\.ts'/)
		}

		expect(sourceCallerCount).toBeGreaterThan(0)
	})

	it('keeps source modules from bypassing source-aware browser fetch routing', () => {
		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
				|| filePath.endsWith('.d.ts')
				|| filePath === 'src/sources/_runtime/proxy.server.ts'
			)
				continue

			expect(readFileSync(filePath, 'utf8'), filePath).not.toMatch(/\bfetch\s*\(/)
		}
	})

	it('keeps source-aware HTTP helper calls tied to origin metadata', () => {
		for (const filePath of globSync('src/sources/**/*.ts')) {
			if (
				filePath.endsWith('.spec.ts')
				|| filePath.endsWith('.test.ts')
			)
				continue

			const source = readFileSync(filePath, 'utf8')
			const httpImport = source.match(/import\s+\{([^}]+)\}\s+from\s+'\$\/lib\/http\.ts'/)
			if (httpImport == null)
				continue

			for (const helperName of httpImport[1]
				.split(',')
				.map((name) => name.trim())
				.flatMap((name) => {
					const [
						imported,
						local = imported,
					] = name.split(/\s+as\s+/)
					return [
						'corsFetch',
						'getJson',
						'getText',
					].includes(imported) ?
						[local]
					:
						[]
				})) {
				for (const helperMatch of source.matchAll(new RegExp(`\\b${helperName}(?:<[^>]+>)?\\s*\\(`, 'g'))) {
					let depth = 0
					let endIndex = helperMatch.index
					for (; endIndex < source.length; endIndex++) {
						if (source[endIndex] === '(')
							depth++
						else if (source[endIndex] === ')') {
							depth--
							if (depth === 0) {
								endIndex++
								break
							}
						}
					}

					expect(
						source.slice(helperMatch.index, endIndex),
						`${filePath}: ${helperName} call must pass source provider origins`
					).toMatch(/\borigins:\s*(?:\[\.\.\.)?[A-Za-z0-9_]+\.origins\b|\borigins:\s*\[\.\.\.origins\]|\borigins:\s*[A-Za-z0-9_]+Origins\b|\borigins:\s*[A-Za-z0-9_]+Origins\(|\borigins:\s*originsFor[A-Za-z0-9_]*\(|\borigins:\s*endpoints\.flatMap\(|\borigins:\s*httpOriginsForBinding\(|\borigins:\s*\[\s*\{[\s\S]*?corsEnabled:\s*false|\{\s*origins\s*\}|\borigins\s*,/)
				}
			}
		}
	})

	it('derives Piped transport metadata from its canonical binding', () => {
		expect(pipedBindings[Source.Piped_Rest][0].endpoints).toEqual([{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://api.piped.private.coffee',
			corsEnabled: true,
		}])
	})

	it('derives Beacon REST chain support from its canonical bindings', () => {
		expect(beaconRestByChainId.has(1)).toBe(true)
		expect(beaconRestByChainId.has(11155111)).toBe(true)
		expect(beaconRestByChainId.has(560048)).toBe(true)
		expect(beaconRestByChainId.has(17000)).toBe(false)
		expect(beaconRestByChainId.has(10)).toBe(false)
	})

	it('preserves every Voltaire binding and endpoint pair in the execution transport index', () => {
		const voltaireBindings = sourceBindings.filter((binding) => binding.source === Source.Voltaire_JsonRpc)

		for (const chainId of new Set(voltaireBindings.map((binding) => binding.target.key))) {
			expect(new Set(
				(voltaireJsonRpcTransportsByChainId[Number(chainId)] ?? [])
					.map((transport) => transport.diagnosticLabel)
			)).toEqual(new Set(
				voltaireBindings
					.filter((binding) => binding.target.key === chainId)
					.flatMap((binding) => (
						binding.endpoints.map((endpoint) => (
							`${sourceBindingId(binding)} ${endpoint.endpointKind} ${endpoint.locator}`
						))
					))
			))
		}
	})

	it('exposes each Voltaire endpoint as a simulation-ready execution transport', () => {
		for (const binding of sourceBindings.filter(({ source }) => source === Source.Voltaire_JsonRpc)) {
			for (const endpoint of binding.endpoints) {
				const transport = voltaireJsonRpcTransportsByChainId[Number(binding.target.key)]?.find(
					({ origin }) => origin === endpoint.locator
				)
				if (transport == null)
					throw new Error(`Voltaire transport is missing for ${endpoint.locator}`)

				const simulationTransport: EvmNativeTransferExecutionTransport = transport
				expect(simulationTransport.origin).toBe(endpoint.locator)
				expect(simulationTransport.getBlockByNumber).toEqual(expect.any(Function))
				expect(simulationTransport.getCall).toEqual(expect.any(Function))
				expect(simulationTransport.estimateGas).toEqual(expect.any(Function))
			}
		}
	})

	it('passes the owning Voltaire binding through the JSON-RPC call path', async () => {
		const [binding, otherBinding] = sourceBindings.filter(
			(candidate) => candidate.source === Source.Voltaire_JsonRpc
		)
		const endpoint = binding.endpoints.find(
			(candidate) => candidate.endpointKind === SourceEndpointKind.HttpUrl
		)
		if (endpoint == null)
			throw new Error('Voltaire call-path test requires HTTP transports from two bindings')
		const transport = voltaireJsonRpcTransportsByChainId[Number(binding.target.key)]?.find(
			(candidate) => candidate.diagnosticLabel === (
				`${sourceBindingId(binding)} ${endpoint.endpointKind} ${endpoint.locator}`
			)
		)
		if (transport == null)
			throw new Error('Voltaire call-path test requires the canonical executable transport')

		const fetch = vi.fn(async () => (
			new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: '0x2a',
			}))
		))
		vi.stubGlobal('fetch', fetch)

		try {
			await expect(transport.getGasPrice()).resolves.toBe('0x2a')
			expect(fetch).toHaveBeenCalledWith(
				endpoint.locator,
				expect.objectContaining({
					method: 'POST',
				})
			)
			await expect(jsonRpc2(
				otherBinding,
				'eth_gasPrice',
				undefined,
				endpoint
			)).rejects.toThrow('JSON-RPC endpoint is not declared by the binding')
			expect(fetch).toHaveBeenCalledTimes(1)
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('keeps Quilibrium docs endpoints in generated APP binding metadata', () => {
		expect(sourceBindings
			.filter((binding) => binding.source === Source.QuilibriumDocs_Rest)
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => ({
				locator: endpoint.locator,
				origin: sourceEndpointOrigin(endpoint),
				corsEnabled: endpoint.corsEnabled,
			}))).toEqual([
			{
				locator: 'https://docs.quilibrium.com',
				origin: 'https://docs.quilibrium.com',
				corsEnabled: true,
			},
			{
				locator: 'https://quilibrium.com',
				origin: 'https://quilibrium.com',
				corsEnabled: true,
			},
		])
	})

	it('keeps generated OpenAPI sources reproducible from checked-in schema manifests', () => {
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const coveredTypesFiles = new Set<string>()
		const inactiveManifests: string[] = []

		for (const [relativeManifestPath, { schemaSource }] of Object.entries(openApiSchemaSources)) {
			const manifestFile = sourcePathForManifest(relativeManifestPath)
			if (!activeManifestFiles.has(manifestFile)) {
				inactiveManifests.push(manifestFile)
				continue
			}

			expect(existsSync(resolve(dirname(manifestFile), schemaSource.schemaFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), schemaSource.typesFile))).toBe(true)
			coveredTypesFiles.add(resolve(dirname(manifestFile), schemaSource.typesFile))
		}

		for (const typesFile of globSync('src/sources/*/OpenApi/openapi.d.ts')) {
			expect(existsSync(resolve(dirname(typesFile), 'schema-source.ts'))).toBe(true)
			if (inactiveManifests.includes(join(dirname(typesFile), 'schema-source.ts')))
				continue

			expect(coveredTypesFiles.has(resolve(typesFile)), typesFile).toBe(true)
		}
			expect(inactiveManifests.every((manifestFile) => !activeManifestFiles.has(manifestFile))).toBe(true)
	})

	it('keeps generated GraphQL sources reproducible from checked-in schema manifests', () => {
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const coveredOutputFiles = new Set<string>()
		const inactiveManifests: string[] = []

		for (const [relativeManifestPath, { schemaSource }] of Object.entries(graphqlSchemaSources)) {
			const manifestFile = sourcePathForManifest(relativeManifestPath)
			if (!activeManifestFiles.has(manifestFile)) {
				inactiveManifests.push(manifestFile)
				continue
			}

			expect(existsSync(resolve(dirname(manifestFile), schemaSource.schemaFile))).toBe(true)
			if (schemaSource.outputFile != null) {
				expect(existsSync(resolve(dirname(manifestFile), schemaSource.outputFile))).toBe(true)
				coveredOutputFiles.add(resolve(dirname(manifestFile), schemaSource.outputFile))
			}
			if (schemaSource.patchFile != null)
				expect(existsSync(resolve(dirname(manifestFile), schemaSource.patchFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), 'queries.ts'))).toBe(true)
		}

		for (const outputFile of globSync('src/sources/**/Graphql/**/graphql-env.d.ts')) {
			expect(existsSync(resolve(dirname(outputFile), 'schema-source.ts'))).toBe(true)
			if (inactiveManifests.includes(join(dirname(outputFile), 'schema-source.ts')))
				continue

			expect(coveredOutputFiles.has(resolve(outputFile)), outputFile).toBe(true)
		}
			expect(inactiveManifests.every((manifestFile) => !activeManifestFiles.has(manifestFile))).toBe(true)
	})

	it('enrolls every OpenRPC and Discovery manifest with its checked-in artifacts', () => {
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const artifactPathsByKind = Map.groupBy(
			sourceBindingArtifacts,
			({ kind }) => kind
		)
		const artifactPaths = (kind: SourceArtifactKind) => new Set(
			(artifactPathsByKind.get(kind) ?? []).map(({ path }) => path)
		)
		const openRpcSpecPaths = artifactPaths(SourceArtifactKind.OpenRpcSpec)
		const openRpcTypesPaths = artifactPaths(SourceArtifactKind.OpenRpcTypes)
		const discoveryPaths = artifactPaths(SourceArtifactKind.GoogleDiscovery)
		const coveredOpenRpcTypes = new Set<string>()
		const coveredDiscoveryTypes = new Set<string>()

		for (const [relativeManifestPath, { schemaSource }] of Object.entries(openRpcSchemaSources)) {
			const manifestFile = sourcePathForManifest(relativeManifestPath)
			expect(activeManifestFiles.has(manifestFile), manifestFile).toBe(true)
			const schemaPath = schemaSource.schemaFile ?? schemaSource.schemaDirectory
			expect(schemaPath, manifestFile).toBeDefined()
			if (schemaPath != null) {
				const resolvedSchemaPath = relative(process.cwd(), resolve(dirname(manifestFile), schemaPath))
				expect(openRpcSpecPaths.has(resolvedSchemaPath), resolvedSchemaPath).toBe(true)
			}
			if (schemaSource.typesFile != null) {
				const typesPath = relative(process.cwd(), resolve(dirname(manifestFile), schemaSource.typesFile))
				expect(openRpcTypesPaths.has(typesPath), typesPath).toBe(true)
				coveredOpenRpcTypes.add(resolve(typesPath))
			}
		}

		for (const typesFile of globSync('src/sources/**/{OpenRpc,JsonRpc}/openrpc.d.ts')) {
			expect(existsSync(resolve(dirname(typesFile), 'schema-source.ts')), typesFile).toBe(true)
			expect(coveredOpenRpcTypes.has(resolve(typesFile)), typesFile).toBe(true)
		}

		for (const [relativeManifestPath, { schemaSource }] of Object.entries(discoverySchemaSources)) {
			const manifestFile = sourcePathForManifest(relativeManifestPath)
			expect(activeManifestFiles.has(manifestFile), manifestFile).toBe(true)
			const schemaPath = relative(process.cwd(), resolve(dirname(manifestFile), schemaSource.schemaFile))
			expect(discoveryPaths.has(schemaPath), schemaPath).toBe(true)
			const typesPath = resolve(dirname(manifestFile), schemaSource.typesFile)
			expect(existsSync(typesPath), typesPath).toBe(true)
			coveredDiscoveryTypes.add(typesPath)
		}

		for (const typesFile of globSync('src/sources/*/Discovery/discovery.d.ts')) {
			expect(existsSync(resolve(dirname(typesFile), 'schema-source.ts')), typesFile).toBe(true)
			expect(coveredDiscoveryTypes.has(resolve(typesFile)), typesFile).toBe(true)
		}
	})

	it('keeps generated precompile data reproducible from the checked-in manifest', () => {
		const manifest = JSON.parse(
			readFileSync(join(process.cwd(), 'src', 'constants', 'precompiles', 'manifest.json'), 'utf8')
		) as {
			source?: string
			ref?: string
		}
		const definitions = new Set<string>()
		const schedules = globSync('src/constants/precompiles/eip155-*-schedule.json')

		expect(manifest.source).toBe('https://github.com/shemnon/precompiles')
		expect(manifest.ref).toBeTruthy()
		expect(schedules.length).toBeGreaterThan(0)

		for (const filePath of globSync('src/constants/precompiles/*.json')) {
			if (filePath.endsWith('/manifest.json'))
				continue

			expect(filePath).toMatch(/\/eip155-\d+-(?:schedule|0x[0-9a-f]+)\.json$/)
			if (!filePath.endsWith('-schedule.json'))
				definitions.add(filePath.slice(filePath.lastIndexOf('/') + 1).replace('.json', ''))
		}
		expect(definitions.size).toBeGreaterThan(0)

		for (const filePath of schedules) {
			const schedule = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, string[] | string>
			for (const [
				key,
				value,
			] of Object.entries(schedule)) {
				if (key === 'name')
					continue

				expect(key, filePath).toMatch(/^\d+$/)
				expect(Array.isArray(value), `${filePath}: ${key}`).toBe(true)
				if (!Array.isArray(value))
					continue

				for (const id of value) {
					expect(id.startsWith('eip155-4220-'), `${filePath}: ${id}`).toBe(false)
					expect(definitions.has(id), `${filePath}: ${id}`).toBe(true)
				}
			}
		}
	})
})
