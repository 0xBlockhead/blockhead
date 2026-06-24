import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import {
	multiParamEntityParentPageLayoutRoutes,
	networkNumericEntityParentPageLayoutRoutes,
	paramEntityParentPageLayoutRoutes,
	propsExpressionEntityParentPageLayoutRoutes,
	routeEntityHubPlacements,
	routeEntityViewComponents,
	routeFiles,
	routeFamilies,
	RouteSegmentKind,
	simpleEntityPageRoutes,
	specialParamEntityParentPageLayoutRoutes,
	staticEntityParentPageLayoutRoutes,
	staticParentPageLayoutRoutes,
} from '../ROUTE-DEFINITIONS.ts'
import { schema } from '../src/schema/index.ts'
import { EntityFieldType } from '../src/schema/$schema.ts'
import { generatedOwnership } from './generation/ownership.ts'


const bridgeRouteFileIds = [
	'bridge-route-page-module',
	'bridge-route-page',
	'bridge-route-step-page-module',
	'bridge-route-step-page',
] as const

const urlRouteFileIds = [
	'url-page-module',
	'url-page',
] as const

const walletConnectionRouteFileIds = [
	'wallet-connection-page-module',
	'wallet-connection-page',
] as const

const evmCalldataRouteFileIds = [
	'evm-calldata-detail-page-module',
	'evm-calldata-detail-page',
] as const

const bridgeRouteFileById = Object.fromEntries(
	routeFiles
		.filter((routeFile) => bridgeRouteFileIds.includes(routeFile.id as typeof bridgeRouteFileIds[number]))
		.map((routeFile) => [
			routeFile.id,
			routeFile,
		])
)

const urlRouteFileById = Object.fromEntries(
	routeFiles
		.filter((routeFile) => urlRouteFileIds.includes(routeFile.id as typeof urlRouteFileIds[number]))
		.map((routeFile) => [
			routeFile.id,
			routeFile,
		])
)

const walletConnectionRouteFileById = Object.fromEntries(
	routeFiles
		.filter((routeFile) => walletConnectionRouteFileIds.includes(routeFile.id as typeof walletConnectionRouteFileIds[number]))
		.map((routeFile) => [
			routeFile.id,
			routeFile,
		])
)

const evmCalldataRouteFileById = Object.fromEntries(
	routeFiles
		.filter((routeFile) => evmCalldataRouteFileIds.includes(routeFile.id as typeof evmCalldataRouteFileIds[number]))
		.map((routeFile) => [
			routeFile.id,
			routeFile,
		])
)

const entityPage = (
	componentName: string,
	entityTypeName: string
) => {
	const localComponentName = componentName.startsWith('_') ? componentName.slice(1) : componentName

	return `<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		data,
	}: PageProps = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import ${localComponentName} from '$/views/${componentName}.svelte'
</script>


<Page>
	<${localComponentName}
		selection={
			select(
				EntityType.${entityTypeName},
				data.selector
			)
		}
	/>
</Page>
`
}

const staticParentPageLayout = (
	title: string,
	href: string,
	id?: string
) => `<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="${title}"
	href={resolve('${href}')}
${id ? `	id="${id}"
` : ''}>
	{@render children()}
</ParentPageCollapsible>
`

const staticEntityParentPageLayout = (
	componentName: string,
	entityTypeName: string,
	href: string,
	selector: {
		field: string
		value: string
	}
) => `<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${componentName} from '$/views/${componentName}.svelte'
</script>


<ParentPageCollapsible
	href={resolve('${href}')}
	id={stringify({
		${selector.field}: '${selector.value}',
	})}
>
	{#snippet Summary({ open: _open })}
		<${componentName}
			selection={
				select(
					EntityType.${entityTypeName},
					{
						${selector.field}: '${selector.value}',
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
`

const paramEntityParentPageLayout = (
	componentName: string,
	entityTypeName: string,
	href: string,
	param: {
		route: string
		local: string
		value: string
	},
	hrefParam: {
		route: string
		value: string
	},
	id: {
		value: string
	},
	selector: {
		field: string
		value: string
	}
) => `<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const ${param.local} = $derived(
		${param.value},
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${componentName} from '$/views/${componentName}.svelte'
</script>


<ParentPageCollapsible
	href={resolve('${href}', {
		${hrefParam.route}: ${hrefParam.value},
	})}
	id={${id.value}}
>
	{#snippet Summary({ open: _open })}
		<${componentName}
			selection={
				select(
					EntityType.${entityTypeName},
					{
						${selector.field}: ${selector.value},
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
`

const multiParamEntityParentPageLayout = (
	componentName: string,
	entityTypeName: string,
	href: string,
	params: readonly {
		route: string
		local: string
		value: string
		hrefParam: {
			route: string
			value: string
		}
		selector: {
			field: string
			value: string
		}
	}[],
	id: {
		value: string
	}
) => `<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

${params.map((param) => `	const ${param.local} = $derived(
		${param.value},
	)`).join('\n\n')}


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${componentName} from '$/views/${componentName}.svelte'
</script>


<ParentPageCollapsible
	href={resolve('${href}', {
${params.map((param) => `		${param.hrefParam.route}: ${param.hrefParam.value},`).join('\n')}
	})}
	id={\`${id.value}\`}
>
	{#snippet Summary({ open: _open })}
		<${componentName}
			selection={
				select(
					EntityType.${entityTypeName},
					{
${params.map((param) => `						${param.selector.field}: ${param.selector.value},`).join('\n')}
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
`

const specialParamEntityParentPageLayout = (
	componentName: string,
	entityTypeName: string,
	href: string,
	param: {
		route: string
		local: string
		value: string
	},
	hrefParam: {
		value: string
	},
	id: {
		value: string
	},
	selector: {
		field: string
		value: string
	},
	title?: string
) => `<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const ${param.local} = $derived(
		${param.value},
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${componentName} from '$/views/${componentName}.svelte'
</script>


<ParentPageCollapsible
	href={resolve('${href}', {
		${param.route}: ${hrefParam.value},
	})}
	id={${id.value}}
>
	{#snippet Summary({ open: _open })}
		<${componentName}
			selection={
				select(
					EntityType.${entityTypeName},
					{
						${selector.field}: ${selector.value},
					}
				)
			}
			layout={EntityLayout.SummaryInline}
${title ? `			title="${title}"
` : ''}		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
`

