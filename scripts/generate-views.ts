import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'


const cwd = process.cwd()
const schemaMarkdownPath = join(cwd, 'SCHEMA.md')
const viewsDirectory = join(cwd, 'src/views')
const legacyViewsDirectory = join(cwd, 'src/views_')
const schemaMarkdown = readFileSync(schemaMarkdownPath, 'utf8')
const schemaMarkdownLines = schemaMarkdown.split('\n')

type SchemaEntity = {
	name: string
	fields: {
		name: string
		kind: 'primitive' | 'entity' | 'entities'
		entityType?: string
	}[]
}

const splitTopLevel = (
	text: string
) => {
	const parts: string[] = []
	let quote: string | undefined
	let start = 0

	for (let index = 0; index < text.length; index++) {
		const character = text[index]

		if (quote) {
			if (character === quote && text[index - 1] !== '\\')
				quote = undefined

			continue
		}

		if (character === '\'' || character === '"') {
			quote = character
			continue
		}

		if (character === ',') {
			parts.push(text.slice(start, index).trim())
			start = index + 1
		}
	}

	parts.push(text.slice(start).trim())

	return parts.filter(Boolean)
}

const parseFieldToken = (
	token: string
) => {
	const [
		nameWithCardinality,
		typeText,
	] = token.split(' p:').length === 2 ?
		[
			token.split(' p:')[0],
			`p:${token.split(' p:')[1]}`,
		]
	: token.split(' $:').length === 2 ?
		[
			token.split(' $:')[0],
			`$:${token.split(' $:')[1]}`,
		]
	:
		[
			token,
			'',
		]
	const name = nameWithCardinality.replace(/[!?*0]+$/, '')

	return {
		name,
		kind: (
			name.startsWith('$$') ?
				'entities'
			: name.startsWith('$') ?
				'entity'
			:
				'primitive'
		) as SchemaEntity['fields'][number]['kind'],
		...(typeText.startsWith('$:') && {
			entityType: typeText.slice('$:'.length).replace(/ when .+$/, ''),
		}),
	}
}

const parseSchemaEntities = () => {
	const entities: SchemaEntity[] = []
	let currentEntity: SchemaEntity | undefined

	for (const line of schemaMarkdownLines) {
		const entityMatch = line.match(/^  Entity ([A-Za-z0-9_]+)$/)

		if (entityMatch) {
			currentEntity = {
				name: entityMatch[1],
				fields: [],
			}
			entities.push(currentEntity)
			continue
		}

		if (currentEntity && line.startsWith('    Fields :: '))
			currentEntity.fields = splitTopLevel(line.slice('    Fields :: '.length)).map(parseFieldToken)
	}

	return entities
}

const schemaEntities = parseSchemaEntities()
const schemaEntityNames = schemaEntities.map((entityDefinition) => entityDefinition.name)
const schemaEntityNameSet = new Set(schemaEntityNames)
const schemaFieldNameSetByEntityType = Object.fromEntries(schemaEntities.map((entityDefinition) => [
	entityDefinition.name,
	new Set(entityDefinition.fields.map((fieldDefinition) => fieldDefinition.name)),
]))

const viewFiles = readdirSync(viewsDirectory).filter((file) => file.endsWith('.svelte'))
const legacyViewFiles = (
	existsSync(legacyViewsDirectory) ?
		readdirSync(legacyViewsDirectory).filter((file) => file.endsWith('.svelte'))
	:
		[]
)

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

const pluralViewNameCandidates = (
	entityName: string
) => [
	...(entityName in pluralViewFileByEntityName ? [
		pluralViewFileByEntityName[entityName as keyof typeof pluralViewFileByEntityName],
	] : []),
	`${entityName}sView.svelte`,
	`${entityName}esView.svelte`,
	`${entityName.replace(/y$/, 'ies')}View.svelte`,
]

const pluralViewFile = (
	entityName: string
) => (
	entityName in pluralViewFileByEntityName ?
		pluralViewFileByEntityName[entityName as keyof typeof pluralViewFileByEntityName]
	:
		`${entityName}sView.svelte`
)

const singularViewFile = (
	entityName: string
) => `${entityName}View.svelte`

