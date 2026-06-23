import { existsSync } from 'node:fs'

import { extract } from './extract.ts'
import { readText, writeText } from './files.ts'

type SchemaFactValue =
	| {
		name: string
	}
	| {
		entity: string
		name: string
		fields: string[]
	}
	| {
		entity: string
		name: string
		cardinality: string
		typeText: string
	}
	| {
		entity: string
		sourceBinding: string
	}
	| {
		entity: string
		view: string
	}
	| {
		name: string
		value: string
	}
	| {
		source: string
		status: string
	}
	| {
		source: string
		entity: string
		status: string
	}
	| {
		entity: string
		label: string
	}
	| {
		entity: string
		labelPlural: string
	}
	| {
		entity: string
		description: string
	}
	| {
		entity: string
		notes: string
	}
	| {
		entity: string
		field: string
		label?: string
		labelPlural?: string
		description?: string
	}
	| {
		entity: string
		fields: string[]
		member: string
		value: string
	}
	| {
		entity: string
		name: string
		members: {
			name: string
			value: string
		}[]
	}

type SchemaFact = {
	kind: string
	value: SchemaFactValue
	sourceFile: string
	sourceRole: string
	sourceLine?: number
}

type AppEntity = {
	name: string
	label?: string
	labelPlural?: string
	description?: string
	notes?: string
	enums?: {
		name: string
		members: {
			name: string
			value: string
		}[]
	}[]
	selectors: {
		name: string
		fields: string[]
		member?: string
		value?: string
	}[]
	fields: {
		name: string
		type: string
		cardinality: string
		label?: string
		labelPlural?: string
		description?: string
	}[]
	sourceBindings: string[]
	view?: string
}

type AppSourceProvider = {
	id: string
	label: string
}

type AppSource = {
	id: string
	provider: string
	label: string
}

type AppSourceBinding = {
	id: string
	source: string
	target: string
}

type AppEntityView = {
	entity: string
	kind: 'singular' | 'plural'
	file: string
	ownership: 'generated' | 'hand-owned'
}

type AppRouteSection = {
	id: string
	path: string
}

type AppRoutePage = {
	id: string
	path: string
	ownership: 'generated' | 'hand-owned'
}

type AppResolverCoverage = {
	entity: string
	source: string
	status:
		| 'implemented'
		| 'no resolver'
		| 'deferred-schema'
		| 'deferred-runtime'
		| 'deferred-artifact'
}

const cardinalityBySchemaSuffix = new Map([
	['!', 'One'],
	['?', 'ZeroOrOne'],
	['*', 'Many'],
	['0', 'Zero'],
	['One', 'One'],
	['ZeroOrMany', 'ZeroOrMany'],
	['unknown', 'unknown'],
])

const readJsonl = <_Row>(path: string): _Row[] => {
	if (!existsSync(path))
		return []

	return readText(path)
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as _Row)
}