const propsExpressionEntityParentPageLayout = (
	componentName: string,
	entityTypeName: string,
	hrefValue: string,
	idValue: string,
	selectorValue: string,
	imports: readonly string[] = [],
	keyValue?: string
) => `<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
${imports.length ? `${imports.map((importExpression) => `\t${importExpression}`).join('\n')}
` : ''}

	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${componentName} from '$/views/${componentName}.svelte'
</script>


${keyValue ? `{#key ${keyValue}}
	` : ''}<ParentPageCollapsible
${keyValue ? '\t' : ''}	href={${hrefValue}}
${keyValue ? '\t' : ''}	id={${idValue}}
${keyValue ? '\t' : ''}>
${keyValue ? '\t' : ''}	{#snippet Summary({ open: _open })}
${keyValue ? '\t' : ''}		<${componentName}
${keyValue ? '\t' : ''}			selection={
${keyValue ? '\t' : ''}				select(
${keyValue ? '\t' : ''}					EntityType.${entityTypeName},
${keyValue ? '\t' : ''}					${selectorValue}
${keyValue ? '\t' : ''}				)
${keyValue ? '\t' : ''}			}
${keyValue ? '\t' : ''}			layout={EntityLayout.SummaryInline}
${keyValue ? '\t' : ''}		/>
${keyValue ? '\t' : ''}	{/snippet}

${keyValue ? '\t' : ''}	{@render children()}
${keyValue ? '\t' : ''}</ParentPageCollapsible>
${keyValue ? `{/key}
` : ''}`

const networkNumericEntityParentPageLayout = (
	componentName: string,
	entityTypeName: string,
	href: string,
	selectorLocal: string,
	selectorField: string,
	selectorValue: string,
	asConst?: true
) => `<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const ${selectorLocal} = $derived(
		{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			${selectorField}: ${selectorValue},
		}${asConst ? ' as const' : ''},
	)


	// Functions
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${componentName} from '$/views/${componentName}.svelte'
</script>


<ParentPageCollapsible
	href={
		resolve(
			'${href}',
			params
		)
	}
	id={stringify(${selectorLocal})}
>
	{#snippet Summary({ open: _open })}
		<${componentName}
			selection={
				select(
					EntityType.${entityTypeName},
					${selectorLocal}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
`

const bridgeRoutePageModule = () => `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'
import { parse } from 'devalue'

import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	let selector
	try {
		selector = parseEntitySelector(
			schema,
			BridgeRouteSchema,
			parse(decodeURIComponent(params.routeId))
		)
	} catch {
		error(404, 'Invalid bridge route')
	}
	if (selector instanceof arktype.errors) error(404, 'Invalid bridge route')

	return { selector }
}
`

const bridgeRoutePage = () => entityPage('BridgeRouteView', 'BridgeRoute')

const bridgeRouteStepPageModule = () => `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'
import { parse } from 'devalue'

import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import BridgeRouteStepSchema from '$/schema/BridgeRouteStep.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	let routeSelector
	try {
		routeSelector = parseEntitySelector(
			schema,
			BridgeRouteSchema,
			parse(decodeURIComponent(params.routeId))
		)
	} catch {
		error(404, 'Invalid bridge route')
	}
	if (routeSelector instanceof arktype.errors) error(404, 'Invalid bridge route')

	const index = Number(params.stepIndex)
	if (!Number.isInteger(index) || index < 0) error(404, 'Invalid bridge step')

	const selector = parseEntitySelector(schema, BridgeRouteStepSchema, {
		$route: routeSelector,
		index,
	})
	if (selector instanceof arktype.errors) error(404, 'Invalid bridge step')

	return { selector }
}
`

const bridgeRouteStepPage = () => entityPage('BridgeRouteStepView', 'BridgeRouteStep')

const urlPageModule = () => `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import UrlSchema from '$/schema/Url.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(schema, UrlSchema, {
		url: decodeURIComponent(params.url),
	})
	if (selector instanceof arktype.errors) error(404, 'Invalid URL')

	return { selector }
}
`

const urlPage = () => entityPage('UrlView', 'Url')

const walletConnectionPageModule = () => `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadWalletConnectionSchema from '$/schema/BlockheadWalletConnection.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(schema, BlockheadWalletConnectionSchema, {
		$wallet: {
			id: decodeURIComponent(params.walletId),
		},
	})
	if (selector instanceof arktype.errors) error(404, 'Invalid wallet connection')

	return { selector }
}
`

const walletConnectionPage = () => entityPage('BlockheadWalletConnectionView', 'BlockheadWalletConnection')

const evmCalldataPageModule = () => `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const hex = ZeroExHex(params.hex)
	if (hex instanceof arktype.errors) error(404, 'Invalid calldata hex')
	return {
		selector: {
			hex,
		},
	}
}
`

const evmCalldataPage = () => entityPage('EvmCalldataView', 'EvmCalldata')

const generatorByRouteFileId = {
	'bridge-route-page-module': bridgeRoutePageModule,
	'bridge-route-page': bridgeRoutePage,
	'bridge-route-step-page-module': bridgeRouteStepPageModule,
	'bridge-route-step-page': bridgeRouteStepPage,
	'url-page-module': urlPageModule,
	'url-page': urlPage,
	'wallet-connection-page-module': walletConnectionPageModule,
	'wallet-connection-page': walletConnectionPage,
	'evm-calldata-detail-page-module': evmCalldataPageModule,
	'evm-calldata-detail-page': evmCalldataPage,
} as const

const generatedRouteFileIds = [
	...bridgeRouteFileIds,
	...urlRouteFileIds,
	...walletConnectionRouteFileIds,
	...evmCalldataRouteFileIds,
] as const

const generatedRouteFileById = {
	...bridgeRouteFileById,
	...urlRouteFileById,
	...walletConnectionRouteFileById,
	...evmCalldataRouteFileById,
}

const generatedFiles = () => [
	...generatedRouteFileIds.map((routeFileId) => generatedRouteFileById[routeFileId]?.file).filter(Boolean),
	...multiParamEntityParentPageLayoutRoutes.map((route) => route.file),
	...networkNumericEntityParentPageLayoutRoutes.map((route) => route.file),
	...paramEntityParentPageLayoutRoutes.map((route) => route.file),
	...propsExpressionEntityParentPageLayoutRoutes.map((route) => route.file),
	...simpleEntityPageRoutes.map((route) => route.file),
	...specialParamEntityParentPageLayoutRoutes.map((route) => route.file),
	...staticEntityParentPageLayoutRoutes.map((route) => route.file),
	...staticParentPageLayoutRoutes.map((route) => route.file),
]

const generatedEntitySelectorRouteFiles = () => [
	'src/routes/entity-selector-route-leaves.ts',
	'src/routes/entity-hub-collection-routes.ts',
	...entitySelectorRouteLeaves().flatMap((leaf) => [
		...(leaf.emitPage ? [
			`src/routes/${leaf.path}/+page.ts`,
			`src/routes/${leaf.path}/+page.svelte`,
		] : []),
	]),
]

const writeGeneratedFile = (
	outDirectory: string,
	file: string,
	content: string
) => {
	const path = join(outDirectory, file)
	mkdirSync(dirname(path), { recursive: true })
	writeFileSync(path, `${content.replace(/[ \t]+$/gm, '').replace(/\n*$/, '')}\n`)
}

const writeGeneratedRouteSubset = (
	outDirectory: string,
	filePath: (file: string) => string = (file) => file
) => {
	for (const routeFileId of generatedRouteFileIds) {
		const routeFile = generatedRouteFileById[routeFileId]
		if (!routeFile)
			throw new Error(`Missing route file record: ${routeFileId}`)

		writeGeneratedFile(outDirectory, filePath(routeFile.file), generatorByRouteFileId[routeFileId]())
	}

	for (const route of simpleEntityPageRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), entityPage(route.component, route.entity))

	for (const route of staticParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), staticParentPageLayout(
			route.title,
			route.href.path,
			route.id?.value
		))

	for (const route of staticEntityParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), staticEntityParentPageLayout(
			route.component.name,
			route.entity,
			route.href.path,
			route.selector
		))

	for (const route of paramEntityParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), paramEntityParentPageLayout(
			route.component.name,
			route.entity,
			route.href.path,
			route.param,
			route.hrefParam,
			route.id,
			route.selector
		))

	for (const route of multiParamEntityParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), multiParamEntityParentPageLayout(
			route.component.name,
			route.entity,
			route.href.path,
			route.params,
			route.id
		))

	for (const route of specialParamEntityParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), specialParamEntityParentPageLayout(
			route.component.name,
			route.entity,
			route.href.path,
			route.param,
			route.hrefParam,
			route.id,
			route.selector,
			route.view?.title
		))

	for (const route of propsExpressionEntityParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), propsExpressionEntityParentPageLayout(
			route.component.name,
			route.entity,
			route.href.value,
			route.id.value,
			route.selector.value,
			route.imports,
			route.key?.value
		))

	for (const route of networkNumericEntityParentPageLayoutRoutes)
		writeGeneratedFile(outDirectory, filePath(route.file), networkNumericEntityParentPageLayout(
			route.component.name,
			route.entity,
			route.href.path,
			route.selector.local,
			route.value.field,
			route.value.value,
			route.asConst
		))
}