const manyReferencedEntityTypes = [...new Set(schemaEntities.flatMap((entityDefinition) => (
	entityDefinition.fields.flatMap((fieldDefinition) => (
		fieldDefinition.kind === 'entities' && fieldDefinition.entityType !== undefined ?
			[fieldDefinition.entityType]
		:
			[]
	))
)))].sort()

const presentSingularViewFiles = schemaEntityNames
	.filter((entityName) => existsSync(join(viewsDirectory, singularViewFile(entityName))))
	.map(singularViewFile)

const missingSingularViewFiles = schemaEntityNames
	.filter((entityName) => !existsSync(join(viewsDirectory, singularViewFile(entityName))))
	.map(singularViewFile)

const presentPluralViewFiles = manyReferencedEntityTypes
	.filter((entityName) => pluralViewNameCandidates(entityName).some((file) => existsSync(join(viewsDirectory, file))))
	.map((entityName) => pluralViewNameCandidates(entityName).find((file) => existsSync(join(viewsDirectory, file))) ?? `${entityName}sView.svelte`)

const missingPluralViewFiles = manyReferencedEntityTypes
	.filter((entityName) => !pluralViewNameCandidates(entityName).some((file) => existsSync(join(viewsDirectory, file))))
	.map(pluralViewFile)

const manyReferencedEntitiesWithSingularButNoPlural = manyReferencedEntityTypes
	.filter((entityName) => existsSync(join(viewsDirectory, singularViewFile(entityName))))
	.filter((entityName) => !pluralViewNameCandidates(entityName).some((file) => existsSync(join(viewsDirectory, file))))

const unmatchedViewFiles = viewFiles.filter((file) => {
	if (schemaEntityNameSet.has(file.replace(/View\.svelte$/, '')))
		return false

	return !schemaEntityNames.some((entityName) => pluralViewNameCandidates(entityName).includes(file))
})

const viewKindRows = viewFiles.map((file) => {
	const content = readFileSync(join(viewsDirectory, file), 'utf8')

	return {
		file,
		usesEntityView2: content.includes('EntityView2'),
		usesLegacyEntityView: content.includes('EntityView.svelte') && !content.includes('EntityView2'),
		usesResourceBoundary: content.includes('ResourceBoundary'),
		usesCollapsibleTabs: content.includes('CollapsibleTabs'),
		usesEntitiesList: content.includes('EntitiesList'),
		usesCustomDetails: content.includes('{#snippet Details') || content.includes('Details={'),
		usesDeclaredView: content.includes('view={{') || content.includes('view={'),
	}
})

const patternByName = {
	assets: [
		'Image',
		'Video',
		'Audio',
		'Avatar',
		'Thumbnail',
		'Media',
	],
	currency: [
		'CurrencyAmount',
		'NumberValue',
	],
	entityLists: [
		'EntitiesList',
	],
	metrics: [
		'SocialMetricSnapshotRows',
	],
	resourceBoundaries: [
		'ResourceBoundary',
	],
	tabs: [
		'CollapsibleTabs',
	],
	tooltips: [
		'Tooltip',
	],
	truncation: [
		'TruncatedValue',
		'Address',
	],
} as const

const patternFiles = Object.fromEntries(Object.entries(patternByName).map(([
	patternName,
	tokens,
]) => [
	patternName,
	viewFiles.filter((file) => {
		const content = readFileSync(join(viewsDirectory, file), 'utf8')

		return tokens.some((token) => content.includes(token))
	}),
]))

const literalViewMetadataKeys = new Set([
	'component',
	'cases',
	'defaultOpen',
	'description',
	'defer',
	'direction',
	'Empty',
	'emptyText',
	'entityType',
	'equals',
	'fallbackIcon',
	'facets',
	'field',
	'for',
	'format',
	'group',
	'href',
	'children',
	'id',
	'intervals',
	'Item',
	'item',
	'kind',
	'label',
	'layout',
	'itemLayout',
	'list',
	'listDisplay',
	'name',
	'operator',
	'order',
	'orientation',
	'openFacets',
	'parentField',
	'placeholderText',
	'prefix',
	'preview',
	'prop',
	'referenceDisplay',
	'selector',
	'selectorPath',
	'selectorNormalization',
	'slot',
	'sort',
	'sources',
	'suffix',
	'unit',
	'view',
	'when',
])

