import { describe, expect, it } from 'vitest'
import { type as arktype } from 'arktype'
import {
	existsSync,
	globSync,
	readFileSync,
} from 'node:fs'
import {
	dirname,
	join,
	resolve,
} from 'node:path'

import sourceProviderDefinitions from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import type { SourceProviderDefinition } from '$/sources/$sources.ts'
import { TransportType } from '$/constants/TransportType.ts'
import pipedBindings from '$/sources/Piped/bindings.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import { Source } from '$/sources/Source.ts'
import {
	evmExecutionOpenRpcArtifactFailures,
} from '$/sources/validateSourceRegistry.ts'
import {
	getRpcTx,
	narrowRpcLog,
	narrowTxRpc,
} from '$/sources/Voltaire/JsonRpc/types.ts'

import {
	voltaireJsonRpcTransports,
} from '$/sources/Voltaire/JsonRpc/queries.ts'
import { beaconRestBinding } from '$/sources/Beacon/Rest/queries.ts'
import {
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'
import { sourceProviders as appSourceProviders } from '$/sources/index.ts'

const sourceBindingArtifacts = sourceProviderDefinitions.flatMap((provider) => provider.bindings)
	.flatMap((binding) => binding.artifacts ?? [])
const {
	transportsByChainId: voltaireJsonRpcTransportsByChainId,
	transportByChainId: voltaireJsonRpcTransportByChainId,
} = voltaireJsonRpcTransports

const fixtureSourceProviders = [
	{
		provider: 'ProviderWithEnv',
		label: 'Provider with env',
		env: arktype({
			PUBLIC_PROVIDER_KEY: 'string',
		}),
		sources: [
			{
				source: 'ProviderOnlySource',
				label: 'Provider-only source',
			},
			{
				source: 'ProviderAndSourceEnvSource',
				label: 'Provider and source env source',
				env: arktype({
					PUBLIC_SOURCE_KEY: 'string',
				}),
			},
			{
				source: 'FailingSourceEnvSource',
				label: 'Failing source env source',
				env: arktype({
					PUBLIC_FAILING_SOURCE_KEY: 'string',
				}),
			},
		],
	},
	{
		provider: 'ProviderWithoutEnv',
		label: 'Provider without env',
		sources: [
			{
				source: 'SourceOnlyEnvSource',
				label: 'Source-only env source',
				env: arktype({
					PUBLIC_SOURCE_ONLY_KEY: 'string',
				}),
			},
			{
				source: 'OpenSource',
				label: 'Open source',
			},
			{
				source: 'OptionalEnvSource',
				label: 'Optional-env source',
				env: arktype({
					PUBLIC_OPTIONAL_KEY: 'string > 0?',
				}),
			},
		],
	},
	{
		provider: 'FailingProvider',
		label: 'Failing provider',
		env: arktype({
			PUBLIC_FAILING_PROVIDER_KEY: 'string',
		}),
		sources: [
			{
				source: 'ProviderDisabledSource',
				label: 'Provider disabled source',
			},
		],
	},
] as const satisfies readonly SourceProviderDefinition<string, string>[]

describe('source provider registry', () => {
	it('names every EVM execution binding missing OpenRPC authority', () => {
		expect(evmExecutionOpenRpcArtifactFailures(sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
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

	it('gates providers and sources by env schemas and rejects empty strings', () => {
		const indexed = indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: '   ',
				PUBLIC_FAILING_PROVIDER_KEY: '',
				PUBLIC_OPTIONAL_KEY: '   ',
				PUBLIC_EXTRA_KEY: 'extra-public',
			}
		)

		expect([...indexed.enabledSources]).toEqual([
			'ProviderOnlySource',
			'ProviderAndSourceEnvSource',
			'SourceOnlyEnvSource',
			'OpenSource',
			'OptionalEnvSource',
		])
		expect(indexed.resolverPublicEnvBySource.get('OptionalEnvSource')).toEqual({})
		expect(indexed.resolverPublicEnvBySource.has('ProviderDisabledSource')).toBe(false)
		expect(indexed.resolverPublicEnvBySource.has('FailingSourceEnvSource')).toBe(false)
		expect(indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_OPTIONAL_KEY: 'optional-value',
			}
		).resolverPublicEnvBySource.get('OptionalEnvSource')).toEqual({
			PUBLIC_OPTIONAL_KEY: 'optional-value',
		})
	})

	it('keeps Voltaire transaction source narrowing from dropping signature and blob fields', () => {
		const tx = narrowTxRpc({
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
		})
		if (tx == null)
			throw new Error('Voltaire transaction narrowing rejected valid transaction wire')

		expect(getRpcTx(tx, '0xtransaction')).toMatchObject({
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
		})
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

	it('passes full public env only to sources without provider or source env schema', () => {
		const indexed = indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
				PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
				PUBLIC_EXTRA_KEY: 'extra-public',
			}
		)

		expect(indexed.resolverPublicEnvBySource.get('OpenSource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
			PUBLIC_SOURCE_KEY: 'source-secret',
			PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
			PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
			PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
			PUBLIC_EXTRA_KEY: 'extra-public',
		})
	})

	it('passes provider env to inherited sources and merged env to source-specific sources', () => {
		const indexed = indexSourceProviders(
			fixtureSourceProviders,
			{
				PUBLIC_PROVIDER_KEY: 'provider-secret',
				PUBLIC_SOURCE_KEY: 'source-secret',
				PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
				PUBLIC_FAILING_SOURCE_KEY: 'failing-source-secret',
				PUBLIC_FAILING_PROVIDER_KEY: 'failing-provider-secret',
				PUBLIC_EXTRA_KEY: 'extra-public',
			}
		)

		expect(indexed.resolverPublicEnvBySource.get('ProviderOnlySource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
		})
		expect(indexed.resolverPublicEnvBySource.get('ProviderAndSourceEnvSource')).toEqual({
			PUBLIC_PROVIDER_KEY: 'provider-secret',
			PUBLIC_SOURCE_KEY: 'source-secret',
		})
		expect(indexed.resolverPublicEnvBySource.get('SourceOnlyEnvSource')).toEqual({
			PUBLIC_SOURCE_ONLY_KEY: 'source-only-secret',
		})
	})

	it('keeps binding origins canonical and non-conflicting', () => {
		const corsEnabledByOrigin = new Map<string, boolean>()

		for (const sourceProvider of appSourceProviders) {
			expect(sourceProvider.provider, sourceProvider.label).toBeDefined()
			expect(sourceProvider.sources.length, String(sourceProvider.provider)).toBeGreaterThan(0)

			for (const { origin, corsEnabled } of sourceProvider.bindings.flatMap(({ endpoints }) => endpoints))
				if (origin != null) {
					expect(new URL(origin).origin, `${sourceProvider.provider}: ${origin}`).toBe(origin)
					expect(origin, String(sourceProvider.provider)).not.toMatch(/[/?#]$/)
					expect(
						corsEnabledByOrigin.get(origin) ?? corsEnabled === true,
						`${sourceProvider.provider}: ${origin}`
					).toBe(corsEnabled === true)
					corsEnabledByOrigin.set(origin, corsEnabled === true)
				}
		}
	})

	it('keeps source rows registered under their owning provider', () => {
		const sourceProvidersBySource = new Map<PropertyKey, PropertyKey>()

		for (const sourceProvider of appSourceProviders) {
			for (const sourceDefinition of sourceProvider.sources) {
				expect(sourceProvidersBySource.has(sourceDefinition.source), String(sourceDefinition.source)).toBe(false)
				sourceProvidersBySource.set(sourceDefinition.source, sourceProvider.provider)
			}
		}
	})

	it('binds both public TRON REST sources to the canonical CAIP-2 mainnet', () => {
		const bindings = sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.filter((binding) => (
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

	it('keeps every provider origin represented in the proxy allow-list source', () => {
		const serverSource = readFileSync(join(process.cwd(), 'src', 'sources', 'index.server.ts'), 'utf8')

		expect(serverSource).toMatch(/\bsourceProviders\s*\.flatMap\(\(provider\)(?:: readonly SourceBinding\[\])? => provider\.bindings\)/)
		expect(serverSource).toMatch(/\bbinding\.delivery === SourceDelivery\.HttpProxy\b/)
		expect(serverSource).toMatch(/\bendpoint\.endpointKind === SourceEndpointKind\.HttpUrl\b/)
		expect(serverSource).not.toMatch(/\bnew Set\(\s*\[/)
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
		expect(pipedBindings[Source.Piped_Rest].endpoints).toEqual([{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://api.piped.private.coffee',
			origin: 'https://api.piped.private.coffee',
			corsEnabled: true,
		}])
		for (const filePath of globSync('src/sources/Piped/**/*.ts'))
			expect(readFileSync(filePath, 'utf8'), filePath).not.toMatch(/\bOriginsForPublicEnv\b|\bPUBLIC_PIPED_API_BASE_URL\b/)
	})

	it('derives Beacon REST chain support from its canonical bindings', () => {
		expect(beaconRestBinding(1)?.source).toBe(Source.Beacon_Rest)
		expect(beaconRestBinding(11_155_111)?.source).toBe(Source.Beacon_Rest)
		expect(beaconRestBinding(10)).toBeUndefined()
	})

	it('keeps Voltaire transport endpoints aligned with canonical bindings', () => {
		expect(new Set(Object.values(voltaireJsonRpcTransportsByChainId).flatMap((entries) => (
			entries.map((entry) => entry.endpoint.locator)
		)))).toEqual(
			new Set(
				sourceProviderDefinitions
					.filter((provider) => provider.provider === SourceProvider.Voltaire)
					.flatMap((provider) => provider.bindings)
					.flatMap((binding) => binding.endpoints)
					.filter((endpoint) => (
						endpoint.endpointKind === SourceEndpointKind.HttpUrl
						|| endpoint.endpointKind === SourceEndpointKind.WebSocketUrl
					))
					.map((endpoint) => endpoint.locator)
			)
		)
	})

	it('keeps Voltaire default JSON-RPC transport HTTP when the chain has any HTTP candidate', () => {
		for (const [chainId, transports] of Object.entries(voltaireJsonRpcTransportsByChainId)) {
			const httpCandidate = transports.find((entry) => entry.transportType === TransportType.Http)
			if (httpCandidate != null)
				expect(voltaireJsonRpcTransportByChainId[Number(chainId)]).toBe(httpCandidate)
		}
	})

	it('keeps every Voltaire executable transport joined to its canonical binding', () => {
		for (const transport of Object.values(voltaireJsonRpcTransportsByChainId).flat()) {
			const binding = sourceProviderDefinitions
				.find((provider) => provider.provider === SourceProvider.Voltaire)!
				.bindings.find((candidate) => candidate.endpoints.includes(transport.endpoint))!
			expect(binding.target.key).toBe(String(transport.chainId))
			expect(transport.endpoint.endpointKind).toBe(
				transport.transportType === TransportType.Http ?
					SourceEndpointKind.HttpUrl
				:
					SourceEndpointKind.WebSocketUrl
			)
			if (transport.transportType === TransportType.WebSocket)
				expect(binding.delivery).toBe(SourceDelivery.RemoteLive)
			else {
				if (transport.endpoint.corsEnabled !== true) {
					expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
					expect(sourceBindingId(binding)).toBeTruthy()
				}
			}
		}
	})

	it('uses generated Voltaire bindings as the executable transport authority', () => {
		expect(readFileSync(join(process.cwd(), 'src', 'sources', 'Voltaire', 'JsonRpc', 'queries.ts'), 'utf8'))
			.not.toMatch(/executionEndpoints\.ts|voltaireJsonRpcTransportCandidates/)

		expect(Object.values(voltaireJsonRpcTransportsByChainId).flat().map((transport) => ({
			chainId: transport.chainId,
			rpcUrl: transport.endpoint.locator,
			transportType: transport.transportType,
		}))).toEqual(
			sourceProviderDefinitions
				.filter((provider) => provider.provider === SourceProvider.Voltaire)
				.flatMap((provider) => provider.bindings)
				.flatMap((binding) => (
					binding.endpoints.map((endpoint) => ({
								chainId: Number(binding.target.key),
								rpcUrl: endpoint.locator,
								transportType: (
									endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
										TransportType.Http
									:
										TransportType.WebSocket
								),
							}))
				))
		)
	})

	it('keeps Quilibrium docs endpoints in generated APP binding metadata', () => {
		expect(sourceProviderDefinitions
			.filter((provider) => provider.provider === SourceProvider.QuilibriumDocs)
			.flatMap((provider) => provider.bindings)
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => ({
				locator: endpoint.locator,
				origin: endpoint.origin,
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
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const manifestFiles = globSync('src/sources/*/OpenApi/schema-source.ts')
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const coveredTypesFiles = new Set<string>()
		const inactiveManifests: string[] = []

		expect(packageJson).toMatch(/"sources:openapi": "node --import tsx scripts\/sources\/openapi\.ts"/)
		expect(packageJson).toMatch(/"sources:openapi:check": "node --import tsx scripts\/sources\/openapi\.ts check"/)
		expect(readFileSync(join(process.cwd(), 'scripts', 'sources', 'openapi.ts'), 'utf8')).toMatch(/glob\('\/?\*\/OpenApi\/schema-source\.ts'|glob\('\*\/OpenApi\/schema-source\.ts'/)

		for (const manifestFile of manifestFiles) {
			const manifestSource = readFileSync(manifestFile, 'utf8')
			const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
			const typesFile = manifestSource.match(/typesFile:\s*'([^']+)'/)?.[1]
			if (!activeManifestFiles.has(manifestFile)) {
				inactiveManifests.push(manifestFile)
				continue
			}

			if (schemaFile == null)
				throw new Error(`${manifestFile}: missing schemaFile`)
			if (typesFile == null)
				throw new Error(`${manifestFile}: missing typesFile`)

			expect(existsSync(resolve(dirname(manifestFile), schemaFile))).toBe(true)
			expect(existsSync(resolve(dirname(manifestFile), typesFile))).toBe(true)
			coveredTypesFiles.add(resolve(dirname(manifestFile), typesFile))
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
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const manifestFiles = globSync('src/sources/**/Graphql/**/schema-source.ts')
		const activeManifestFiles = new Set(
			sourceBindingArtifacts
				.filter((artifact) => artifact.kind === SourceArtifactKind.GenerationManifest)
				.map((artifact) => artifact.path)
		)
		const coveredOutputFiles = new Set<string>()
		const inactiveManifests: string[] = []

		expect(packageJson).toMatch(/"sources:graphql": "node --import tsx scripts\/sources\/graphql\.ts"/)
		expect(packageJson).toMatch(/"sources:graphql:check": "node --import tsx scripts\/sources\/graphql\.ts check"/)
		expect(readFileSync(join(process.cwd(), 'scripts', 'sources', 'graphql.ts'), 'utf8')).toMatch(/glob\('\*\/Graphql\/\*\*\/schema-source\.ts'/)

		for (const manifestFile of manifestFiles) {
			const manifestSource = readFileSync(manifestFile, 'utf8')
			const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
			const outputFile = manifestSource.match(/outputFile:\s*'([^']+)'/)?.[1]
			const patchFile = manifestSource.match(/patchFile:\s*'([^']+)'/)?.[1]
			if (!activeManifestFiles.has(manifestFile)) {
				inactiveManifests.push(manifestFile)
				continue
			}

			if (schemaFile == null)
				throw new Error(`${manifestFile}: missing schemaFile`)

			expect(existsSync(resolve(dirname(manifestFile), schemaFile))).toBe(true)
			if (outputFile != null) {
				expect(existsSync(resolve(dirname(manifestFile), outputFile))).toBe(true)
				coveredOutputFiles.add(resolve(dirname(manifestFile), outputFile))
			}
			if (patchFile != null)
				expect(existsSync(resolve(dirname(manifestFile), patchFile))).toBe(true)
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

	it('keeps generated precompile data reproducible from the checked-in manifest', () => {
		const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
		const scriptSource = readFileSync(join(process.cwd(), 'scripts', 'sources', 'precompiles', 'source.ts'), 'utf8')
		const manifest = JSON.parse(
			readFileSync(join(process.cwd(), 'src', 'data', 'precompiles', 'manifest.json'), 'utf8')
		) as {
			source?: string
			ref?: string
		}
		const definitions = new Set<string>()
		const schedules = globSync('src/data/precompiles/eip155-*-schedule.json')

		expect(packageJson).toMatch(/"sources:precompiles:sync": "node --import tsx scripts\/sources\/precompiles\/source\.ts sync"/)
		expect(packageJson).toMatch(/"sources:precompiles:check": "node --import tsx scripts\/sources\/precompiles\/source\.ts check"/)
		expect(scriptSource).toContain("action === 'check'")
		expect(manifest.source).toBe('https://github.com/shemnon/precompiles')
		expect(manifest.ref).toBeTruthy()
		expect(schedules.length).toBeGreaterThan(0)

		for (const filePath of globSync('src/data/precompiles/*.json')) {
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