const stringLiteral = (
	value: string
) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const entityDefinitionByType = Object.fromEntries(schema.map((entityDefinition) => [
	entityDefinition.entityType,
	entityDefinition,
]))

const kebabCase = (
	value: string
) => value
	.replace(/^_+/, '')
	.replace(/_/g, '-')
	.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
	.toLowerCase()

const routeEntitySegmentByType = {
	BeaconBlock: 'block',
	BeaconEpoch: 'epoch',
	BeaconSlot: 'slot',
	EvmAccount: 'account',
	EvmBlob: 'blob',
	EvmBlock: 'block',
	EvmContract: 'contract',
	EvmLog: 'log',
	EvmNetwork: 'network',
	EvmTransaction: 'tx',
	EvmUserOperation: 'user-operation',
	LiquidityPool: 'pool',
	Network: 'network',
	SpecificationProposal: 'proposal',
	YouTubeChannel: 'channel',
	YouTubeComment: 'comment',
	YouTubePlaylist: 'playlist',
	YouTubeVideo: 'video',
} as const

const routeEntitySegment = (
	entity: string
) => routeEntitySegmentByType[entity as keyof typeof routeEntitySegmentByType] ?? kebabCase(entity)

const safeParamName = (
	value: string
) => value
	.replace(/^\$+/, '')
	.replace(/[^A-Za-z0-9_$]/g, '_')
	.replace(/^[^A-Za-z_]/, '_$&')

const uniqueParamName = (
	field: string,
	entity: string,
	usedParamNames: readonly string[]
) => {
	if (entity === 'Network' && field === 'slug') return 'networkSlug'

	const name = safeParamName(field)

	return usedParamNames.includes(name) ?
		`${kebabCase(entity).replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())}${name[0]?.toUpperCase() ?? ''}${name.slice(1)}`
	:
		name
}

const routeParamMatcher = (
	entity: string,
	field: string
) => {
	if (field === 'caip2') return entity === 'EvmNetwork' ? 'eip155NetworkCaip2' : 'networkCaip2'
	if (entity === 'Network' && field === 'slug') return 'networkSlug'
	if (field === 'chainId') return 'eip155ChainId'
	if (field === 'address' && entity.startsWith('Evm')) return 'evmAddress'
	if (field === 'blockNumber' && entity.startsWith('Evm')) return 'evmBlockNumber'
	if (field === 'epoch' || field === 'epochNumber') return 'beaconEpochNumber'
	if (field === 'proposalKindSlug') return 'proposalKindSlug'
	if (field === 'proposalRef') return 'proposalRef'
	if (field === 'round' || field === 'slot' || field === 'slotNumber' || field === 'version') return 'nonNegativeInteger'
	if (field === 'specificationRealmSlug') return 'specificationRealmSlug'
	if (field === 'stepIndex') return 'bridgeRouteStepIndex'
	if (field === 'txHash' && entity.startsWith('Evm')) return 'evmTxHash'

	return undefined
}

const routeParamSegment = (
	entity: string,
	paramName: string,
	field: string
) => {
	const matcher = routeParamMatcher(entity, field)

	return matcher == null ?
		`[${paramName}]`
	:
		`[${paramName}=${matcher}]`
}

const routeDiscriminatorSegment = (
	value: string
) => kebabCase(value.replace(/^by(?=[A-Z])/, ''))
	.replace(/[^a-z0-9-]/g, '-')
	.replace(/-+/g, '-')
	.replace(/^-|-$/g, '')

const routeShapeSegment = (
	segment: string
) => segment.replace(/^\[([^=\]]+)(=([^\]]+))?\]$/, (_match, _name, _matcherExpression, matcher: string | undefined) => (
	matcher == null ?
		'[]'
	:
		`[=${matcher}]`
))

