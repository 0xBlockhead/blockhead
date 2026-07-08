import {
	readFileSync,
	globSync,
	statSync,
} from 'node:fs'
import {
	dirname,
	join,
} from 'node:path'

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
} from '$/sources/SourceBinding.ts'
import { sourceProviders } from '$/sources/$sourceProviders.ts'
import { auditSourceProviders } from '$/sources/auditSourceProviders.ts'
import { officialSourceArtifacts } from '$/sources/officialArtifacts.ts'
import { validateSourceBindings } from '$/sources/validateSourceBindings.ts'

const sourceBindings = validateSourceBindings(sourceProviders.flatMap((provider) => provider.bindings))
const browserSourceBindings = validateSourceBindings(
	sourceBindings.filter((binding) => (
		(
			binding.delivery === SourceDelivery.BrowserDirect
			|| binding.delivery === SourceDelivery.HttpProxy
			|| binding.delivery === SourceDelivery.RemoteQuery
			|| binding.delivery === SourceDelivery.RemoteLive
		)
		&& binding.credentials.every((credential) => (
			credential.scope === SourceCredentialScope.None
			|| credential.scope === SourceCredentialScope.PublicConfig
			|| credential.scope === SourceCredentialScope.UserDelegated
		))
	))
)
const remoteLiveBindings = sourceBindings.filter((binding) => binding.delivery === SourceDelivery.RemoteLive)
const sourceFiles = globSync('src/sources/**/*.ts').filter((file) => (
	!file.endsWith('.spec.ts')
	&& file !== 'src/sources/validateSourceRegistry.ts'
	&& file !== 'src/sources/validateSourceBindings.ts'
	&& file !== 'src/sources/auditSourceProviders.ts'
))
const sourceRuntimeFiles = sourceFiles.filter((file) => !(
	file === 'src/sources/index.ts'
	|| file === 'src/sources/index.server.ts'
	|| file.endsWith('.remote.ts')
	|| file.endsWith('.server.ts')
	|| file.endsWith('/index.ts')
))
const httpProxyOrigins = new Set(
	sourceBindings
		.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
		.flatMap((binding) => (
			binding.endpoints
				.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
				.map((endpoint) => endpoint.origin ?? endpoint.locator)
		))
)
const audit = auditSourceProviders(sourceProviders)
const sourceMember = (
	name: string
) => (Source as Record<string, Source | undefined>)[name]
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
const sourceRuntimeBindingImportFailures = globSync('src/sources/*/{queries,client}.ts').flatMap((file) => {
	const providerDirectory = file.split('/').slice(0, 3).join('/')
	const providerName = providerDirectory.slice('src/sources/'.length)
	const source = readFileSync(file, 'utf8')
	return source.includes(`$/sources/${providerName}/bindings.ts`) ?
		[`${file}: runtime transport imports provider-local bindings instead of receiving SourceBinding selection`]
	:
		[]
})
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
		|| binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
	)) ? [] : ['RemoteLive binding lacks dispatcher coverage']),
	...(sourceBindings.every((binding) => (
		binding.apiFamily !== ApiFamily.EvmExecutionJsonRpc
		|| binding.artifacts?.some((artifact) => artifact.kind === SourceArtifactKind.OpenRpcSpec)
	)) ? [] : ['EVM execution JSON-RPC binding lacks OpenRPC artifact']),
	...(httpProxyOrigins.has('wss://ethereum.publicnode.com') ? ['WebSocket leaked into HTTP proxy origins'] : []),
	...(sourceBindings.some((binding) => (
		binding.source === Source.Coingecko_OpenApi
		&& binding.apiFamily === ApiFamily.OpenApiHttp
		&& binding.artifacts?.some((artifact) => (
			artifact.kind === SourceArtifactKind.OpenApiTypes
			&& artifact.path === 'src/sources/Coingecko/OpenApi/openapi.d.ts'
			&& artifact.generated
		))
	)) ? [] : ['missing Coingecko OpenAPI artifact binding']),
	...(sourceBindings.some((binding) => (
		binding.source === sourceMember('EthereumEips_Github')
		&& binding.apiFamily === ApiFamily.GithubContentsApi
		&& binding.target.kind === SourceTargetKind.GitRepository
	)) || sourceMember('EthereumEips_Github') === undefined ? [] : ['missing EthereumEips GitHub contents binding']),
	...(sourceBindings.flatMap((binding) => binding.artifacts ?? []).every((artifact) => artifactPathExists(artifact.path)) ? [] : ['artifact path missing']),
	...(brokenSourceSymlinks.length ? [`broken source symlinks: ${brokenSourceSymlinks.join(', ')}`] : []),
	...openApiManifestFailures,
	...officialSourceArtifacts.filter((officialSourceArtifact) => !('enforce' in officialSourceArtifact)).flatMap((officialSourceArtifact) => {
		const bindings = sourceBindings.filter((binding) => binding.source === officialSourceArtifact.source)
		const artifacts = bindings.flatMap((binding) => binding.artifacts ?? [])
		return [
			...(bindings.length ? [] : [`${officialSourceArtifact.source}: missing official artifact binding`]),
			...(artifacts.some((artifact) => artifact.kind === officialSourceArtifact.artifactKind) ?
				[]
			:
				[`${officialSourceArtifact.source}: missing ${officialSourceArtifact.artifactKind} artifact for ${officialSourceArtifact.officialUrl}`]),
			...(artifactPathExists(officialSourceArtifact.localPath) ?
				[]
			:
				[`${officialSourceArtifact.source}: missing official artifact path ${officialSourceArtifact.localPath}`]),
			...(artifacts.some((artifact) => artifact.kind === SourceArtifactKind.HandwrittenTypes) ?
				[`${officialSourceArtifact.source}: official artifact binding still declares HandwrittenTypes`]
			:
				[]),
		]
	}),
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
	...sourceRuntimeBindingImportFailures,
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
	...globSync('src/sources/*/index.ts')
		.concat(globSync('src/sources/*/bindings.ts'))
		.concat(globSync('src/sources/*/*/definition.ts'))
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
