import { pathToFileURL } from 'node:url'

import { inventoryWitnesses, roleCounts } from './inventory.ts'
import { readText, walkFiles, writeJsonl, writeText } from './files.ts'
import type { EvidenceFact, WitnessFile } from './types.ts'
import { validateSourceBindings } from '../../src/sources/validateSourceBindings.ts'

const linesOf = (path: string) => readText(path).split('\n')

const balancedSlice = (
	text: string,
	start: number,
	open: string,
	close: string
) => {
	let depth = 0
	let quote: string | undefined

	for (let index = start; index < text.length; index += 1) {
		const character = text[index]
		const previous = text[index - 1]

		if (quote) {
			if (character === quote && previous !== '\\')
				quote = undefined

			continue
		}

		if (character === '\'' || character === '"' || character === '`') {
			quote = character
			continue
		}

		if (character === open)
			depth += 1
		else if (character === close) {
			depth -= 1

			if (depth === 0)
				return text.slice(start, index + 1)
		}
	}

	return undefined
}

const splitTopLevel = (text: string, delimiter: string) => {
	const parts: string[] = []
	let depth = 0
	let quote: string | undefined
	let start = 0

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index]
		const previous = text[index - 1]

		if (quote) {
			if (character === quote && previous !== '\\')
				quote = undefined

			continue
		}

		if (character === '\'' || character === '"' || character === '`') {
			quote = character
			continue
		}

		if (character === '(' || character === '[' || character === '{' || character === '<')
			depth += 1
		else if (character === ')' || character === ']' || character === '}' || character === '>')
			depth -= 1
		else if (character === delimiter && depth === 0) {
			parts.push(text.slice(start, index).trim())
			start = index + 1
		}
	}

	parts.push(text.slice(start).trim())

	return parts.filter(Boolean)
}

const parseSchemaSelector = (text: string) => {
	const [name, fieldsText = ''] = text.split(':').map((part) => part.trim())

	return {
		name,
		fields: fieldsText.split('+').map((field) => field.trim()).filter(Boolean),
	}
}

const parseSchemaField = (text: string) => {
	const match = text.match(/^([A-Za-z_$][\w$]*[!?*0+]*\??)\s+(.+)$/)

	if (!match)
		return {
			name: text,
			cardinality: 'unknown',
			typeText: '',
		}

	const optional = match[1].endsWith('?')
	const rawNameWithoutOptional = optional ? match[1].slice(0, -1) : match[1]
	const many = rawNameWithoutOptional.endsWith('*') || rawNameWithoutOptional.endsWith('+')
	const zero = rawNameWithoutOptional.endsWith('0')
	const required = rawNameWithoutOptional.endsWith('!')
	const name = rawNameWithoutOptional.replace(/[!*+0]$/, '')

	return {
		name,
		cardinality: (
			zero ?
				'0'
			: many && optional ?
				'ZeroOrMany'
			: many ?
				'*'
			: optional ?
				'?'
			: required ?
				'!'
			:
				'One'
		),
		typeText: match[2],
	}
}

const parseSchemaMetadata = (text: string) => (
	Object.fromEntries(
		text
			.split(' ; ')
			.map((part) => part.split(' :: '))
			.filter((parts) => parts.length === 2)
			.map(([key, value]) => [
				key[0]?.toLowerCase() + key.slice(1),
				value,
			])
	)
)

const extractSchemaEnums = (content: string, entityName: string | undefined) => (
	entityName === undefined ? [] :
	Array.from(content.matchAll(/export enum ([A-Za-z0-9_]+) \{([\s\S]*?)\n\}/g))
		.filter((enumMatch) => enumMatch[1] !== `${entityName}Selector`)
		.map((enumMatch) => ({
			name: enumMatch[1],
			members: Array.from(enumMatch[2].matchAll(/\n\t([A-Za-z0-9_]+) = '([^']+)',/g)).map((memberMatch) => ({
				name: memberMatch[1],
				value: memberMatch[2],
			})),
		}))
		.filter((enumeration) => enumeration.members.length > 0)
)