const routeFamilySegmentPath = (
	segment: typeof routeFamilies[number]['root'][number] | typeof routeFamilies[number]['members'][number]['pathSuffix'][number]
) => {
	if (segment.kind === RouteSegmentKind.Group) return `(${segment.value})`
	if (segment.kind === RouteSegmentKind.Static) return segment.value
	if (segment.kind === RouteSegmentKind.Param)
		return segment.matcher == null ?
			`[${segment.name}]`
		:
			`[${segment.name}=${segment.matcher}]`

	return undefined
}

const routeFamilyRootPathSegments = (
	entity: string,
	localFields: readonly string[]
) => [
	...(entity === 'Network' && localFields.length === 1 && localFields[0] === 'slug' ? [[
		'(explore)',
		'(networks)',
		'network',
		'[networkSlug=networkSlug]',
	]] : []),
	...(entity === 'Network' && localFields.length === 1 && localFields[0] === 'caip2' ? [[
		'(explore)',
		'(networks)',
		'network',
		'[caip2=networkCaip2]',
	]] : []),
	...(entity === 'EvmNetwork' && localFields.length === 1 && localFields[0] === 'caip2' ? [[
		'(explore)',
		'(networks)',
		'network',
		'[caip2=eip155NetworkCaip2]',
	]] : []),
	...routeFamilies.flatMap((family) => family.members
		.filter((member) => (
			member.surface === 'detail'
			&& member.entity === entity
			&& localFields.every((field) => member.pathSuffix.some((segment) => (
				segment.kind === RouteSegmentKind.Param
				&& segment.name === field
			)))
		))
		.map((member) => [
			...family.root,
			...member.pathSuffix,
		])
	)
	.map((segments) => segments
		.map(routeFamilySegmentPath)
		.filter((segment) => segment != null)
	),
]

const routeEntityHubPlacement = (
	entity: string
) => routeEntityHubPlacements.find((placement) => (
	placement.prefixes.some((prefix) => (
		entity === prefix
		|| entity.startsWith(prefix)
	))
))

const routeEntityHubPathSegments = (
	entity: string
) => {
	const placement = routeEntityHubPlacement(entity)

	return placement == null ?
		[
			'entities',
		]
	:
		placement.root
			.map(routeFamilySegmentPath)
			.filter((segment) => segment != null)
}

const numericRouteFieldNames = new Set([
	'assetId',
	'blobIndex',
	'epoch',
	'epochNumber',
	'height',
	'index',
	'logIndex',
	'partIndex',
	'proposalNumber',
	'pullRequestNumber',
	'round',
	'sequence',
	'slot',
	'slotNumber',
	'stepIndex',
	'timestampMs',
	'version',
])

const routeParamValueExpression = (
	field: string,
	paramName: string
) => {
	if (field === 'caip2') return `caip2ParamValueFromString(params.${paramName})`
	if (field === 'blockNumber') return `BigInt(params.${paramName})`
	if (numericRouteFieldNames.has(field)) return `Number(params.${paramName})`

	return `decodeURIComponent(params.${paramName})`
}

const selectorLocalRouteShape = (
	entity: string,
	selectorName: string
) => {
	const entityDefinition = entityDefinitionByType[entity]
	const selector = entityDefinition?.selectors.find((candidate) => candidate.name === selectorName)
	if (entityDefinition == null || selector == null) return undefined

	const fieldDefinitionByName = Object.fromEntries(entityDefinition.fields.map((fieldDefinition) => [
		fieldDefinition.name,
		fieldDefinition,
	]))
	const parentFields = selector.fields.filter((field) => (
		fieldDefinitionByName[field]?.type === EntityFieldType.EntityReference
	))
	const localFields = selector.fields.filter((field) => !parentFields.includes(field))

	return [
		...parentFields,
		routeEntitySegment(entity),
		...localFields.map((field) => routeShapeSegment(routeParamSegment(entity, safeParamName(field), field))),
	].join('/')
}

const selectorNeedsRouteDiscriminator = (
	entity: string,
	selectorName: string
) => {
	const entityDefinition = entityDefinitionByType[entity]
	const routeShape = selectorLocalRouteShape(entity, selectorName)

	return (
		routeShape != null
		&& entityDefinition != null
		&& entityDefinition.selectors.filter((selector) => (
			selectorLocalRouteShape(entity, selector.name) === routeShape
		)).length > 1
	)
}

type RouteSelectorPlan = {
	readonly entity: string
	readonly selector: string
	readonly fields: readonly string[]
	readonly parentFields: readonly string[]
	readonly localFields: readonly string[]
	readonly path: string
	readonly relativePath: string
	readonly emitPage: boolean
	readonly params: readonly {
		readonly field: string
		readonly name: string
		readonly matcher?: string
	}[]
	readonly selectorExpression: string
	readonly unresolved: readonly string[]
}

const selectorInputExpression = (
	entries: readonly [string, string][]
) => `{
${entries.map(([field, expression]) => `	${field.startsWith('$') ? stringLiteral(field) : safeParamName(field)}: ${expression
	.split('\n')
	.map((line, index) => index === 0 ? line : `\t${line}`)
	.join('\n')},`).join('\n')}
}`

const indentGeneratedBlock = (
	value: string,
	level: number
) => value
	.split('\n')
	.map((line) => `${'\t'.repeat(level)}${line}`)
	.join('\n')

const combinePlans = (
	planGroups: readonly RouteSelectorPlan[][]
) => planGroups.reduce<RouteSelectorPlan[][]>(
	(combinations, plans) => combinations.flatMap((combination) => plans.map((plan) => [
		...combination,
		plan,
	])),
	[
		[],
	]
)