let currentEntityName: string | undefined
const viewLines = schemaMarkdownLines.flatMap((line, index) => {
	const entityMatch = line.match(/^  Entity ([A-Za-z0-9_]+)$/)

	if (entityMatch)
		currentEntityName = entityMatch[1]

	return (
		line.startsWith('    View :: ') ?
			[{
				entityType: currentEntityName,
				lineNumber: index + 1,
				text: line.slice('    View :: '.length),
			}]
		:
			[]
	)
})

const parseViewLine = (
	text: string
) => {
	try {
		return {
			value: JSON.parse(text),
			error: undefined,
		}
	} catch (error) {
		return {
			value: undefined,
			error,
		}
	}
}

const stringLiteral = (
	value: string
) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const generatedFileHeader = `<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


`

const writeGeneratedFile = (
	outDirectory: string,
	file: string,
	content: string
) => {
	const path = join(outDirectory, file)
	mkdirSync(dirname(path), { recursive: true })
	writeFileSync(path, `${content.replace(/[ \t]+$/gm, '').replace(/\n*$/, '')}\n`)
}

const collectBareStringValues = (
	value: unknown,
	key?: string
): string[] => (
	typeof value === 'string' ?
		(
			key === undefined || !literalViewMetadataKeys.has(key) ?
				[value]
			:
				[]
		)
	: Array.isArray(value) ?
		value.flatMap((item) => collectBareStringValues(
			item,
			key
		))
	: Object(value) === value ?
		Object.entries(value).flatMap(([
			childKey,
			childValue,
		]) => collectBareStringValues(
			childValue,
			childKey
		))
	:
		[]
)

const parsedViewRows = viewLines.map((viewLine) => ({
	...viewLine,
	...parseViewLine(viewLine.text),
}))

const parsedViewRowByEntityType = Object.fromEntries(parsedViewRows.map((viewRow) => [
	viewRow.entityType,
	viewRow,
]))

const literalViewMetadataValue = (
	value: unknown
): unknown => (
	Object(value) === value
	&& !Array.isArray(value)
	&& Object.keys(value).length === 1
	&& 'label' in value
	&& typeof value.label === 'string' ?
		value.label
	: Array.isArray(value) ?
		value.map(literalViewMetadataValue)
	:
		value
)

const isFieldName = (
	entityName: string,
	value: string
) => schemaFieldNameSetByEntityType[entityName]?.has(value) === true

const viewDeclarationItem = (
	entityName: string,
	value: unknown
): unknown => (
	typeof value === 'string' && isFieldName(
		entityName,
		value
	) ?
		value
	: typeof value === 'string' ?
		{
			label: value,
		}
	: Array.isArray(value) ?
		value.map((item) => viewDeclarationItem(
			entityName,
			item
		))
	: Object(value) === value ?
		(
			Object.keys(value).length === 1
			&& 'label' in value
			&& typeof value.label === 'string'
			&& isFieldName(
				entityName,
				value.label
			) ?
				value.label
			:
				Object.fromEntries(Object.entries(value).map(([
					key,
					childValue,
				]) => [
					key,
					literalViewMetadataKeys.has(key) ?
						literalViewMetadataValue(childValue)
					:
						viewDeclarationItem(
							entityName,
							childValue
						),
				]))
		)
	:
		value
)