const fact = (
	file: WitnessFile,
	kind: string,
	identity: string,
	value: unknown,
	parser: string,
	sourceLine?: number
): EvidenceFact => ({
	kind,
	identity,
	value,
	sourceFile: file.path,
	...(sourceLine === undefined ? {} : {
		sourceLine,
	}),
	sourceRole: file.role,
	parser,
	confidence: 'derived',
})

type EntitySelectorRouteLeaf = {
	entity: string
	selector: string
	fields: string[]
	parentFields: string[]
	localFields: string[]
	params: {
		field: string
		name: string
		matcher?: string
	}[]
	path: string
	emitPage?: boolean
	unresolved: string[]
}

type EntityHubCollectionRoute = {
	entity: string
	hub: string
	path: string
	view: string
	unresolved: string[]
}

const routeVisiblePath = (routePath: string) => (
	routePath
		.split('/')
		.filter((segment) => !segment.startsWith('(') && !segment.endsWith(')'))
		.join('/')
)

const routeGroupPath = (routePath: string) => (
	routePath
		.split('/')
		.filter((segment) => segment.startsWith('(') && segment.endsWith(')'))
		.join('/')
)

const routeParams = (routePath: string) => (
	Array.from(routePath.matchAll(/\[([^=\]]+)(?:=([^\]]+))?\]/g)).map((match) => ({
		name: match[1],
		...(match[2] === undefined ? {} : {
			matcher: match[2],
		}),
	}))
)

const routeModuleKind = (path: string) => (
	path.endsWith('/+page.svelte') ?
		'page-svelte'
	: path.endsWith('/+page.ts') ?
		'page-load'
	: path.endsWith('/+layout.svelte') ?
		'layout-svelte'
	: path.endsWith('/+layout.ts') ?
		'layout-load'
	:
		'other'
)

const routeLoaderTransformFacts = (
	file: WitnessFile,
	content: string,
	routePath: string
) => {
	const entityMatch = content.match(/import EntitySchema from '\$\/schema\/([A-Za-z0-9_]+)\.ts'/)
	const parseIndex = content.indexOf('parseEntitySelector(')
	const callText = parseIndex === -1 ? undefined : balancedSlice(content, parseIndex + 'parseEntitySelector'.length, '(', ')')

	if (entityMatch === null || callText === undefined)
		return []

	const selectorExpression = splitTopLevel(callText.slice(1, -1), ',')[2]

	if (selectorExpression === undefined)
		return []

	const params = [
		...new Set([...selectorExpression.matchAll(/\bparams\.([A-Za-z0-9_]+)/g)].map((match) => match[1] ?? '')),
	].filter(Boolean)
	const importedSymbols = [
		...new Set([...content.matchAll(/^import \{ ([^}]+) \} from '([^']+)'/gm)]
			.flatMap((match) => (match[1] ?? '')
				.split(',')
				.map((symbol) => symbol.trim().replace(/^type\s+/, ''))
				.filter(Boolean)
				.map((symbol) => ({
					symbol,
					source: match[2] ?? '',
				})))
			.filter((imported) => new RegExp(`(?<![\\w$])${imported.symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w$])`).test(selectorExpression))
			.map((imported) => `${imported.symbol}:${imported.source}`)),
	]
	const selectorFields = [
		...selectorExpression.matchAll(/\n\s*['"]?([A-Za-z_$][\w$]*)['"]?:/g),
	].map((match) => match[1] ?? '').filter((field) => !params.includes(field))

	return [
		fact(file, 'route.loader-selector-transform', `${file.path}:${entityMatch[1]}`, {
			entity: entityMatch[1],
			routePath,
			visiblePath: routeVisiblePath(routePath),
			params,
			selectorFields,
			importedSymbols,
			selectorExpression,
			simpleDirectParamShape: selectorFields.every((field) => (
				selectorExpression.includes(`${field}: decodeURIComponent(params.${field})`)
				|| selectorExpression.includes(`${field}: Number(params.${field})`)
				|| selectorExpression.includes(`${field}: caip2ParamValueFromString(params.${field})`)
				|| selectorExpression.includes(`${field}: caip2ParamValueFromString(decodeURIComponent(params.${field}))`)
			)),
		}, 'route-page-load-parse-entity-selector'),
	]
}

const routeSvelteShellValue = (
	content: string,
	routePath: string
) => {
	const imports = [
		...content.matchAll(/^import (.+?) from '([^']+)'/gm),
	].map((match) => ({
		imported: match[1] ?? '',
		source: match[2] ?? '',
	}))
	const components = [
		...new Set([...content.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g)].map((match) => match[1] ?? '')),
	].filter(Boolean)

	return {
		routePath,
		visiblePath: routeVisiblePath(routePath),
		routeGroupPath: routeGroupPath(routePath),
		params: routeParams(routePath),
		imports,
		components,
		usesDataSelector: content.includes('data.selector'),
		usesParams: content.includes('params.'),
		usesSelect: content.includes('select('),
		sourceText: content,
	}
}