const routeSelectorPlansFor = (
	entity: string,
	selectorName: string,
	stack: readonly string[] = []
): RouteSelectorPlan[] => {
	const key = `${entity}:${selectorName}`
	if (stack.includes(key)) {
		return [{
			entity,
			selector: selectorName,
			fields: [],
			parentFields: [],
			localFields: [],
			path: `${routeEntitySegment(entity)}/[${safeParamName(selectorName)}]`,
			relativePath: `${routeEntitySegment(entity)}/[${safeParamName(selectorName)}]`,
			emitPage: false,
			params: [],
			selectorExpression: `{}`,
			unresolved: [
				`cycle:${[...stack, key].join(' -> ')}`,
			],
		}]
	}

	const entityDefinition = entityDefinitionByType[entity]
	const selector = entityDefinition?.selectors.find((candidate) => candidate.name === selectorName)
	if (entityDefinition == null || selector == null) return []

	const fieldDefinitionByName = Object.fromEntries(entityDefinition.fields.map((fieldDefinition) => [
		fieldDefinition.name,
		fieldDefinition,
	]))
	const parentFields = selector.fields.filter((field) => (
		fieldDefinitionByName[field]?.type === EntityFieldType.EntityReference
	))
	const localFields = selector.fields.filter((field) => !parentFields.includes(field))
	const parentPlanGroups = parentFields.map((field) => {
		const fieldDefinition = fieldDefinitionByName[field]
		if (fieldDefinition?.type !== EntityFieldType.EntityReference) return []

		const parentEntityDefinition = entityDefinitionByType[fieldDefinition.entityType]

		return parentEntityDefinition == null ?
			[]
		:
			parentEntityDefinition.selectors.flatMap((parentSelector) => routeSelectorPlansFor(
				fieldDefinition.entityType,
				parentSelector.name,
				[
					...stack,
					key,
				]
			))
	})
	const parentCombinations = parentPlanGroups.length === 0 ?
		[
			[],
		]
	:
		combinePlans(parentPlanGroups)

	return parentCombinations.flatMap((parentPlans) => {
		const usedParamNames = parentPlans.flatMap((plan) => plan.params.map((param) => param.name))
		const params = localFields.map((field) => {
			const name = uniqueParamName(field, entity, usedParamNames)

			return {
				field,
				name,
				...(routeParamMatcher(entity, field) && {
					matcher: routeParamMatcher(entity, field),
				}),
			}
		})
		const pathSegments = [
			...parentPlans.flatMap((plan) => plan.path.split('/')),
			routeEntitySegment(entity),
			...params.map((param) => routeParamSegment(entity, param.name, param.field)),
		]
		const entries = [
			...parentFields.map<[string, string]>((field, index) => [
				field,
				parentPlans[index]?.selectorExpression ?? '{}',
			]),
			...params.map<[string, string]>((param) => [
				param.field,
				routeParamValueExpression(param.field, param.name),
			]),
		]
		const discriminatorSegments = selectorNeedsRouteDiscriminator(entity, selector.name) ?
			[
				'by',
				routeDiscriminatorSegment(selector.name),
			]
		:
			[]
		const pathSegmentGroups = parentPlans.length === 0 ?
			(routeFamilyRootPathSegments(entity, localFields).length > 0 ?
				routeFamilyRootPathSegments(entity, localFields)
			:
				[[
					...routeEntityHubPathSegments(entity),
					routeEntitySegment(entity),
					...discriminatorSegments,
					...params.map((param) => routeParamSegment(entity, param.name, param.field)),
				]]
			)
		:
			[
				[
					...(parentPlans[0]?.path.split('/') ?? []),
					...parentPlans.slice(1).flatMap((plan) => plan.relativePath.split('/')),
					routeEntitySegment(entity),
					...discriminatorSegments,
					...params.map((param) => routeParamSegment(entity, param.name, param.field)),
				],
			]

		return pathSegmentGroups.map((pathSegments) => ({
			entity,
			selector: selector.name,
			fields: selector.fields,
			parentFields,
			localFields,
			path: pathSegments.join('/'),
			relativePath: [
				routeEntitySegment(entity),
				...discriminatorSegments,
				...params.map((param) => routeParamSegment(entity, param.name, param.field)),
			].join('/'),
			emitPage: true,
			params: [
				...parentPlans.flatMap((plan) => plan.params),
				...params,
			],
			selectorExpression: selectorInputExpression(entries),
			unresolved: [
				...parentPlans.flatMap((plan) => plan.unresolved),
				...(parentPlans.length === 0 && routeEntityHubPlacement(entity) == null && routeFamilyRootPathSegments(entity, localFields).length === 0 ? [
					`hub-placement:${entity}`,
				] : []),
			],
		}))
	})
}

const entitySelectorRouteLeaves = () => {
	const leaves = schema.flatMap((entityDefinition) => entityDefinition.selectors.flatMap((selector) => (
		routeSelectorPlansFor(entityDefinition.entityType, selector.name)
	)))
	const pathCountByPath = leaves.reduce<Record<string, number>>((countByPath, leaf) => ({
		...countByPath,
		[leaf.path]: (countByPath[leaf.path] ?? 0) + 1,
	}), {})
	const seenPathCountByPath: Record<string, number> = {}

	return leaves.map((leaf) => {
		if (pathCountByPath[leaf.path] === 1) return leaf

		seenPathCountByPath[leaf.path] = (seenPathCountByPath[leaf.path] ?? 0) + 1

		return {
			...leaf,
			emitPage: seenPathCountByPath[leaf.path] === 1,
			unresolved: seenPathCountByPath[leaf.path] === 1 ?
				leaf.unresolved
			:
				[
					...leaf.unresolved,
					`path-conflict:${leaf.path}`,
				],
		}
	}).filter((leaf) => {
		const pathParamNames = new Set([...leaf.path.matchAll(/\[([^=\]]+)(?:=[^\]]+)?\]/g)].map((match) => match[1]!))
		const selectorExpressionParamNames = new Set([...leaf.selectorExpression.matchAll(/\bparams\.([A-Za-z0-9_]+)/g)].map((match) => match[1]!))

		return [...selectorExpressionParamNames].every((paramName) => pathParamNames.has(paramName))
	})
}

const entitySelectorRouteLeavesRegistry = () => {
	const leaves = entitySelectorRouteLeaves()

	return `export const entitySelectorRouteLeaves = [
${leaves.map((leaf) => `	{
		entity: ${stringLiteral(leaf.entity)},
		selector: ${stringLiteral(leaf.selector)},
		fields: [
${leaf.fields.map((field) => `			${stringLiteral(field)},`).join('\n')}
		],
		parentFields: [
${leaf.parentFields.map((field) => `			${stringLiteral(field)},`).join('\n')}
		],
		localFields: [
${leaf.localFields.map((field) => `			${stringLiteral(field)},`).join('\n')}
		],
		params: [
${leaf.params.map((param) => `			{
				field: ${stringLiteral(param.field)},
				name: ${stringLiteral(param.name)},
				${param.matcher == null ? '' : `matcher: ${stringLiteral(param.matcher)},`}
			},`).join('\n')}
		],
		path: ${stringLiteral(leaf.path)},
		emitPage: ${leaf.emitPage ? 'true' : 'false'},
		unresolved: [
${leaf.unresolved.map((issue) => `			${stringLiteral(issue)},`).join('\n')}
		],
	},`).join('\n')}
] as const
`
}