const normalizedViewDeclaration = (
	entityName: string,
	value: unknown
) => {
	if (Object(value) !== value || Array.isArray(value))
		return {}

	const declaration = value as {
		layout?: unknown
		defaultOpen?: unknown
		route?: unknown
		query?: unknown
		media?: unknown
		metrics?: unknown
		latest?: unknown
		list?: unknown
		lists?: unknown
		display?: unknown
		conditions?: unknown
		panels?: unknown
		actions?: unknown
		decodes?: unknown
		charts?: unknown
		forms?: unknown
		transforms?: unknown
		tooltips?: unknown
		slots?: unknown
		renderers?: unknown
		dispatch?: unknown
		summary?: unknown
		closed?: unknown[]
		content?: {
			dl?: unknown[][]
			blocks?: unknown[][]
		}
		details?: {
			tabs?: unknown[]
		}
	}

	return {
		...(declaration.layout !== undefined && {
			layout: literalViewMetadataValue(declaration.layout),
		}),
		...(declaration.defaultOpen !== undefined && {
			defaultOpen: viewDeclarationItem(
				entityName,
				declaration.defaultOpen
			),
		}),
		...(declaration.route !== undefined && {
			route: viewDeclarationItem(
				entityName,
				declaration.route
			),
		}),
		...(declaration.query !== undefined && {
			query: viewDeclarationItem(
				entityName,
				declaration.query
			),
		}),
		...(declaration.media !== undefined && {
			media: viewDeclarationItem(
				entityName,
				declaration.media
			),
		}),
		...(declaration.metrics !== undefined && {
			metrics: viewDeclarationItem(
				entityName,
				declaration.metrics
			),
		}),
		...(declaration.latest !== undefined && {
			latest: viewDeclarationItem(
				entityName,
				declaration.latest
			),
		}),
		...(declaration.list !== undefined && {
			list: viewDeclarationItem(
				entityName,
				declaration.list
			),
		}),
		...(declaration.lists !== undefined && {
			lists: viewDeclarationItem(
				entityName,
				declaration.lists
			),
		}),
		...(declaration.display !== undefined && {
			display: viewDeclarationItem(
				entityName,
				declaration.display
			),
		}),
		...(declaration.conditions !== undefined && {
			conditions: viewDeclarationItem(
				entityName,
				declaration.conditions
			),
		}),
		...(declaration.panels !== undefined && {
			panels: viewDeclarationItem(
				entityName,
				declaration.panels
			),
		}),
		...(declaration.actions !== undefined && {
			actions: viewDeclarationItem(
				entityName,
				declaration.actions
			),
		}),
		...(declaration.decodes !== undefined && {
			decodes: viewDeclarationItem(
				entityName,
				declaration.decodes
			),
		}),
		...(declaration.charts !== undefined && {
			charts: viewDeclarationItem(
				entityName,
				declaration.charts
			),
		}),
		...(declaration.forms !== undefined && {
			forms: viewDeclarationItem(
				entityName,
				declaration.forms
			),
		}),
		...(declaration.transforms !== undefined && {
			transforms: viewDeclarationItem(
				entityName,
				declaration.transforms
			),
		}),
		...(declaration.tooltips !== undefined && {
			tooltips: viewDeclarationItem(
				entityName,
				declaration.tooltips
			),
		}),
		...(declaration.slots !== undefined && {
			slots: viewDeclarationItem(
				entityName,
				declaration.slots
			),
		}),
		...(declaration.renderers !== undefined && {
			renderers: viewDeclarationItem(
				entityName,
				declaration.renderers
			),
		}),
		...(declaration.dispatch !== undefined && {
			dispatch: viewDeclarationItem(
				entityName,
				declaration.dispatch
			),
		}),
		...(declaration.summary !== undefined && {
			summary: viewDeclarationItem(
				entityName,
				declaration.summary
			),
		}),
		...(declaration.closed && {
			closed: declaration.closed.map((item) => viewDeclarationItem(
				entityName,
				item
			)),
		}),
		...(declaration.content && {
			content: {
				...(declaration.content.dl && {
					dl: declaration.content.dl.map((items) => items.map((item) => viewDeclarationItem(
						entityName,
						item
					))),
				}),
				...(declaration.content.blocks && {
					blocks: declaration.content.blocks.map((items) => items.map((item) => viewDeclarationItem(
						entityName,
						item
					))),
				}),
			},
		}),
		...(declaration.details?.tabs && {
			details: {
				tabs: declaration.details.tabs.map((tab) => (
					Array.isArray(tab) ?
						{
							label: String(tab[0]),
							items: (Array.isArray(tab[1]) ? tab[1] : []).map((item) => viewDeclarationItem(
								entityName,
								item
							)),
						}
					:
						viewDeclarationItem(
							entityName,
							tab
						)
				)),
			},
		}),
	}
}