export const schemaFactsToEntities = (facts: readonly SchemaFact[]) => {
	const entityByName = new Map<string, AppEntity>()

	for (const fact of facts) {
		if (fact.sourceFile !== 'SCHEMA.md')
			continue

		if (fact.kind === 'schema.entity') {
			const { name } = fact.value as { name: string }

			entityByName.set(name, {
				name,
				enums: [],
				selectors: [],
				fields: [],
				sourceBindings: [],
			})
		}
	}

	for (const fact of facts) {
		if (fact.kind === 'schema.enum') {
			const value = fact.value as {
				entity: string
				name: string
				members: {
					name: string
					value: string
				}[]
			}

			if (fact.sourceFile === `src/schema/${value.entity}.ts`)
				(entityByName.get(value.entity)?.enums ?? []).push({
					name: value.name,
					members: value.members,
				})

			continue
		}

		if (fact.sourceFile !== 'SCHEMA.md')
			continue

		if (fact.kind === 'schema.selector') {
			const value = fact.value as {
				entity: string
				name: string
				fields: string[]
			}
			const memberFact = facts.find((candidate) => {
				if (candidate.kind !== 'schema.selector-member')
					return false

				const candidateValue = candidate.value as {
					entity: string
					fields: string[]
				}

				return (
					candidateValue.entity === value.entity
					&& candidateValue.fields.join('+') === value.fields.join('+')
					&& candidate.sourceFile === `src/schema/${value.entity}.ts`
				)
			})?.value as {
				member?: string
				value?: string
			} | undefined

			entityByName.get(value.entity)?.selectors.push({
				name: value.name,
				fields: value.fields,
				...(memberFact?.member === undefined ? {} : {
					member: memberFact.member,
				}),
				...(memberFact?.value === undefined ? {} : {
					value: memberFact.value,
				}),
			})
		}
		else if (fact.kind === 'schema.label') {
			const value = fact.value as {
				entity: string
				label: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.label = value.label
		}
		else if (fact.kind === 'schema.label-plural') {
			const value = fact.value as {
				entity: string
				labelPlural: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.labelPlural = value.labelPlural
		}
		else if (fact.kind === 'schema.description') {
			const value = fact.value as {
				entity: string
				description: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.description = value.description
		}
		else if (fact.kind === 'schema.notes') {
			const value = fact.value as {
				entity: string
				notes: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.notes = value.notes
		}
		else if (fact.kind === 'schema.field') {
			const value = fact.value as {
				entity: string
				name: string
				cardinality: string
				typeText: string
			}
			entityByName.get(value.entity)?.fields.push({
				name: value.name,
				type: value.typeText,
				cardinality: cardinalityBySchemaSuffix.get(value.cardinality) ?? value.cardinality,
			})
		}
		else if (fact.kind === 'schema.field-metadata') {
			const value = fact.value as {
				entity: string
				field: string
				label?: string
				labelPlural?: string
				description?: string
			}
			const field = entityByName.get(value.entity)?.fields.find((field) => field.name === value.field)

			if (field) {
				field.label = value.label
				field.labelPlural = value.labelPlural
				field.description = value.description
			}
		}
		else if (fact.kind === 'schema.source-binding') {
			const value = fact.value as {
				entity: string
				sourceBinding: string
			}
			entityByName.get(value.entity)?.sourceBindings.push(value.sourceBinding)
		}
		else if (fact.kind === 'schema.view-row') {
			const value = fact.value as {
				entity: string
				view: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.view = value.view
		}
	}

	return [...entityByName.values()].map((entity) => ({
		name: entity.name,
		...(entity.label === undefined ? {} : {
			label: entity.label,
		}),
		...(entity.labelPlural === undefined ? {} : {
			labelPlural: entity.labelPlural,
		}),
		...(entity.description === undefined ? {} : {
			description: entity.description,
		}),
		...(entity.notes === undefined ? {} : {
			notes: entity.notes,
		}),
		...((entity.enums ?? []).length === 0 ? {} : {
			enums: entity.enums,
		}),
		selectors: entity.selectors.map((selector) => ({
			name: selector.name,
			fields: selector.fields,
			...(selector.member === undefined ? {} : {
				member: selector.member,
			}),
			...(selector.value === undefined ? {} : {
				value: selector.value,
			}),
		})),
		fields: entity.fields.map((field) => ({
			name: field.name,
			type: field.type,
			cardinality: field.cardinality,
			...(field.label === undefined ? {} : {
				label: field.label,
			}),
			...(field.labelPlural === undefined ? {} : {
				labelPlural: field.labelPlural,
			}),
			...(field.description === undefined ? {} : {
				description: field.description,
			}),
		})),
		sourceBindings: entity.sourceBindings,
		...(entity.view === undefined ? {} : {
			view: entity.view,
		}),
	}))
}

export const factsToSourceProviders = (facts: readonly SchemaFact[]): AppSourceProvider[] => (
	facts
		.filter((fact) => fact.kind === 'source.enum-member')
		.filter((fact) => fact.sourceFile === 'src/sources/SourceProvider.ts')
		.map((fact) => {
			const value = fact.value as {
				value: string
			}

			return {
				id: value.value,
				label: value.value,
			}
		})
)

export const factsToSources = (facts: readonly SchemaFact[]): AppSource[] => (
	facts
		.filter((fact) => fact.kind === 'source.enum-member')
		.filter((fact) => fact.sourceFile === 'src/sources/Source.ts')
		.map((fact) => {
			const value = fact.value as {
				value: string
			}

			return {
				id: value.value,
				provider: value.value.split('_')[0],
				label: value.value,
			}
		})
)

export const schemaFactsToSourceBindings = (facts: readonly SchemaFact[]): AppSourceBinding[] => (
	[...facts
		.filter((fact) => fact.kind === 'schema.source-binding')
		.reduce((bindingByIdAndTarget, fact) => {
			const value = fact.value as {
				entity: string
				sourceBinding: string
			}
			const key = `${value.sourceBinding}:${value.entity}`

			bindingByIdAndTarget.set(key, {
				id: value.sourceBinding,
				source: value.sourceBinding,
				target: value.entity,
			})

			return bindingByIdAndTarget
		}, new Map<string, AppSourceBinding>())
		.values()]
)

export const factsToEntityViews = (facts: readonly SchemaFact[]): AppEntityView[] => (
	[...facts
		.filter((fact) => fact.kind === 'schema.entity')
		.filter((fact) => fact.sourceFile === 'SCHEMA.md')
		.reduce((entityNames, fact) => {
			const value = fact.value as {
				name: string
			}

			entityNames.add(value.name)

			return entityNames
		}, new Set<string>())]
		.flatMap((entityName) => (
			facts
				.filter((fact) => fact.kind === 'view.svelte-file')
				.filter((fact) => fact.sourceFile === `src/views/${entityName}View.svelte`)
				.map((fact) => ({
					entity: entityName,
					kind: 'singular',
					file: fact.sourceFile,
					ownership: fact.sourceRole === 'active-generated' ? 'generated' : 'hand-owned',
				}))
		))
)

export const factsToRouteSections = (facts: readonly SchemaFact[]): AppRouteSection[] => (
	facts
		.filter((fact) => fact.kind === 'route.file')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.filter((fact) => fact.sourceFile.endsWith('/+layout.svelte'))
		.map((fact) => {
			const path = fact.sourceFile.replace(/^src\/routes\//, '').replace(/\/\+layout\.svelte$/, '')

			return {
				id: path || 'root',
				path,
			}
		})
)

export const factsToRoutePages = (facts: readonly SchemaFact[]): AppRoutePage[] => (
	facts
		.filter((fact) => fact.kind === 'route.file')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.filter((fact) => fact.sourceFile.endsWith('/+page.svelte'))
		.map((fact) => {
			const path = fact.sourceFile.replace(/^src\/routes\//, '').replace(/\/\+page\.svelte$/, '')

			return {
				id: path || 'root',
				path,
				ownership: fact.sourceRole === 'active-generated' ? 'generated' : 'hand-owned',
			}
		})
)

export const factsToResolverCoverage = (facts: readonly SchemaFact[]): AppResolverCoverage[] => {
	const implemented = facts
		.filter((fact) => fact.kind === 'resolver.implemented-facet')
		.map((fact) => {
			const value = fact.value as {
				source: string
				entity: string
			}

			return {
				entity: value.entity,
				source: value.source,
				status: 'implemented',
			} as const
		})
	const implementedSources = new Set(implemented.map((coverage) => coverage.source))
	const explicitNonImplemented = facts
		.filter((fact) => fact.kind === 'resolver.coverage-row')
		.map((fact) => fact.value as {
			source: string
			status: AppResolverCoverage['status']
		})
		.filter((coverage) => coverage.status !== 'implemented' || !implementedSources.has(coverage.source))
		.map((coverage) => ({
			entity: '*',
			source: coverage.source,
			status: coverage.status,
		}))

	return [
		...implemented,
		...explicitNonImplemented,
	]
}

const quote = (value: string) => (
	`'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
)

const serializeText = (value: string) => JSON.stringify(value)

const serializeStringArray = (values: readonly string[], indent: string) => {
	if (values.length === 0)
		return '[]'

	return [
		'[',
		...values.map((value) => `${indent}\t${quote(value)},`),
		`${indent}]`,
	].join('\n')
}

const serializeAppEntities = (entities: readonly AppEntity[]) => [
	'[',
	...entities.flatMap((entity) => [
		'\t\t\t{',
		`\t\t\t\tname: ${quote(entity.name)},`,
		...(entity.label === undefined ? [] : [
			`\t\t\t\tlabel: ${quote(entity.label)},`,
		]),
		...(entity.labelPlural === undefined ? [] : [
			`\t\t\t\tlabelPlural: ${quote(entity.labelPlural)},`,
		]),
		...(entity.description === undefined ? [] : [
			`\t\t\t\tdescription: ${quote(entity.description)},`,
		]),
		...(entity.notes === undefined ? [] : [
			`\t\t\t\tnotes: ${quote(entity.notes)},`,
		]),
		...((entity.enums ?? []).length === 0 ? [] : [
			'\t\t\t\tenums: [',
			...(entity.enums ?? []).flatMap((enumeration) => [
				'\t\t\t\t\t{',
				`\t\t\t\t\t\tname: ${quote(enumeration.name)},`,
				'\t\t\t\t\t\tmembers: [',
				...enumeration.members.flatMap((member) => [
					'\t\t\t\t\t\t\t{',
					`\t\t\t\t\t\t\t\tname: ${quote(member.name)},`,
					`\t\t\t\t\t\t\t\tvalue: ${quote(member.value)},`,
					'\t\t\t\t\t\t\t},',
				]),
				'\t\t\t\t\t\t],',
				'\t\t\t\t\t},',
			]),
			'\t\t\t\t],',
		]),
		'\t\t\t\tselectors: [',
		...entity.selectors.flatMap((selector) => [
			'\t\t\t\t\t{',
			`\t\t\t\t\t\tname: ${quote(selector.name)},`,
			`\t\t\t\t\t\tfields: ${serializeStringArray(selector.fields, '\t\t\t\t\t\t')},`,
			...(selector.member === undefined ? [] : [
				`\t\t\t\t\t\tmember: ${quote(selector.member)},`,
			]),
			...(selector.value === undefined ? [] : [
				`\t\t\t\t\t\tvalue: ${quote(selector.value)},`,
			]),
			'\t\t\t\t\t},',
		]),
		'\t\t\t\t],',
		'\t\t\t\tfields: [',
		...entity.fields.flatMap((field) => [
			'\t\t\t\t\t{',
			`\t\t\t\t\t\tname: ${quote(field.name)},`,
			`\t\t\t\t\t\ttype: ${quote(field.type)},`,
			`\t\t\t\t\t\tcardinality: ${quote(field.cardinality)},`,
			...(field.label === undefined ? [] : [
				`\t\t\t\t\t\tlabel: ${quote(field.label)},`,
			]),
			...(field.labelPlural === undefined ? [] : [
				`\t\t\t\t\t\tlabelPlural: ${quote(field.labelPlural)},`,
			]),
			...(field.description === undefined ? [] : [
				`\t\t\t\t\t\tdescription: ${quote(field.description)},`,
			]),
			'\t\t\t\t\t},',
		]),
		'\t\t\t\t],',
		`\t\t\t\tsourceBindings: ${serializeStringArray(entity.sourceBindings, '\t\t\t\t')},`,
		...(entity.view === undefined ? [] : [
			`\t\t\t\tview: ${quote(entity.view)},`,
		]),
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSourceProviders = (providers: readonly AppSourceProvider[]) => [
	'[',
	...providers.flatMap((provider) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(provider.id)},`,
		`\t\t\t\tlabel: ${quote(provider.label)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSources = (sources: readonly AppSource[]) => [
	'[',
	...sources.flatMap((source) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(source.id)},`,
		`\t\t\t\tprovider: ${quote(source.provider)},`,
		`\t\t\t\tlabel: ${quote(source.label)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSourceBindings = (bindings: readonly AppSourceBinding[]) => [
	'[',
	...bindings.flatMap((binding) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(binding.id)},`,
		`\t\t\t\tsource: ${quote(binding.source)},`,
		`\t\t\t\ttarget: ${quote(binding.target)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeEntityViews = (views: readonly AppEntityView[]) => [
	'[',
	...views.flatMap((view) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(view.entity)},`,
		`\t\t\t\tkind: ${quote(view.kind)},`,
		`\t\t\t\tfile: ${quote(view.file)},`,
		`\t\t\t\townership: ${quote(view.ownership)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRouteSections = (sections: readonly AppRouteSection[]) => [
	'[',
	...sections.flatMap((section) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(section.id)},`,
		`\t\t\t\tpath: ${quote(section.path)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRoutePages = (pages: readonly AppRoutePage[]) => [
	'[',
	...pages.flatMap((page) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(page.id)},`,
		`\t\t\t\tpath: ${quote(page.path)},`,
		`\t\t\t\townership: ${quote(page.ownership)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeResolverCoverage = (coverageRows: readonly AppResolverCoverage[]) => [
	'[',
	...coverageRows.flatMap((coverage) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(coverage.entity)},`,
		`\t\t\t\tsource: ${quote(coverage.source)},`,
		`\t\t\t\tstatus: ${quote(coverage.status)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const appTypesSource = `
export type App = {
\tdocs: {
\t\tresolverCoverageMarkdown: string
\t\tsourcesMarkdown: string
\t}
\tschema: {
\t\tentities: AppSchemaEntity[]
\t}
\tsources: {
\t\tproviders: AppSourceProvider[]
\t\tsources: AppSource[]
\t\tbindings: AppSourceBinding[]
\t}
\tresolvers: {
\t\tcoverage: AppResolverCoverage[]
\t}
\tviews: {
\t\trenderers: AppViewRenderer[]
\t\tentityViews: AppEntityView[]
\t}
\troutes: {
\t\tsections: AppRouteSection[]
\t\tpages: AppRoutePage[]
\t\taliases: AppRouteAlias[]
\t}
\tprobes: {
\t\troutes: AppRouteProbe[]
\t\tboundaries: AppBoundaryProbe[]
\t\tcors: AppCorsProbe[]
\t}
}

type AppSchemaEntity = {
\tname: string
\tlabel?: string
\tlabelPlural?: string
\tdescription?: string
\tnotes?: string
\tenums?: AppSchemaEnum[]
\tselectors: AppSchemaSelector[]
\tfields: AppSchemaField[]
\tsourceBindings: string[]
\tview?: string
}

type AppSchemaEnum = {
\tname: string
\tmembers: {
\t\tname: string
\t\tvalue: string
\t}[]
}

type AppSchemaSelector = {
\tname: string
\tfields: string[]
\tmember?: string
\tvalue?: string
}

type AppSchemaField = {
\tname: string
\ttype: string
\tcardinality: string
\tlabel?: string
\tlabelPlural?: string
\tdescription?: string
}

type AppSourceProvider = {
\tid: string
\tlabel: string
}

type AppSource = {
\tid: string
\tprovider: string
\tlabel: string
}

type AppSourceBinding = {
\tid: string
\tsource: string
\ttarget: string
}

type AppResolverCoverage = {
\tentity: string
\tsource: string
\tstatus:
\t\t| 'implemented'
\t\t| 'no resolver'
\t\t| 'deferred-schema'
\t\t| 'deferred-runtime'
\t\t| 'deferred-artifact'
}

type AppViewRenderer = {
\tid: string
\ttarget: string
}

type AppEntityView = {
\tentity: string
\tkind: 'singular' | 'plural'
\tfile: string
\townership: 'generated' | 'hand-owned'
}

type AppRouteSection = {
\tid: string
\tpath: string
}

type AppRoutePage = {
\tid: string
\tpath: string
\townership: 'generated' | 'hand-owned'
}

type AppRouteAlias = {
\tfrom: string
\tto: string
}

type AppRouteProbe = {
\tpath: string
}

type AppBoundaryProbe = {
\tpath: string
}

type AppCorsProbe = {
\tpath: string
}
`.trim()

export const assembleApp = async () => {
	await extract()

	const facts = [
		...readJsonl<SchemaFact>('.generated/extracted/schema-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/source-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/view-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/route-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/resolver-facts.jsonl'),
	]
	const entities = schemaFactsToEntities(facts)
	const providers = factsToSourceProviders(facts)
	const sources = factsToSources(facts)
	const bindings = schemaFactsToSourceBindings(facts)
	const entityViews = factsToEntityViews(facts)
	const routeSections = factsToRouteSections(facts)
	const routePages = factsToRoutePages(facts)
	const resolverCoverage = factsToResolverCoverage(facts)

	writeText('APP.ts', [
		'export const APP = {',
		'\tdocs: {',
		`\t\tresolverCoverageMarkdown: ${serializeText(readText('RESOLVER-COVERAGE.md'))},`,
		`\t\tsourcesMarkdown: ${serializeText(readText('SOURCES.md'))},`,
		'\t},',
		'',
		'\tschema: {',
		`\t\tentities: ${serializeAppEntities(entities)},`,
		'\t},',
		'',
		'\tsources: {',
		`\t\tproviders: ${serializeSourceProviders(providers)},`,
		`\t\tsources: ${serializeSources(sources)},`,
		`\t\tbindings: ${serializeSourceBindings(bindings)},`,
		'\t},',
		'',
		'\tresolvers: {',
		`\t\tcoverage: ${serializeResolverCoverage(resolverCoverage)},`,
		'\t},',
		'',
		'\tviews: {',
		'\t\trenderers: [],',
		`\t\tentityViews: ${serializeEntityViews(entityViews)},`,
		'\t},',
		'',
		'\troutes: {',
		`\t\tsections: ${serializeRouteSections(routeSections)},`,
		`\t\tpages: ${serializeRoutePages(routePages)},`,
		'\t\taliases: [],',
		'\t},',
		'',
		'\tprobes: {',
		'\t\troutes: [],',
		'\t\tboundaries: [],',
		'\t\tcors: [],',
		'\t},',
		'} as const satisfies App',
		'',
		appTypesSource,
	].join('\n'))

	console.log(`Assembled APP.ts with ${entities.length} schema entities, ${providers.length} source providers, ${sources.length} sources, ${bindings.length} schema source bindings, ${resolverCoverage.length} resolver coverage rows, ${entityViews.length} entity views, and ${routePages.length} route pages`)
}