const entitySelectorRouteLeafPageModule = (
	leaf: RouteSelectorPlan
) => `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
${leaf.params.some((param) => param.field === 'caip2') ? "import { caip2ParamValueFromString } from '$/lib/caip2.ts'\n" : ''}import EntitySchema from '$/schema/${leaf.entity}.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
${indentGeneratedBlock(leaf.selectorExpression, 2)}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ${leaf.entity} selector')

	return { selector }
}
`

const routeEntityDetailView = (
	entity: string
) => routeEntityViewComponents[entity as keyof typeof routeEntityViewComponents]?.detail.replace('$/views-new/', '$/views/')

const routeEntityDetailViewComponentName = (
	entity: string
) => routeEntityDetailView(entity)?.match(/\/([^/]+)\.svelte$/)?.[1]

const pluralViewFileByEntityName = {
	AiProviderCatalogEntry: 'AiProviderCatalogEntriesView.svelte',
	AlgorandBox: 'AlgorandBoxesView.svelte',
	BitTorrentFileTreeEntry: 'BitTorrentFileTreeEntriesView.svelte',
	BlockheadCodexStoredData: 'BlockheadCodexStoredDataView.svelte',
	CardanoScriptWitness: 'CardanoScriptWitnessesView.svelte',
	GitTreeEntry: 'GitTreeEntriesView.svelte',
	SorobanContractStorageEntry: 'SorobanContractStorageEntriesView.svelte',
	StarknetClass: 'StarknetClassesView.svelte',
	StarknetStorageEntry: 'StarknetStorageEntriesView.svelte',
	TronWitness: 'TronWitnessesView.svelte',
	XrplLedgerEntry: 'XrplLedgerEntriesView.svelte',
} as const

const routeEntityListView = (
	entity: string
) => routeEntityViewComponents[entity as keyof typeof routeEntityViewComponents]?.list
	?.replace('$/views-new/', '$/views/')
	.replace(
		`/${entity}sView.svelte`,
		`/${pluralViewFileByEntityName[entity as keyof typeof pluralViewFileByEntityName] ?? `${entity}sView.svelte`}`
	)

const routeEntityCollectionSegment = (
	entity: string
) => {
	const listView = routeEntityListView(entity)
	const listViewName = listView?.match(/\/([^/]+)View\.svelte$/)?.[1]

	return kebabCase(listViewName ?? `${entity}s`)
}

const entityHubCollectionRoutes = () => schema
	.filter((entityDefinition) => routeEntityListView(entityDefinition.entityType) != null)
	.map((entityDefinition) => ({
		entity: entityDefinition.entityType,
		hub: routeEntityHubPlacement(entityDefinition.entityType)?.id ?? 'entities',
		path: [
			...routeEntityHubPathSegments(entityDefinition.entityType),
			routeEntityCollectionSegment(entityDefinition.entityType),
		].join('/'),
		view: routeEntityListView(entityDefinition.entityType)!,
		unresolved: [
			...(routeEntityHubPlacement(entityDefinition.entityType) == null ? [
				`hub-placement:${entityDefinition.entityType}`,
			] : []),
		],
	}))

const entityHubCollectionRoutesRegistry = () => {
	const routes = entityHubCollectionRoutes()

	return `export const entityHubCollectionRoutes = [
${routes.map((route) => `	{
		entity: ${stringLiteral(route.entity)},
		hub: ${stringLiteral(route.hub)},
		path: ${stringLiteral(route.path)},
		view: ${stringLiteral(route.view)},
		unresolved: [
${route.unresolved.map((issue) => `			${stringLiteral(issue)},`).join('\n')}
		],
	},`).join('\n')}
] as const
`
}

const entitySelectorRouteLeafPage = (
	entity: string
) => routeEntityDetailViewComponentName(entity) == null ?
	`<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<EntityView
		entityType={EntityType.${entity}}
		entitySelector={data.selector}
		layout={EntityLayout.SummaryDetails}
	/>
</Page>
`
:
	(() => {
		const componentName = routeEntityDetailViewComponentName(entity)!
		const localComponentName = componentName.startsWith('_') ? componentName.slice(1) : componentName

		return `<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ${localComponentName} from '${routeEntityDetailView(entity)}'
</script>


<Page>
	<${localComponentName}
		selection={select(EntityType.${entity}, data.selector)}
	/>
</Page>
`
	})()

const writeEntitySelectorRouteLeaves = (
	outDirectory: string
) => {
	rmSync(join(outDirectory, 'entity'), {
		recursive: true,
		force: true,
	})
	writeGeneratedFile(outDirectory, 'entity-selector-route-leaves.ts', entitySelectorRouteLeavesRegistry())
	writeGeneratedFile(outDirectory, 'entity-hub-collection-routes.ts', entityHubCollectionRoutesRegistry())

	for (const leaf of entitySelectorRouteLeaves().filter((leaf) => leaf.emitPage)) {
		writeGeneratedFile(outDirectory, `${leaf.path}/+page.ts`, entitySelectorRouteLeafPageModule(leaf))
		writeGeneratedFile(outDirectory, `${leaf.path}/+page.svelte`, entitySelectorRouteLeafPage(leaf.entity))
	}
}

const normalizedWhitespace = (value: string) => value.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()

const routeFileContent = (file: string) => readFileSync(file, 'utf8')

const activeRouteFiles = () => execFileSync('find', ['src/routes', '-type', 'f'], { encoding: 'utf8' })
	.trim()
	.split('\n')
	.filter((file) => /\/\+(page|layout)(\.server)?\.(svelte|ts)$/.test(file))

const activeRouteTreeFiles = () => execFileSync('find', ['src/routes', '-type', 'f'], { encoding: 'utf8' })
	.trim()
	.split('\n')