const serializeTs = (
	value: unknown,
	indent = 0
): string => {
	const tab = '\t'.repeat(indent)
	const childTab = '\t'.repeat(indent + 1)

	if (typeof value === 'string')
		return stringLiteral(value)

	if (value === undefined)
		return 'undefined'

	if (value === null || typeof value === 'number' || typeof value === 'boolean')
		return String(value)

	if (Array.isArray(value))
		return value.length === 0 ?
			'[]'
		:
			`[\n${value.map((item) => `${childTab}${serializeTs(item, indent + 1)},`).join('\n')}\n${tab}]`

	if (Object(value) === value)
		return `{\n${Object.entries(value)
			.filter(([, item]) => item !== undefined)
			.map(([
				key,
				item,
			]) => `${childTab}${key}: ${serializeTs(item, indent + 1)},`)
			.join('\n')}\n${tab}}`

	return 'undefined'
}

const generatedSingularView = (
	entityName: string,
	viewDeclaration: unknown
) => `${generatedFileHeader}	// State
	const view = ${serializeTs(viewDeclaration, 1)} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		layout = view.layout === undefined ? undefined : EntityLayout[view.layout],
		open = $bindable(view.defaultOpen ?? true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.${entityName}>
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.${entityName}}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
	{view}
/>
`

