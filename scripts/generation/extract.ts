import { inventoryWitnesses, roleCounts } from './inventory.ts'
import { readText, walkFiles, writeJsonl, writeText } from './files.ts'
import type { EvidenceFact, WitnessFile } from './types.ts'

const linesOf = (path: string) => readText(path).split('\n')

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
		.flatMap((file) => [
			fact(file, file.path.endsWith('.svelte') ? 'view.svelte-file' : 'view.typescript-file', file.path, {
				name: file.path.split('/').at(-1),
			}, 'view-file-path'),
			...linesOf(file.path).flatMap((line, lineIndex) => {
				if (!line.includes('ResourceBoundary') && !line.includes('$/views') && !line.includes('views-new'))
					return []

				return fact(file, 'view.reference', `${file.path}:${lineIndex + 1}`, {
					text: line.trim(),
				}, 'view-source-scan', lineIndex + 1)
			}),
		])
)

const extractRouteFacts = (files: readonly WitnessFile[]) => (
	[
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
			.flatMap((file) => [
				fact(file, 'route.file', file.path, {
					routePath: file.path.replace(/^src\/routes_?\//, '').replace(/\/\+page\.(svelte|ts)$/, ''),
				}, 'route-file-path'),
				...linesOf(file.path).flatMap((line, lineIndex) => {
					if (!line.includes('$/views') && !line.includes('views-new') && !line.includes('ParentPageCollapsible'))
						return []

					return fact(file, 'route.reference', `${file.path}:${lineIndex + 1}`, {
						text: line.trim(),
					}, 'route-source-scan', lineIndex + 1)
				}),
			]),
	]
)

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
					const coverageRowMatch = line.match(/^\| `([^`]+)` \| ([^|]+) \|/)

					if (!coverageRowMatch)
						return []

					return fact(file, 'resolver.coverage-row', coverageRowMatch[1], {
						source: coverageRowMatch[1],
						status: coverageRowMatch[2].trim(),
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

export const extract = async () => {
	const files = inventoryWitnesses()
	const schemaFacts = extractSchemaFacts(files)
	const viewFacts = extractViewFacts(files)
	const routeFacts = extractRouteFacts(files)
	const sourceFacts = extractSourceFacts(files)
	const resolverFacts = extractResolverFacts(files)
	const invariantFacts = extractInvariantFacts(files)

	writeJsonl('.generated/extracted/files.jsonl', files)
	writeJsonl('.generated/extracted/schema-facts.jsonl', schemaFacts)
	writeJsonl('.generated/extracted/view-facts.jsonl', viewFacts)
	writeJsonl('.generated/extracted/route-facts.jsonl', routeFacts)
	writeJsonl('.generated/extracted/source-facts.jsonl', sourceFacts)
	writeJsonl('.generated/extracted/resolver-facts.jsonl', resolverFacts)
	writeJsonl('.generated/extracted/invariant-facts.jsonl', invariantFacts)
	writeJsonl('.generated/extracted/test-facts.jsonl', extractInvariantFacts(files.filter((file) => file.path.startsWith('tests/'))))

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
		'',
		'## File Roles',
		'',
		...Object.entries(roleCounts(files)).map(([role, count]) => `- ${role}: ${count}`),
	].join('\n'))

	console.log(`Extracted ${files.length} witness files and ${schemaFacts.length + viewFacts.length + routeFacts.length + sourceFacts.length + resolverFacts.length + invariantFacts.length} facts`)
}