const simpleEntityPageCandidate = (file: string, content: string) => {
	if (!file.endsWith('/+page.svelte')) return undefined
	if (!content.includes("import type { PageProps } from './$types.ts'")) return undefined
	if (!content.includes("import { select } from '$/routes/+layout.svelte'")) return undefined
	if (!content.includes("import { EntityType } from '$/schema/EntityType.ts'")) return undefined
	if (!content.includes("import Page from '$/components/Page.svelte'")) return undefined
	if (!content.includes('data.selector')) return undefined

	const viewImports = [...content.matchAll(/import ([A-Za-z0-9_]+View) from '\$\/views\/([A-Za-z0-9_]+View)\.svelte'/g)]
	if (viewImports.length !== 1) return undefined

	const component = viewImports[0]![1]!
	const entityMatch = content.match(new RegExp(`<${component}\\s+selection=\\{select\\(EntityType\\.([A-Za-z0-9_]+),\\s*data\\.selector\\)\\}\\s*/>`, 's'))
	if (!entityMatch) return undefined

	const body = content.replace(/<script lang="ts">[\s\S]*?<\/script>/, '')
	const expectedBody = `<Page><${component} selection={select(EntityType.${entityMatch[1]}, data.selector)} /></Page>`
	if (normalizedWhitespace(body) !== normalizedWhitespace(expectedBody)) return undefined

	return {
		file,
		entity: entityMatch[1]!,
		component,
	}
}

const routeAudit = () => {
	const generatedRouteOwnershipRows = generatedOwnership().filter((row) => (
		row.ownership === 'generated'
		&& (row.kind === 'route' || row.kind === 'route-section')
	))
	const generatedFileSet = new Set(generatedRouteOwnershipRows.map((row) => row.activePath))
	const generatedStaticParentPageLayoutFiles = new Set(staticParentPageLayoutRoutes.map((route) => route.file))
	const generatedStaticEntityParentPageLayoutFiles = new Set(staticEntityParentPageLayoutRoutes.map((route) => route.file))
	const generatedParamEntityParentPageLayoutFiles = new Set(paramEntityParentPageLayoutRoutes.map((route) => route.file))
	const generatedMultiParamEntityParentPageLayoutFiles = new Set(multiParamEntityParentPageLayoutRoutes.map((route) => route.file))
	const generatedNetworkNumericEntityParentPageLayoutFiles = new Set(networkNumericEntityParentPageLayoutRoutes.map((route) => route.file))
	const generatedPropsExpressionEntityParentPageLayoutFiles = new Set(propsExpressionEntityParentPageLayoutRoutes.map((route) => route.file))
	const generatedSpecialParamEntityParentPageLayoutFiles = new Set(specialParamEntityParentPageLayoutRoutes.map((route) => route.file))
	const declaredSimpleEntityPageFileByFile = Object.fromEntries(
		simpleEntityPageRoutes.map((route) => [
			route.file,
			route,
		])
	)
	const files = activeRouteFiles()
	const routeTreeFiles = activeRouteTreeFiles()
	const simpleEntityPageCandidates = files
		.flatMap((file) => {
			try {
				return simpleEntityPageCandidate(file, routeFileContent(file)) ?? []
			} catch {
				return []
			}
		})
	const simpleEntityPageCandidateFiles = new Set(simpleEntityPageCandidates.map((route) => route.file))
	const parentPageCollapsibleLayoutFiles = files.filter((file) => {
		if (!file.endsWith('/+layout.svelte')) return false
		try {
			return routeFileContent(file).includes("import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'")
		} catch {
			return false
		}
	})
	const parentPageCollapsibleLayouts = parentPageCollapsibleLayoutFiles.map((file) => {
		const content = routeFileContent(file)
		return {
			file,
			content,
		}
	})
	const staticParentPageCollapsibleLayouts = parentPageCollapsibleLayouts.filter(({ content }) => (
		content.includes('title={')
		&& !content.includes('{#snippet Summary')
		&& !content.includes('EntityLayout.SummaryInline')
	))
	const ungeneratedStaticParentPageCollapsibleLayouts = staticParentPageCollapsibleLayouts.filter((layout) => (
		!generatedStaticParentPageLayoutFiles.has(layout.file)
	))
	const entityParentPageCollapsibleLayouts = parentPageCollapsibleLayouts.filter(({ content }) => (
		content.includes('{#snippet Summary')
		&& content.includes('EntityLayout.SummaryInline')
	))
	const ungeneratedEntityParentPageCollapsibleLayouts = entityParentPageCollapsibleLayouts.filter((layout) => (
		!generatedStaticEntityParentPageLayoutFiles.has(layout.file)
		&& !generatedParamEntityParentPageLayoutFiles.has(layout.file)
		&& !generatedMultiParamEntityParentPageLayoutFiles.has(layout.file)
		&& !generatedNetworkNumericEntityParentPageLayoutFiles.has(layout.file)
		&& !generatedPropsExpressionEntityParentPageLayoutFiles.has(layout.file)
		&& !generatedSpecialParamEntityParentPageLayoutFiles.has(layout.file)
	))
	const otherParentPageCollapsibleLayouts = parentPageCollapsibleLayouts.filter(({ file }) => (
		!staticParentPageCollapsibleLayouts.some((layout) => layout.file === file)
		&& !entityParentPageCollapsibleLayouts.some((layout) => layout.file === file)
	))
	const resourceBoundaryPageFiles = files.filter((file) => {
		if (!file.endsWith('/+page.svelte')) return false
		try {
			return routeFileContent(file).includes("import ResourceBoundary from '$/components/ResourceBoundary.svelte'")
		} catch {
			return false
		}
	})
	const collapsibleTabsPageFiles = files.filter((file) => {
		if (!file.endsWith('/+page.svelte')) return false
		try {
			return routeFileContent(file).includes("import CollapsibleTabs")
		} catch {
			return false
		}
	})
	const pageModuleFiles = files.filter((file) => file.endsWith('/+page.ts'))
	const layoutModuleFiles = files.filter((file) => file.endsWith('/+layout.ts'))
	const generatedHeadFiles = routeTreeFiles.filter((file) => generatedFileSet.has(file))
	const missingGeneratedFiles = [...generatedFileSet].filter((file) => !routeTreeFiles.includes(file))
	const ungeneratedSimpleEntityPageCandidates = simpleEntityPageCandidates.filter((route) => (
		!declaredSimpleEntityPageFileByFile[route.file]
		&& !generatedFileSet.has(route.file)
	))
	const unknownFiles = files.filter((file) => (
		!generatedFileSet.has(file)
		&& !simpleEntityPageCandidateFiles.has(file)
		&& !parentPageCollapsibleLayoutFiles.includes(file)
		&& !resourceBoundaryPageFiles.includes(file)
		&& !collapsibleTabsPageFiles.includes(file)
		&& !pageModuleFiles.includes(file)
		&& !layoutModuleFiles.includes(file)
	))

	console.log(`Route audit against active src/routes`)
	console.log(`  route files: ${files.length}`)
	console.log(`  generated records/files: ${generatedFileSet.size}`)
	console.log(`  generated files present in active tree: ${generatedHeadFiles.length}`)
	console.log(`  generated files missing from active tree: ${missingGeneratedFiles.length}`)
	console.log(`  simple entity page candidates: ${simpleEntityPageCandidates.length}`)
	console.log(`  ungenerated simple entity page candidates: ${ungeneratedSimpleEntityPageCandidates.length}`)
	console.log(`  ParentPageCollapsible layouts: ${parentPageCollapsibleLayoutFiles.length}`)
	console.log(`    static titled: ${staticParentPageCollapsibleLayouts.length}`)
	console.log(`    generated static titled: ${staticParentPageLayoutRoutes.length}`)
	console.log(`    ungenerated static titled: ${ungeneratedStaticParentPageCollapsibleLayouts.length}`)
	console.log(`    entity summary: ${entityParentPageCollapsibleLayouts.length}`)
	console.log(`    generated static entity summary: ${staticEntityParentPageLayoutRoutes.length}`)
	console.log(`    generated param entity summary: ${paramEntityParentPageLayoutRoutes.length}`)
	console.log(`    generated multi-param entity summary: ${multiParamEntityParentPageLayoutRoutes.length}`)
	console.log(`    generated network numeric entity summary: ${networkNumericEntityParentPageLayoutRoutes.length}`)
	console.log(`    generated props-expression entity summary: ${propsExpressionEntityParentPageLayoutRoutes.length}`)
	console.log(`    generated special-param entity summary: ${specialParamEntityParentPageLayoutRoutes.length}`)
	console.log(`    ungenerated entity summary: ${ungeneratedEntityParentPageCollapsibleLayouts.length}`)
	console.log(`    other: ${otherParentPageCollapsibleLayouts.length}`)
	console.log(`  ResourceBoundary pages: ${resourceBoundaryPageFiles.length}`)
	console.log(`  CollapsibleTabs pages: ${collapsibleTabsPageFiles.length}`)
	console.log(`  page modules: ${pageModuleFiles.length}`)
	console.log(`  layout modules: ${layoutModuleFiles.length}`)
	console.log(`  still unclassified: ${unknownFiles.length}`)

	if (ungeneratedSimpleEntityPageCandidates.length) {
		console.log(`\nUngenerated simple entity page candidates:`)
		for (const route of ungeneratedSimpleEntityPageCandidates)
			console.log(`  ${route.file} -> ${route.entity} / ${route.component}`)
	}

	if (missingGeneratedFiles.length) {
		console.log(`\nMissing generated file samples:`)
		for (const file of missingGeneratedFiles.slice(0, 10))
			console.log(`  ${file}`)
	}

	console.log(`\nNext route families by count:`)
	console.log(`  entity ParentPageCollapsible layouts (${ungeneratedEntityParentPageCollapsibleLayouts.length} remaining)`)
	console.log(`  static ParentPageCollapsible layouts (${ungeneratedStaticParentPageCollapsibleLayouts.length} remaining simple-detected)`)
	console.log(`  ResourceBoundary pages (${resourceBoundaryPageFiles.length})`)
	console.log(`  CollapsibleTabs pages (${collapsibleTabsPageFiles.length})`)
	console.log(`  page modules (${pageModuleFiles.length})`)

	if (staticParentPageCollapsibleLayouts.length) {
		console.log(`\nUngenerated static ParentPageCollapsible samples:`)
		for (const layout of ungeneratedStaticParentPageCollapsibleLayouts.slice(0, 10))
			console.log(`  ${layout.file}`)
	}

	if (entityParentPageCollapsibleLayouts.length) {
		console.log(`\nUngenerated entity ParentPageCollapsible samples:`)
		for (const layout of ungeneratedEntityParentPageCollapsibleLayouts.slice(0, 10))
			console.log(`  ${layout.file}`)
	}
}

