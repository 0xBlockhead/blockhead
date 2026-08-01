import {
	readFileSync,
	globSync,
	statSync,
} from 'node:fs'
import {
	dirname,
	join,
	resolve,
} from 'node:path'
import { pathToFileURL } from 'node:url'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	sourceEndpointOrigin,
} from '$/sources/SourceBinding.ts'
import sourceProviders from '$/sources/$sourceProviders.ts'
import { auditSourceProviders } from '$/sources/auditSourceProviders.ts'

const sourceBindings = sourceProviders.flatMap((provider) => provider.bindings)
const browserSourceBindings = sourceBindings.filter((binding) => (
		(
			binding.delivery === SourceDelivery.BrowserDirect
			|| binding.delivery === SourceDelivery.HttpProxy
			|| binding.delivery === SourceDelivery.RemoteQuery
			|| binding.delivery === SourceDelivery.RemoteLive
		)
		&& binding.credentials.every((credential) => (
			credential.scope === SourceCredentialScope.PublicConfig
			|| credential.scope === SourceCredentialScope.UserDelegated
		))
	))
const remoteLiveBindings = sourceBindings.filter((binding) => binding.delivery === SourceDelivery.RemoteLive)
const sourceFiles = globSync('src/sources/**/*.ts').filter((file) => (
	!file.endsWith('.spec.ts')
	&& file !== 'src/sources/validateSourceRegistry.ts'
	&& file !== 'src/sources/auditSourceProviders.ts'
))
const sourceRuntimeFiles = sourceFiles.filter((file) => !(
	file === 'src/sources/index.ts'
	|| file === 'src/sources/index.server.ts'
	|| file.endsWith('.remote.ts')
	|| file.endsWith('.server.ts')
	|| (file.endsWith('/index.ts') && file.split('/').length === 4)
))
const httpProxyOrigins = new Set(
	sourceBindings
		.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
		.flatMap((binding) => (
			binding.endpoints
				.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
				.flatMap((endpoint) => sourceEndpointOrigin(endpoint) ?? [])
		))
)
const audit = auditSourceProviders(sourceProviders)
const sourceByName = new Map(
	Object.values(Source).map((source) => [source, source])
)
const sourceMember = (name: string) => sourceByName.get(name)
const artifactPathExists = (path: string) => {
	try {
		return statSync(path).isFile() || statSync(path).isDirectory()
	} catch {
		return false
	}
}
const brokenSourceSymlinks = globSync('src/sources/**/*', {
	withFileTypes: true,
})
	.filter((entry) => entry.isSymbolicLink())
	.map((entry) => join(entry.parentPath, entry.name))
	.filter((path) => !artifactPathExists(path))