const routePageShellFacts = (
	file: WitnessFile,
	content: string,
	routePath: string
) => [
	fact(file, 'route.page-shell', file.path, routeSvelteShellValue(content, routePath), 'route-page-shell-source'),
]

const routeSectionShellFacts = (
	file: WitnessFile,
	content: string,
	routePath: string
) => [
	fact(file, 'route.section-shell', file.path, routeSvelteShellValue(content, routePath), 'route-section-shell-source'),
]

const routePathFromFile = (path: string) => (
	path
		.replace(/^src\/routes_?\//, '')
		.replace(/(?:^|\/)\+(page|layout)\.(svelte|ts)$/, '')
)

const importRouteRegistry = async <_Registry>(path: string, exportName: string): Promise<_Registry[]> => {
	if (!walkFiles(path.split('/').slice(0, -1).join('/')).includes(path))
		return []

	const module = await import(`${pathToFileURL(`${process.cwd()}/${path}`).href}?t=${Date.now()}`) as Record<string, _Registry[] | undefined>

	return module[exportName] ?? []
}

const extractSchemaMarkdownFacts = (files: readonly WitnessFile[]) => {
	const file = files.find((file) => file.path === 'SCHEMA.md')

	if (!file)
		return []

	let currentEntity = ''

	return linesOf(file.path).flatMap((line, lineIndex) => {
		const entityMatch = line.match(/^  Entity (\S+)/)

		if (entityMatch) {
			currentEntity = entityMatch[1]

			return fact(file, 'schema.entity', currentEntity, {
				name: currentEntity,
			}, 'schema-markdown', lineIndex + 1)
		}

		if (!currentEntity)
			return []

		if (line.startsWith('    Selectors :: '))
			return splitTopLevel(line.slice('    Selectors :: '.length), ',').map((selector) => (
				fact(file, 'schema.selector', `${currentEntity}:${selector}`, {
					entity: currentEntity,
					...parseSchemaSelector(selector),
				}, 'schema-markdown', lineIndex + 1)
			))

		if (line.startsWith('    Fields :: '))
			return splitTopLevel(line.slice('    Fields :: '.length), ',').map((field) => (
				fact(file, 'schema.field', `${currentEntity}:${field}`, {
					entity: currentEntity,
					...parseSchemaField(field),
				}, 'schema-markdown', lineIndex + 1)
			))

		if (line.startsWith('    Label :: '))
			return fact(file, 'schema.label', `${currentEntity}:label`, {
				entity: currentEntity,
				label: line.slice('    Label :: '.length),
			}, 'schema-markdown', lineIndex + 1)

		if (line.startsWith('    LabelPlural :: '))
			return fact(file, 'schema.label-plural', `${currentEntity}:labelPlural`, {
				entity: currentEntity,
				labelPlural: line.slice('    LabelPlural :: '.length),
			}, 'schema-markdown', lineIndex + 1)

		if (line.startsWith('    Description :: '))
			return fact(file, 'schema.description', `${currentEntity}:description`, {
				entity: currentEntity,
				description: line.slice('    Description :: '.length),
			}, 'schema-markdown', lineIndex + 1)

		if (line.startsWith('    Notes :: '))
			return fact(file, 'schema.notes', `${currentEntity}:notes`, {
				entity: currentEntity,
				notes: line.slice('    Notes :: '.length),
			}, 'schema-markdown', lineIndex + 1)

		if (line.startsWith('    Field ')) {
			const fieldMetadataMatch = line.match(/^    Field ([^ ]+) :: (.+)$/)

			if (!fieldMetadataMatch)
				return []

			return fact(file, 'schema.field-metadata', `${currentEntity}:${fieldMetadataMatch[1]}:metadata`, {
				entity: currentEntity,
				field: fieldMetadataMatch[1],
				...parseSchemaMetadata(fieldMetadataMatch[2]),
			}, 'schema-markdown', lineIndex + 1)
		}

		if (line.startsWith('      - SourceBinding.'))
			return fact(file, 'schema.source-binding', `${currentEntity}:${line.trim()}`, {
				entity: currentEntity,
				sourceBinding: line.trim().replace(/^- SourceBinding\./, ''),
			}, 'schema-markdown', lineIndex + 1)

		if (line.startsWith('    View :: '))
			return fact(file, 'schema.view-row', `${currentEntity}:View`, {
				entity: currentEntity,
				view: line.slice('    View :: '.length),
			}, 'schema-markdown', lineIndex + 1)

		return []
	})
}

const extractSchemaFacts = (files: readonly WitnessFile[]) => (
	[
		...extractSchemaMarkdownFacts(files),
		...files
			.filter((file) => file.path.startsWith('src/schema/') || file.path.startsWith('src/schema_/'))
			.filter((file) => file.path.endsWith('.ts'))
			.filter((file) => !file.path.endsWith('.spec.ts') && !file.path.endsWith('.test.ts'))
			.flatMap((file) => {
				const entityName = file.path.split('/').at(-1)?.replace(/\.ts$/, '')
				const content = readText(file.path)

				return [
					fact(file, 'schema.file', file.path, {
						entityName,
					}, 'schema-file-path'),
					...extractSchemaEnums(content, entityName).map((enumeration) => (
						fact(file, 'schema.enum', `${entityName}:${enumeration.name}`, {
							entity: entityName,
							...enumeration,
						}, 'schema-active-enum-scan')
					)),
					...Array.from(content.matchAll(/name: [A-Za-z0-9_]+Selector\.([A-Za-z0-9_]+),\n\s+fields: \[\n([\s\S]*?)\n\s+\]/g)).map((selectorMatch) => {
						const member = selectorMatch[1]
						const fields = Array.from(selectorMatch[2].matchAll(/'([^']+)'/g)).map((fieldMatch) => fieldMatch[1])
						const enumValue = content.match(new RegExp(`\\n\\t${member} = '([^']+)',`))?.[1] ?? member

						return fact(file, 'schema.selector-member', `${entityName}:${fields.join('+')}:${member}`, {
							entity: entityName,
							fields,
							member,
							value: enumValue,
						}, 'schema-active-selector-scan')
					}),
					...linesOf(file.path).flatMap((line, lineIndex) => {
						const selectorMatch = line.match(/selectors:\s*\[/)
						const fieldMatch = line.match(/fields:\s*\[/)

						return [
							...(selectorMatch ? [
								fact(file, 'schema.selectors-block', `${file.path}:selectors`, {
									entityName,
								}, 'schema-source-scan', lineIndex + 1),
							] : []),
							...(fieldMatch ? [
								fact(file, 'schema.fields-block', `${file.path}:fields`, {
									entityName,
								}, 'schema-source-scan', lineIndex + 1),
							] : []),
						]
					}),
				]
			}),
	]
)

const extractViewFacts = (files: readonly WitnessFile[]) => (
	files
		.filter((file) => file.path.startsWith('src/views/') || file.path.startsWith('src/views_/') || file.path.startsWith('src/views__/'))
		.filter((file) => file.path.endsWith('.svelte') || file.path.endsWith('.ts'))
		.flatMap((file) => {
			const content = readText(file.path)
			const viewName = file.path.split('/').at(-1)?.replace(/\.(svelte|ts)$/, '')
			const entityMatch = viewName?.match(/^(.+?)(_Timestamps?|s)?View$/)
			const capabilities = [
				...(content.includes('ResourceBoundary') ? ['resource-boundary'] : []),
				...(content.includes('EntityView2') ? ['entity-view2'] : []),
				...(content.includes('EntitiesList') ? ['entities-list'] : []),
				...(content.includes('RefinableList') ? ['refinable-list'] : []),
				...(content.includes('ParentPageCollapsible') ? ['parent-page-collapsible'] : []),
				...(content.includes('Chart') || content.includes('chart') ? ['chart'] : []),
				...(content.includes('select(') ? ['entity-select'] : []),
				...(content.includes('useLiveQuery') ? ['live-query'] : []),
			]

			return [
				fact(file, file.path.endsWith('.svelte') ? 'view.svelte-file' : 'view.typescript-file', file.path, {
					name: file.path.split('/').at(-1),
					viewName,
					entity: entityMatch?.[1],
					kind: (
						viewName?.endsWith('TimestampsView') ?
							'timestamps'
						: viewName?.endsWith('TimestampView') ?
							'timestamp'
						: viewName?.endsWith('sView') ?
							'plural'
						:
							'singular'
					),
					capabilities,
				}, 'view-file-path'),
				...(file.path.startsWith('src/views/') && file.path.endsWith('.svelte') && viewName?.endsWith('View') ? [
					fact(file, 'view.entity-shell', file.path, {
						entity: viewName.slice(0, -'View'.length),
						viewName,
						file: file.path,
						capabilities,
						sourceText: content,
					}, 'view-entity-shell-source'),
				] : []),
				...capabilities.map((capability) => (
					fact(file, 'view.capability', `${file.path}:${capability}`, {
						viewName,
						entity: entityMatch?.[1],
						capability,
					}, 'view-capability-scan')
				)),
				...linesOf(file.path).flatMap((line, lineIndex) => {
					if (!line.includes('ResourceBoundary') && !line.includes('$/views') && !line.includes('views-new') && !line.includes('EntityView2') && !line.includes('EntitiesList') && !line.includes('RefinableList'))
						return []

					return fact(file, 'view.reference', `${file.path}:${lineIndex + 1}`, {
						text: line.trim(),
					}, 'view-source-scan', lineIndex + 1)
				}),
			]
		})
)

const extractRouteFacts = async (files: readonly WitnessFile[]) => {
	const selectorLeaves = await importRouteRegistry<EntitySelectorRouteLeaf>('src/routes/entity-selector-route-leaves.ts', 'entitySelectorRouteLeaves')
	const hubCollectionRoutes = await importRouteRegistry<EntityHubCollectionRoute>('src/routes/entity-hub-collection-routes.ts', 'entityHubCollectionRoutes')
	const selectorLeafFile = files.find((file) => file.path === 'src/routes/entity-selector-route-leaves.ts')
	const hubCollectionFile = files.find((file) => file.path === 'src/routes/entity-hub-collection-routes.ts')

	return [
		...files
			.filter((file) => file.path === 'ROUTE-DEFINITIONS.ts')
			.flatMap((file) => linesOf(file.path).flatMap((line, lineIndex) => {
				const enumMatch = line.match(/^export enum (Route[A-Za-z]+) \{/)
				const constMatch = line.match(/^export const (route[A-Za-z]+) =/)

				return [
					...(enumMatch ? [
						fact(file, 'route.enum', enumMatch[1], {
							name: enumMatch[1],
						}, 'route-definitions-scan', lineIndex + 1),
					] : []),
					...(constMatch ? [
						fact(file, 'route.registry', constMatch[1], {
							name: constMatch[1],
						}, 'route-definitions-scan', lineIndex + 1),
					] : []),
				]
			})),
		...files
			.filter((file) => file.path.startsWith('src/routes/') || file.path.startsWith('src/routes_/'))
			.filter((file) => file.path.endsWith('.svelte') || file.path.endsWith('.ts'))
			.flatMap((file) => {
				const routePath = routePathFromFile(file.path)
				const content = readText(file.path)

				return [
					fact(file, 'route.file', file.path, {
						routePath,
						visiblePath: routeVisiblePath(routePath),
						routeGroupPath: routeGroupPath(routePath),
						params: routeParams(routePath),
						moduleKind: routeModuleKind(file.path),
					}, 'route-file-path'),
					...(file.path.endsWith('/+page.svelte') ? routePageShellFacts(file, content, routePath) : []),
					...(file.path.endsWith('/+layout.svelte') ? routeSectionShellFacts(file, content, routePath) : []),
					...(file.path.endsWith('/+page.ts') ? routeLoaderTransformFacts(file, content, routePath) : []),
					...content.split('\n').flatMap((line, lineIndex) => {
						if (!line.includes('$/views') && !line.includes('views-new') && !line.includes('ParentPageCollapsible') && !line.includes('data.selector') && !line.includes('params.'))
							return []

						return fact(file, 'route.reference', `${file.path}:${lineIndex + 1}`, {
							text: line.trim(),
						}, 'route-source-scan', lineIndex + 1)
					}),
				]
			}),
		...(selectorLeafFile === undefined ? [] : selectorLeaves.flatMap((leaf) => [
			fact(selectorLeafFile, 'route.selector-leaf', `${leaf.entity}:${leaf.selector}:${leaf.path}`, {
				...leaf,
				visiblePath: routeVisiblePath(leaf.path),
				routeGroupPath: routeGroupPath(leaf.path),
				routeParams: routeParams(leaf.path),
			}, 'entity-selector-route-leaves'),
			fact(selectorLeafFile, 'route.selector-mapping', `${leaf.entity}:${leaf.selector}`, {
				entity: leaf.entity,
				selector: leaf.selector,
				fields: leaf.fields,
				parentFields: leaf.parentFields,
				localFields: leaf.localFields,
				path: leaf.path,
				visiblePath: routeVisiblePath(leaf.path),
				emitPage: leaf.emitPage ?? true,
				params: leaf.params,
				unresolved: leaf.unresolved,
			}, 'entity-selector-route-leaves'),
		])),
		...(hubCollectionFile === undefined ? [] : hubCollectionRoutes.map((route) => (
			fact(hubCollectionFile, 'route.hub-collection', `${route.entity}:${route.hub}:${route.path}`, {
				...route,
				visiblePath: routeVisiblePath(route.path),
				routeGroupPath: routeGroupPath(route.path),
				routeParams: routeParams(route.path),
			}, 'entity-hub-collection-routes')
		))),
	]
}

const extractSourceFacts = (files: readonly WitnessFile[]) => (
	files
		.filter((file) => file.path.startsWith('src/sources/') || file.path.startsWith('src/sources_/'))
		.flatMap((file) => [
			fact(file, 'source.file', file.path, {
				name: file.path.split('/').at(-1),
			}, 'source-file-path'),
			...linesOf(file.path).flatMap((line, lineIndex) => {
				const enumMemberMatch = line.match(/^\t([A-Za-z0-9_]+) = '([^']+)'/)

				if (!enumMemberMatch || !file.path.endsWith('Source.ts') && !file.path.endsWith('SourceProvider.ts') && !file.path.endsWith('SourceBinding.ts'))
					return []

				return fact(file, 'source.enum-member', `${file.path}:${enumMemberMatch[1]}`, {
					name: enumMemberMatch[1],
					value: enumMemberMatch[2],
				}, 'source-enum-scan', lineIndex + 1)
			}),
			...linesOf(file.path).flatMap((line, lineIndex) => {
				if (!line.includes('SourceProvider') && !line.includes('SourceBinding') && !line.includes('artifacts') && !line.includes('origins'))
					return []

				return fact(file, 'source.reference', `${file.path}:${lineIndex + 1}`, {
					text: line.trim(),
				}, 'source-source-scan', lineIndex + 1)
			}),
		])
)

const extractSourceRegistryFacts = async (files: readonly WitnessFile[]) => {
	const providerIndexFiles = files.filter((file) => /^src\/sources\/[^/]+\/index\.ts$/.test(file.path))
	const providerDefinitions = await Promise.all(
		providerIndexFiles.map(async (file) => ({
			file,
			definition: (await import(pathToFileURL(file.path).href)).default as {
				bindings: {
					provider: string
					source: string
					target: {
						kind: string
						key: string
					}
					endpoints: {
						endpointKind: string
						locator: string
						origin?: string
						corsEnabled?: boolean
					}[]
					wireProtocol: string
					apiFamily: string
					operationGroups: string[]
					delivery: string
					artifacts?: {
						kind: string
						path: string
						generated: boolean
					}[]
				}[]
			},
		}))
	)

	return providerDefinitions.flatMap(({ file, definition }) => (
		validateSourceBindings(definition.bindings).flatMap((binding, index) => [
			fact(file, 'source.binding-row', `${binding.source}:${binding.target.kind}:${binding.target.key}:${index}`, {
				provider: binding.provider,
				source: binding.source,
				targetKind: binding.target.kind,
				targetKey: binding.target.key,
				endpointCount: binding.endpoints.length,
				wireProtocol: binding.wireProtocol,
				apiFamily: binding.apiFamily,
				operationGroups: binding.operationGroups,
				delivery: binding.delivery,
				artifactCount: binding.artifacts?.length ?? 0,
			}, 'source-provider-registry'),
			...(binding.artifacts ?? []).map((artifact) => (
				fact(file, 'source.binding-artifact', `${binding.source}:${artifact.kind}:${artifact.path}`, {
					source: binding.source,
					kind: artifact.kind,
					path: artifact.path,
					generated: artifact.generated,
				}, 'source-provider-registry')
			)),
		])
	))
}

const extractResolverFacts = (files: readonly WitnessFile[]) => (
	files
		.filter((file) => file.path.startsWith('src/resolvers/') || file.path.startsWith('src/resolvers_/') || file.path === 'RESOLVER-COVERAGE.md')
		.flatMap((file) => {
			let pendingResolverSource = ''

			return [
				fact(file, 'resolver.file', file.path, {
					name: file.path.split('/').at(-1),
				}, 'resolver-file-path'),
				...linesOf(file.path).flatMap((line, lineIndex) => {
					const importMatch = line.match(/^import ([A-Za-z0-9_]+) from '\$\/resolvers\/([^']+)'/)

					if (!importMatch)
						return []

					return fact(file, 'resolver.registry-import', importMatch[1], {
						name: importMatch[1],
						module: importMatch[2],
					}, 'resolver-registry-scan', lineIndex + 1)
				}),
				...linesOf(file.path).flatMap((line, lineIndex) => {
					const coverageRowCells = line
						.split('|')
						.slice(1, -1)
						.map((cell) => cell.trim())
					const coverageSourceMatch = coverageRowCells[0]?.match(/^`([^`]+)`$/)

					if (!coverageSourceMatch || coverageRowCells.length !== 7)
						return []

					return fact(file, 'resolver.coverage-row', coverageSourceMatch[1], {
						source: coverageSourceMatch[1],
						status: coverageRowCells[1],
						providerBinding: coverageRowCells[2],
						resolverFile: coverageRowCells[3],
						sourceRuntimeArtifacts: coverageRowCells[4],
						schemaEntitiesTouched: coverageRowCells[5],
						actionValidationRisk: coverageRowCells[6],
					}, 'resolver-coverage-table', lineIndex + 1)
				}),
				...linesOf(file.path).flatMap((line, lineIndex) => {
					const sourceMatch = line.match(/defineResolver\(Source\.([A-Za-z0-9_]+)/)

					if (sourceMatch)
						pendingResolverSource = sourceMatch[1]

					const entityMatch = line.match(/entityType:\s*EntityType\.([A-Za-z0-9_]+)/)

					if (!entityMatch || pendingResolverSource === '')
						return []

					const resolverSource = pendingResolverSource
					pendingResolverSource = ''

					return fact(file, 'resolver.implemented-facet', `${resolverSource}:${entityMatch[1]}`, {
						source: resolverSource,
						entity: entityMatch[1],
						status: 'implemented',
					}, 'resolver-defineResolver-scan', lineIndex + 1)
				}),
				...linesOf(file.path).flatMap((line, lineIndex) => {
					if (!line.includes('implemented') && !line.includes('deferred') && !line.includes('defineResolver'))
						return []

					return fact(file, 'resolver.coverage-reference', `${file.path}:${lineIndex + 1}`, {
						text: line.trim(),
					}, 'resolver-source-scan', lineIndex + 1)
				}),
			]
		})
)

const extractInvariantFacts = (files: readonly WitnessFile[]) => (
	files
		.filter((file) => file.path === 'AGENTS.md' || file.path === 'APP-PLAN.md' || file.path === 'package.json' || file.path.startsWith('tests/'))
		.flatMap((file) => linesOf(file.path).flatMap((line, lineIndex) => {
			if (!line.includes('must') && !line.includes('never') && !line.includes('Done when') && !line.includes('script'))
				return []

			return fact(file, 'invariant.statement', `${file.path}:${lineIndex + 1}`, {
				text: line.trim(),
			}, 'invariant-line-scan', lineIndex + 1)
		}))
)

const extractTestFacts = (files: readonly WitnessFile[]) => (
	files
		.filter((file) => file.path.startsWith('tests/') || file.path.startsWith('src/routes/'))
		.filter((file) => file.path.endsWith('.e2e.ts') || file.path.endsWith('.spec.ts') || file.path.endsWith('.test.ts') || file.path.includes('_routeParamFixtures'))
		.flatMap((file) => [
			fact(file, 'test.file', file.path, {
				name: file.path.split('/').at(-1),
				kind: (
					file.path.endsWith('.e2e.ts') ?
						'e2e'
					: file.path.includes('_routeParamFixtures') ?
						'route-fixture'
					:
						'unit'
				),
			}, 'test-file-path'),
			...linesOf(file.path).flatMap((line, lineIndex) => {
				if (!line.includes('E2E_PROBE_PATH') && !line.includes('E2E_ROUTE_VARIANTS') && !line.includes('routeParam') && !line.includes('ResourceBoundary') && !line.includes('cors') && !line.includes('assertMainSettled'))
					return []

				const probePathMatch = line.match(/E2E_PROBE_PATH=([^ \n]+)/)

				return [
					fact(file, 'test.probe-reference', `${file.path}:${lineIndex + 1}`, {
						text: line.trim(),
					}, 'test-source-scan', lineIndex + 1),
					...(probePathMatch ? [
						fact(file, 'test.probe-path', `${file.path}:${probePathMatch[1]}`, {
							path: probePathMatch[1],
							suite: (
								file.path.includes('boundary') ?
									'boundary'
								: file.path.includes('cors') ?
									'cors'
								:
									'route'
							),
						}, 'test-probe-path-scan', lineIndex + 1),
					] : []),
				]
			}),
		])
)

export const extract = async () => {
	const files = inventoryWitnesses()
	const schemaFacts = extractSchemaFacts(files)
	const viewFacts = extractViewFacts(files)
	const routeFacts = await extractRouteFacts(files)
	const sourceFacts = [
		...extractSourceFacts(files),
		...await extractSourceRegistryFacts(files),
	]
	const resolverFacts = extractResolverFacts(files)
	const invariantFacts = extractInvariantFacts(files)
	const testFacts = extractTestFacts(files)

	writeJsonl('.generated/extracted/files.jsonl', files)
	writeJsonl('.generated/extracted/schema-facts.jsonl', schemaFacts)
	writeJsonl('.generated/extracted/view-facts.jsonl', viewFacts)
	writeJsonl('.generated/extracted/route-facts.jsonl', routeFacts)
	writeJsonl('.generated/extracted/source-facts.jsonl', sourceFacts)
	writeJsonl('.generated/extracted/resolver-facts.jsonl', resolverFacts)
	writeJsonl('.generated/extracted/invariant-facts.jsonl', invariantFacts)
	writeJsonl('.generated/extracted/test-facts.jsonl', testFacts)

	writeText('.generated/reports/extract.md', [
		'# Extraction Report',
		'',
		`Witness files: ${files.length}`,
		`Schema facts: ${schemaFacts.length}`,
		`View facts: ${viewFacts.length}`,
		`Route facts: ${routeFacts.length}`,
		`Source facts: ${sourceFacts.length}`,
		`Resolver facts: ${resolverFacts.length}`,
		`Invariant facts: ${invariantFacts.length}`,
		`Test facts: ${testFacts.length}`,
		'',
		'## File Roles',
		'',
		...Object.entries(roleCounts(files)).map(([role, count]) => `- ${role}: ${count}`),
	].join('\n'))

	console.log(`Extracted ${files.length} witness files and ${schemaFacts.length + viewFacts.length + routeFacts.length + sourceFacts.length + resolverFacts.length + invariantFacts.length + testFacts.length} facts`)
}