const command = process.argv[2]
const outDirectory = process.argv[3]

if (command === 'audit') {
	routeAudit()
	process.exit(0)
}

if (!outDirectory)
	throw new Error('Usage: pnpm exec tsx scripts/generate-routes.ts <audit|generate-bridge|generate-url|generate-wallet-connection|generate-evm-calldata|generate-all-byte-for-byte|generate-routes> <out-directory>')

if (command === 'generate-routes') {
	if (resolve(outDirectory) === resolve('src/routes'))
		throw new Error('generate-routes writes destructively; generate to .generated/routes and sync only after validation')

	rmSync(outDirectory, {
		recursive: true,
		force: true,
	})
	writeGeneratedRouteSubset(outDirectory, (file) => file.replace(/^src\/routes\//, ''))
	writeEntitySelectorRouteLeaves(outDirectory)
	process.exit(0)
}

if (command === 'generate-all-byte-for-byte') {
	writeGeneratedRouteSubset(outDirectory)
	process.exit(0)
}

const routeFileIds = (
	command === 'generate-bridge' ?
		bridgeRouteFileIds
	:
	command === 'generate-url' ?
		urlRouteFileIds
	:
	command === 'generate-wallet-connection' ?
		walletConnectionRouteFileIds
	:
	command === 'generate-evm-calldata' ?
		evmCalldataRouteFileIds
	:
		undefined
)

if (!routeFileIds)
	throw new Error('Usage: pnpm exec tsx scripts/generate-routes.ts <audit|generate-bridge|generate-url|generate-wallet-connection|generate-evm-calldata|generate-all-byte-for-byte|generate-routes> <out-directory>')

const routeFileById = (
	command === 'generate-bridge' ?
		bridgeRouteFileById
	:
	command === 'generate-url' ?
		urlRouteFileById
	:
	command === 'generate-wallet-connection' ?
		walletConnectionRouteFileById
	:
	command === 'generate-evm-calldata' ?
		evmCalldataRouteFileById
	:
		{
			...bridgeRouteFileById,
			...urlRouteFileById,
			...walletConnectionRouteFileById,
			...evmCalldataRouteFileById,
		}
)

for (const routeFileId of routeFileIds) {
	const routeFile = routeFileById[routeFileId]
	if (!routeFile)
		throw new Error(`Missing route file record: ${routeFileId}`)

	writeGeneratedFile(outDirectory, routeFile.file, generatorByRouteFileId[routeFileId]())
}