const generatedPluralView = (
	entityName: string,
	fileName: string,
	listDeclaration: unknown
) => {
	const componentName = `${entityName}View`
	const localComponentName = componentName.startsWith('_') ? componentName.slice(1) : componentName
	const listView = (
		Object(listDeclaration) === listDeclaration
		&& !Array.isArray(listDeclaration) ?
			listDeclaration as {
				emptyText?: string
				filters?: readonly {
					field: string
					prop: string
				}[]
				itemLayout?: string
				itemOpen?: boolean
				orderBy?: readonly {
					direction?: string
					field: string
				}[]
				placeholderText?: string
				query?: {
					limit?: number
					sources?: readonly string[]
				}
			}
		:
			{}
	)
	const filterProps = listView.filters ?? []
	const filterCondition = filterProps.length === 0 ?
		undefined
	:
		filterProps.map((filter) => `(${filter.prop} === undefined || item.entitySelector.${filter.field} === ${filter.prop})`).join(' && ')
	const filterPropDestructure = filterProps.length === 0 ?
		''
	:
		`${filterProps.map((filter) => `		${filter.prop},`).join('\n')}\n`
	const filterPropTypes = filterProps.length === 0 ?
		''
	:
		`${filterProps.map((filter) => `			${filter.prop}?: EntitySelector<typeof schema, EntityType.${entityName}>[${stringLiteral(filter.field)}]`).join('\n')}\n`
	const itemOpenAttribute = listView.itemOpen === undefined ?
		''
	:
		`				open={listView.itemOpen}\n`

	return `<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	const listView = {
		entityType: EntityType.${entityName},
		emptyText: ${stringLiteral(listView.emptyText ?? `No ${fileName.replace(/View\.svelte$/, '').toLowerCase()} in this context yet.`)},
		item: ${stringLiteral(listView.itemLayout ?? 'summary')},
		${listView.itemOpen !== undefined ? `itemOpen: ${listView.itemOpen},\n\t\t` : ''}${listView.placeholderText === undefined ? '' : `placeholderText: ${stringLiteral(listView.placeholderText)},\n\t\t`}${listView.query === undefined ? '' : `query: ${serializeTs(listView.query, 2).replace(/'([A-Za-z0-9_]+)'/g, 'Source.$1')},\n\t\t`}${listView.orderBy === undefined ? '' : `orderBy: ${serializeTs(listView.orderBy, 2)},\n\t\t`}itemLayout: EntityLayout.${listView.itemLayout ?? 'Summary'},
		orientation: 'column',
	} as const

	let {
		selection,
		title,
		open = $bindable(true),
		id = '${fileName.replace(/View\.svelte$/, '')}',
		href = '',
${filterPropDestructure}		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.${entityName}>
			title?: string
			open?: boolean
			id?: string
			href?: string
${filterPropTypes}
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ${localComponentName} from '$/views/${entityName}View.svelte'
${filterProps.length === 0 ? '' : `	import type { EntitySelector } from '$/schema/$schema.ts'`}
</script>


<EntitiesList
	entityType={listView.entityType}
	{title}
	bind:open
	{id}
	href={href}
	resource={selection(listView.query)}
	getKey={(entity) => stringify(entity.entitySelector)}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	placeholderText={listView.placeholderText}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			{listView.emptyText}
		</p>
	{/snippet}

	{#snippet Item({ item })}
${filterCondition === undefined ? '' : `		{#if ${filterCondition}}
`}		<${localComponentName}
			selection={select(EntityType.${entityName}, item.entitySelector)}
			layout={listView.itemLayout}
${itemOpenAttribute}		/>
${filterCondition === undefined ? '' : `		{/if}
`}
	{/snippet}
</EntitiesList>
`
}

const generateMissingSingularViews = (
	outDirectory: string,
	limit?: number
) => {
	for (const entityName of missingSingularViewFiles
		.map((file) => file.replace(/View\.svelte$/, ''))
		.slice(0, limit)) {
		const viewRow = parsedViewRowByEntityType[entityName]

		if (viewRow?.value === undefined)
			continue

		writeGeneratedFile(
			outDirectory,
			`src/views/${entityName}View.svelte`,
			generatedSingularView(
				entityName,
				normalizedViewDeclaration(
					entityName,
					viewRow.value
				)
			)
		)
	}
}

const generateExistingSingularViews = (
	outDirectory: string,
	limit?: number
) => {
	for (const file of presentSingularViewFiles.slice(0, limit)) {
		const entityName = file.replace(/View\.svelte$/, '')
		const viewRow = parsedViewRowByEntityType[entityName]

		if (viewRow?.value === undefined)
			continue

		writeGeneratedFile(
			outDirectory,
			`src/views/${file}`,
			generatedSingularView(
				entityName,
				normalizedViewDeclaration(
					entityName,
					viewRow.value
				)
			)
		)
	}
}

const generateMissingPluralViews = (
	outDirectory: string,
	limit?: number
) => {
	for (const file of missingPluralViewFiles.slice(0, limit)) {
		const entityName = file.replace(/sView\.svelte$/, '')

		if (!schemaEntityNameSet.has(entityName))
			continue

		writeGeneratedFile(
			outDirectory,
			`src/views/${file}`,
			generatedPluralView(
				entityName,
				file,
				normalizedViewDeclaration(
					entityName,
					parsedViewRowByEntityType[entityName]?.value
				).list
			)
		)
	}
}

const pluralEntityNameFromFile = (
	file: string
) => schemaEntityNames.find((entityName) => pluralViewNameCandidates(entityName).includes(file))

const generateExistingPluralViews = (
	outDirectory: string,
	limit?: number
) => {
	for (const file of presentPluralViewFiles.slice(0, limit)) {
		const entityName = pluralEntityNameFromFile(file)

		if (entityName === undefined)
			continue

		writeGeneratedFile(
			outDirectory,
			`src/views/${file}`,
			generatedPluralView(
				entityName,
				file,
				normalizedViewDeclaration(
					entityName,
					parsedViewRowByEntityType[entityName]?.value
				).list
			)
		)
	}
}

const generateAllViews = (
	outDirectory: string = viewsDirectory
) => {
	if (existsSync(outDirectory))
		for (const file of readdirSync(outDirectory))
			if (file.endsWith('.svelte'))
				rmSync(join(outDirectory, file))

	for (const entityName of schemaEntityNames) {
		const viewRow = parsedViewRowByEntityType[entityName]

		if (viewRow?.value === undefined)
			continue

		writeGeneratedFile(
			outDirectory,
			`${entityName}View.svelte`,
			generatedSingularView(
				entityName,
				normalizedViewDeclaration(
					entityName,
					viewRow.value
				)
			)
		)
	}

	for (const entityName of manyReferencedEntityTypes) {
		const fileName = pluralViewFile(entityName)

		writeGeneratedFile(
			outDirectory,
			fileName,
			generatedPluralView(
				entityName,
				fileName,
				normalizedViewDeclaration(
					entityName,
					parsedViewRowByEntityType[entityName]?.value
				).list
			)
		)
	}
}

const generateSingularViews = (
	outDirectory: string,
	entityNames: readonly string[]
) => {
	for (const entityName of entityNames) {
		const viewRow = parsedViewRowByEntityType[entityName]

		if (viewRow?.value === undefined)
			throw new Error(`Missing View row for ${entityName}`)

		writeGeneratedFile(
			outDirectory,
			`${entityName}View.svelte`,
			generatedSingularView(
				entityName,
				normalizedViewDeclaration(
					entityName,
					viewRow.value
				)
			)
		)
	}
}

const generatePluralViews = (
	outDirectory: string,
	entityNames: readonly string[]
) => {
	for (const entityName of entityNames) {
		const fileName = pluralViewFile(entityName)

		writeGeneratedFile(
			outDirectory,
			`${fileName}`,
			generatedPluralView(
				entityName,
				fileName,
				normalizedViewDeclaration(
					entityName,
					parsedViewRowByEntityType[entityName]?.value
				).list
			)
		)
	}
}

const normalizeSchemaViewDeclarations = () => {
	const lines = [...schemaMarkdownLines]

	for (const row of parsedViewRows) {
		if (row.value === undefined || row.entityType === undefined)
			continue

		lines[row.lineNumber - 1] = `    View :: ${JSON.stringify(normalizedViewDeclaration(
			row.entityType,
			row.value
		))}`
	}

	writeFileSync(
		schemaMarkdownPath,
		`${lines.join('\n').replace(/\n*$/, '')}\n`
	)
}

const invalidViewRows = parsedViewRows.filter((row) => row.error !== undefined)

const declarativeFeatureKeys = [
	'route',
	'query',
	'media',
	'metrics',
	'latest',
	'list',
	'lists',
	'display',
	'conditions',
	'panels',
	'actions',
	'decodes',
	'charts',
	'forms',
	'transforms',
	'tooltips',
	'slots',
	'renderers',
	'dispatch',
	'summary',
] as const

const declarativeFeatureRows = declarativeFeatureKeys.map((featureKey) => ({
	featureKey,
	count: parsedViewRows.filter((row) => row.value && Object.hasOwn(row.value, featureKey)).length,
}))

const viewRowsWithBareNonFieldStrings = parsedViewRows.flatMap((row) => {
	if (row.value === undefined)
		return []

	const entityType = row.entityType
	const fieldNames = entityType === undefined ? undefined : schemaFieldNameSetByEntityType[entityType]

	return collectBareStringValues(row.value)
		.filter((stringValue) => !fieldNames?.has(stringValue))
		.map((stringValue) => ({
			lineNumber: row.lineNumber,
			entityType,
			stringValue,
		}))
})

const logSamples = (
	label: string,
	values: readonly string[],
	limit = 12
) => {
	console.log(`${label}: ${values.length}`)

	for (const value of values.slice(0, limit))
		console.log(`  ${value}`)

	if (values.length > limit)
		console.log(`  ... ${values.length - limit} more`)
}

const viewAudit = () => {
	console.log('View audit')
	console.log(`  schema entities: ${schemaEntityNames.length}`)
	console.log(`  view files: ${viewFiles.length}`)
	console.log(`  legacy view files: ${legacyViewFiles.length}`)
	console.log(`  singular views: ${presentSingularViewFiles.length} present, ${missingSingularViewFiles.length} missing`)
	console.log(`  many-reference entity targets: ${manyReferencedEntityTypes.length}`)
	console.log(`  plural views for many targets: ${presentPluralViewFiles.length} present, ${missingPluralViewFiles.length} missing`)
	console.log(`  many targets with singular but no plural: ${manyReferencedEntitiesWithSingularButNoPlural.length}`)
	console.log(`  EntityView2 files: ${viewKindRows.filter((row) => row.usesEntityView2).length}`)
	console.log(`  declared view prop files: ${viewKindRows.filter((row) => row.usesDeclaredView).length}`)
	console.log(`  ResourceBoundary files: ${viewKindRows.filter((row) => row.usesResourceBoundary).length}`)
	console.log(`  CollapsibleTabs files: ${viewKindRows.filter((row) => row.usesCollapsibleTabs).length}`)
	console.log(`  EntitiesList files: ${viewKindRows.filter((row) => row.usesEntitiesList).length}`)
	console.log(`  custom Details files: ${viewKindRows.filter((row) => row.usesCustomDetails).length}`)
	console.log(`  SCHEMA.md View rows: ${viewLines.length}`)
	console.log(`  parseable View rows: ${parsedViewRows.length - invalidViewRows.length}`)
	console.log(`  invalid View rows: ${invalidViewRows.length}`)
	console.log(`  View row bare non-field strings: ${viewRowsWithBareNonFieldStrings.length}`)

	console.log('\nPatterns')
	for (const [
		patternName,
		files,
	] of Object.entries(patternFiles))
		console.log(`  ${patternName}: ${files.length}`)

	console.log('\nDeclarative features')
	for (const row of declarativeFeatureRows)
		console.log(`  ${row.featureKey}: ${row.count}`)

	console.log('')
	logSamples('Missing singular views', missingSingularViewFiles)
	console.log('')
	logSamples('Missing plural views for many-reference targets', missingPluralViewFiles)
	console.log('')
	logSamples('Many-reference targets with singular but no plural', manyReferencedEntitiesWithSingularButNoPlural.map((entityName) => `${entityName}sView.svelte`))
	console.log('')
	logSamples('View files outside singular/plural schema conventions', unmatchedViewFiles)

	if (invalidViewRows.length) {
		console.log('\nInvalid View row samples')
		for (const row of invalidViewRows.slice(0, 12))
			console.log(`  SCHEMA.md:${row.lineNumber} ${row.text}`)
	}

	if (viewRowsWithBareNonFieldStrings.length) {
		console.log('\nBare non-field View string samples')
		for (const row of viewRowsWithBareNonFieldStrings.slice(0, 20))
			console.log(`  SCHEMA.md:${row.lineNumber} ${row.entityType ?? '?'}: ${row.stringValue}`)
	}
}

const command = process.argv[2]
const outDirectory = process.argv[3]
const limit = process.argv[4] === undefined ? undefined : Number(process.argv[4])

if (command === 'audit') {
	viewAudit()
	process.exit(0)
}

if (command === 'generate-missing-singular') {
	if (!outDirectory)
		throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} generate-missing-singular <out-directory> [limit]`)

	generateMissingSingularViews(
		outDirectory,
		limit
	)
	process.exit(0)
}

if (command === 'generate-existing-singular') {
	if (!outDirectory)
		throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} generate-existing-singular <out-directory> [limit]`)

	generateExistingSingularViews(
		outDirectory,
		limit
	)
	process.exit(0)
}