const sourceArtifactRows = sourceBindings.flatMap((binding) => binding.artifacts ?? [])
const sourceArtifactPathsByKind = new Map<SourceArtifactKind, Set<string>>()
for (const artifact of sourceArtifactRows) {
	const paths = sourceArtifactPathsByKind.get(artifact.kind) ?? new Set<string>()
	paths.add(artifact.path)
	sourceArtifactPathsByKind.set(artifact.kind, paths)
}
const openApiManifestFailures = globSync('src/sources/*/OpenApi/schema-source.ts').flatMap((manifestFile) => {
	const manifestSource = readFileSync(manifestFile, 'utf8')
	const schemaFile = manifestSource.match(/schemaFile:\s*'([^']+)'/)?.[1]
	const typesFile = manifestSource.match(/typesFile:\s*'([^']+)'/)?.[1]
	const manifestDirectory = dirname(manifestFile)
	const schemaPath = schemaFile == null ? undefined : join(manifestDirectory, schemaFile)
	const typesPath = typesFile == null ? undefined : join(manifestDirectory, typesFile)
	return [
		...(schemaFile == null ? [`${manifestFile}: missing schemaFile`] : []),
		...(typesFile == null ? [`${manifestFile}: missing typesFile`] : []),
		...(schemaPath != null && artifactPathExists(schemaPath) && !(sourceArtifactPathsByKind.get(SourceArtifactKind.OpenApiSpec)?.has(schemaPath) ?? false) ?
			[`${manifestFile}: OpenApiSpec artifact missing for ${schemaPath}`]
		:
			[]),
		...(typesPath != null && artifactPathExists(typesPath) && !(sourceArtifactPathsByKind.get(SourceArtifactKind.OpenApiTypes)?.has(typesPath) ?? false) ?
			[`${manifestFile}: OpenApiTypes artifact missing for ${typesPath}`]
		:
			[]),
	]
})
export const evmExecutionOpenRpcArtifactFailures = (
	bindings: readonly {
		source: string
		target: {
			kind: string
			key: string
		}
		apiFamily: string
		artifacts?: readonly {
			kind: string
		}[]
	}[]
) => bindings.flatMap((binding) => (
	binding.apiFamily === ApiFamily.EvmExecutionJsonRpc
	&& !binding.artifacts?.some((artifact) => artifact.kind === SourceArtifactKind.OpenRpcSpec) ?
		[`${binding.source} / ${binding.target.kind}:${binding.target.key}: EVM execution JSON-RPC binding lacks OpenRPC artifact`]
	:
		[]
))
const failures = [
	...(audit.sourceRows.size === audit.sourceEnumMembers.length ? [] : ['source row count mismatch']),
	...(audit.bindingSources.size === audit.sourceEnumMembers.length ? [] : ['binding source count mismatch']),
	...(audit.missingSourceRows.length ? [`missing source rows: ${audit.missingSourceRows.join(', ')}`] : []),
	...(audit.sourcesWithoutBindings.length ? [`sources without bindings: ${audit.sourcesWithoutBindings.join(', ')}`] : []),
	...(audit.bindingSourcesWithoutRows.length ? [`binding sources without rows: ${audit.bindingSourcesWithoutRows.join(', ')}`] : []),
	...(audit.bindingsOutsideProviderRows.length ? [`bindings outside provider rows: ${audit.bindingsOutsideProviderRows.join(', ')}`] : []),
	...(audit.providersWithoutBindings.length ? [`providers without bindings: ${audit.providersWithoutBindings.join(', ')}`] : []),
	...(remoteLiveBindings.some((binding) => binding.source === Source.Voltaire_JsonRpc) ? [] : ['missing Voltaire RemoteLive binding']),
	...(remoteLiveBindings.every((binding) => (
		(
			binding.wireProtocol === WireProtocol.JsonRpc2
			&& binding.apiFamily === ApiFamily.EvmExecutionJsonRpc
		)
		|| (
			binding.wireProtocol === WireProtocol.Grpc
			&& binding.apiFamily === ApiFamily.GrpcService
			&& binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		)
		|| binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
	)) ? [] : ['RemoteLive binding lacks dispatcher coverage']),
	...evmExecutionOpenRpcArtifactFailures(sourceBindings),
	...(httpProxyOrigins.has('wss://ethereum.publicnode.com') ? ['WebSocket leaked into HTTP proxy origins'] : []),
	...([
		'src/sources/Coingecko/OpenApi/openapi.d.ts',
		'src/sources/Coingecko/OpenApi/Pro/openapi.d.ts',
	].every((path) => sourceBindings.some((binding) => (
		binding.source === Source.Coingecko_Rest
		&& binding.apiFamily === ApiFamily.OpenApiHttp
		&& binding.artifacts?.some((artifact) => (
			artifact.kind === SourceArtifactKind.OpenApiTypes
			&& artifact.path === path
			&& artifact.generated
		))
	))) ? [] : ['missing Coingecko OpenAPI artifact binding']),
	...(sourceBindings.some((binding) => (
		binding.source === sourceMember('EthereumEips_Github')
		&& binding.apiFamily === ApiFamily.GithubContentsApi
		&& binding.target.kind === SourceTargetKind.GitRepository
	)) || sourceMember('EthereumEips_Github') === undefined ? [] : ['missing EthereumEips GitHub contents binding']),
	...(sourceBindings.flatMap((binding) => binding.artifacts ?? []).every((artifact) => artifactPathExists(artifact.path)) ? [] : ['artifact path missing']),
	...(brokenSourceSymlinks.length ? [`broken source symlinks: ${brokenSourceSymlinks.join(', ')}`] : []),
	...openApiManifestFailures,
	...(sourceMember('Amboss_Graphql') !== undefined && browserSourceBindings.some((binding) => binding.source === sourceMember('Amboss_Graphql')) ? ['Amboss server-only binding leaked into browser bindings'] : []),
	...browserSourceBindings.flatMap((binding) => (
		binding.delivery !== SourceDelivery.BrowserDirect ?
			[]
		:
			binding.endpoints.flatMap((endpoint) => (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl && endpoint.corsEnabled === false ?
					[`${binding.source}: BrowserDirect endpoint is marked non-CORS`]
				:
					[]
			))
	)),
	...(sourceBindings.some((binding) => (
		binding.source === sourceMember('Arweave_Rest')
		&& binding.apiFamily === ApiFamily.ArweaveGateway
		&& binding.operationGroups.includes(SourceOperationGroup.ContentGatewayRead)
		&& binding.delivery === SourceDelivery.BrowserDirect
	)) || sourceMember('Arweave_Rest') === undefined ? [] : ['missing Arweave content gateway binding']),
	...(sourceBindings.some((binding) => (
		binding.source === sourceMember('Swarm_Rest')
		&& binding.apiFamily === ApiFamily.SwarmGateway
		&& binding.operationGroups.includes(SourceOperationGroup.ContentGatewayRead)
		&& binding.delivery === SourceDelivery.BrowserDirect
	)) || sourceMember('Swarm_Rest') === undefined ? [] : ['missing Swarm content gateway binding']),
	...sourceRuntimeFiles.flatMap((file) => {
		const source = readFileSync(file, 'utf8')
		return source.includes("'$/sources/index.ts'") || source.includes('"$/sources/index.ts"') ?
			[`${file}: source runtime file imports aggregate source index`]
		:
			[]
	}),
	...sourceFiles.flatMap((file) => {
		const source = readFileSync(file, 'utf8')
		return (
			file !== 'src/sources/index.server.ts'
			&& !file.endsWith('.remote.ts')
			&& !file.endsWith('.server.ts')
			&& source.includes('$env/dynamic/private')
		) ?
			[`${file}: non-server source file imports private env`]
		:
			[]
	}),
	...globSync('src/sources/*/*/definition.ts')
		.flatMap((file) => {
			const source = readFileSync(file, 'utf8')
			return /^(import|export).*(queries|client|schema-source|graphql-env|openapi\.d|openapi\.json|openapi\.yml)/m.test(source) ?
				[`${file}: provider metadata imports source implementation or generated artifact`]
			:
				[]
		}),
	...sourceFiles.flatMap((file) => {
		const source = readFileSync(file, 'utf8')
		return (
			file !== 'src/sources/index.server.ts'
			&& !file.endsWith('.remote.ts')
			&& !file.endsWith('.server.ts')
			&& (/^(import|export).*\$env\/(dynamic|static)\/private/m.test(source)
				|| /^(import|export).*index\.server\.ts/m.test(source)
				|| /^(import|export).*\.server\.ts/m.test(source))
		) ?
			[`${file}: non-server source file imports server-only module`]
		:
			[]
	}),
]

if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	console.log(JSON.stringify({
		providers: sourceProviders.length,
		sourceBindings: sourceBindings.length,
		browserSourceBindings: browserSourceBindings.length,
		remoteLiveBindings: remoteLiveBindings.length,
		httpProxyOrigins: httpProxyOrigins.size,
		failures,
	}, null, 2))

	if (failures.length)
		process.exit(1)
}
