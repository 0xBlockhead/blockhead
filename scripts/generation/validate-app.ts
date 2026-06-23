import { existsSync } from 'node:fs'

import {
	factsToEntityViews,
	factsToResolverCoverage,
	factsToRoutePages,
	factsToRouteSections,
	factsToSourceProviders,
	factsToSources,
	schemaFactsToEntities,
	schemaFactsToSourceBindings,
} from './assemble-app.ts'
import { readText, writeText } from './files.ts'
import { loadApp } from './load-app.ts'

type SchemaFact = Parameters<typeof schemaFactsToEntities>[0][number]

const readJsonl = <_Row>(path: string): _Row[] => {
	if (!existsSync(path))
		return []

	return readText(path)
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as _Row)
}

export const validateApp = async () => {
	const app = loadApp()
	const facts = [
		...readJsonl<SchemaFact>('.generated/extracted/schema-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/source-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/view-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/route-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/resolver-facts.jsonl'),
	]
	const expectedEntities = schemaFactsToEntities(facts)
	const expectedProviders = factsToSourceProviders(facts)
	const expectedSources = factsToSources(facts)
	const expectedBindings = schemaFactsToSourceBindings(facts)
	const expectedEntityViews = factsToEntityViews(facts)
	const expectedRouteSections = factsToRouteSections(facts)
	const expectedRoutePages = factsToRoutePages(facts)
	const expectedResolverCoverage = factsToResolverCoverage(facts)
	const actualEntities = app.schema.entities
	const schemaMatches = JSON.stringify(actualEntities) === JSON.stringify(expectedEntities)
	const providersMatch = JSON.stringify(app.sources.providers) === JSON.stringify(expectedProviders)
	const sourcesMatch = JSON.stringify(app.sources.sources) === JSON.stringify(expectedSources)
	const bindingsMatch = JSON.stringify(app.sources.bindings) === JSON.stringify(expectedBindings)
	const entityViewsMatch = JSON.stringify(app.views.entityViews) === JSON.stringify(expectedEntityViews)
	const routeSectionsMatch = JSON.stringify(app.routes.sections) === JSON.stringify(expectedRouteSections)
	const routePagesMatch = JSON.stringify(app.routes.pages) === JSON.stringify(expectedRoutePages)
	const resolverCoverageMatch = JSON.stringify(app.resolvers.coverage) === JSON.stringify(expectedResolverCoverage)

	writeText('.generated/reports/app-validation.md', [
		'# APP Validation',
		'',
		`Expected schema entities: ${expectedEntities.length}`,
		`Actual schema entities: ${actualEntities.length}`,
		`Schema matches extracted evidence: ${schemaMatches ? 'yes' : 'no'}`,
		`Expected source providers: ${expectedProviders.length}`,
		`Actual source providers: ${app.sources.providers.length}`,
		`Source providers match extracted evidence: ${providersMatch ? 'yes' : 'no'}`,
		`Expected sources: ${expectedSources.length}`,
		`Actual sources: ${app.sources.sources.length}`,
		`Sources match extracted evidence: ${sourcesMatch ? 'yes' : 'no'}`,
		`Expected schema source bindings: ${expectedBindings.length}`,
		`Actual schema source bindings: ${app.sources.bindings.length}`,
		`Schema source bindings match extracted evidence: ${bindingsMatch ? 'yes' : 'no'}`,
		`Expected entity views: ${expectedEntityViews.length}`,
		`Actual entity views: ${app.views.entityViews.length}`,
		`Entity views match extracted evidence: ${entityViewsMatch ? 'yes' : 'no'}`,
		`Expected route sections: ${expectedRouteSections.length}`,
		`Actual route sections: ${app.routes.sections.length}`,
		`Route sections match extracted evidence: ${routeSectionsMatch ? 'yes' : 'no'}`,
		`Expected route pages: ${expectedRoutePages.length}`,
		`Actual route pages: ${app.routes.pages.length}`,
		`Route pages match extracted evidence: ${routePagesMatch ? 'yes' : 'no'}`,
		`Expected resolver coverage rows: ${expectedResolverCoverage.length}`,
		`Actual resolver coverage rows: ${app.resolvers.coverage.length}`,
		`Resolver coverage matches extracted evidence: ${resolverCoverageMatch ? 'yes' : 'no'}`,
	].join('\n'))

	if (!schemaMatches)
		throw new Error('APP.ts schema does not match extracted schema evidence')

	if (!providersMatch)
		throw new Error('APP.ts source providers do not match extracted source provider evidence')

	if (!sourcesMatch)
		throw new Error('APP.ts sources do not match extracted source evidence')

	if (!bindingsMatch)
		throw new Error('APP.ts schema source bindings do not match extracted schema source binding evidence')

	if (!entityViewsMatch)
		throw new Error('APP.ts entity views do not match extracted view evidence')

	if (!routeSectionsMatch)
		throw new Error('APP.ts route sections do not match extracted route section evidence')

	if (!routePagesMatch)
		throw new Error('APP.ts route pages do not match extracted route page evidence')

	if (!resolverCoverageMatch)
		throw new Error('APP.ts resolver coverage does not match extracted resolver evidence')

	console.log(`APP validation passed: ${actualEntities.length} schema entities`)
}