if (command === 'generate-missing-plural') {
	if (!outDirectory)
		throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} generate-missing-plural <out-directory> [limit]`)

	generateMissingPluralViews(
		outDirectory,
		limit
	)
	process.exit(0)
}

if (command === 'generate-existing-plural') {
	if (!outDirectory)
		throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} generate-existing-plural <out-directory> [limit]`)

	generateExistingPluralViews(
		outDirectory,
		limit
	)
	process.exit(0)
}

if (command === 'generate-all') {
	generateAllViews(outDirectory ?? viewsDirectory)
	process.exit(0)
}

if (command === 'generate-singular') {
	if (!outDirectory || process.argv[4] === undefined)
		throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} generate-singular <out-directory> <entity> [...entity]`)

	generateSingularViews(
		outDirectory,
		process.argv.slice(4)
	)
	process.exit(0)
}

if (command === 'generate-plural') {
	if (!outDirectory || process.argv[4] === undefined)
		throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} generate-plural <out-directory> <entity> [...entity]`)

	generatePluralViews(
		outDirectory,
		process.argv.slice(4)
	)
	process.exit(0)
}

if (command === 'format-schema-views') {
	normalizeSchemaViewDeclarations()
	process.exit(0)
}

throw new Error(`Usage: pnpm exec tsx ${basename(process.argv[1])} <audit|generate-all|generate-singular|generate-plural|generate-missing-singular|generate-existing-singular|generate-missing-plural|generate-existing-plural|format-schema-views>`)
