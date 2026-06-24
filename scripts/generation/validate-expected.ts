import { existsSync } from 'node:fs'

import { readText, writeText } from './files.ts'
import { loadApp } from './load-app.ts'

const expectedFiles = [
	'.generated/expected/APP.snapshot.json',
	'.generated/expected/SCHEMA.md',
	'.generated/expected/RESOLVER-COVERAGE.md',
	'.generated/expected/SOURCES.md',
	'.generated/expected/src/schema/schema.json',
	'.generated/expected/src/sources/sources.json',
	'.generated/expected/src/resolvers/resolvers.json',
	'.generated/expected/src/views/views.json',
	'.generated/expected/src/routes/routes.json',
	'.generated/expected/src/routes/entity-selector-route-leaves.ts',
	'.generated/expected/src/routes/entity-hub-collection-routes.ts',
	'.generated/expected/tests/probes.json',
	'.generated/expected/ownership.json',
	'.generated/expected/ownership-summary.json',
] as const

const readJson = <_Value>(path: string): _Value => (
	JSON.parse(readText(path)) as _Value
)

export const validateExpected = async () => {
	const app = loadApp()
	const missingFiles = expectedFiles.filter((file) => !existsSync(file))
	const schema = readJson<typeof app.schema>('.generated/expected/src/schema/schema.json')
	const sources = readJson<typeof app.sources>('.generated/expected/src/sources/sources.json')
	const resolvers = readJson<typeof app.resolvers>('.generated/expected/src/resolvers/resolvers.json')
	const views = readJson<typeof app.views>('.generated/expected/src/views/views.json')
	const routes = readJson<typeof app.routes>('.generated/expected/src/routes/routes.json')
	const probes = readJson<typeof app.probes>('.generated/expected/tests/probes.json')
	const ownership = readJson<{ activePath: string }[]>('.generated/expected/ownership.json')
	const ownershipSummary = readJson<{
		total: number
		generated: number
		handOwned: number
		remainingHandOwnedGeneratedSurface: {
			views: number
			routes: number
			routeSections: number
		}
	}>('.generated/expected/ownership-summary.json')
	const mismatches = [
		...(JSON.stringify(schema) === JSON.stringify(app.schema) ? [] : ['schema manifest content']),
		...(JSON.stringify(sources) === JSON.stringify(app.sources) ? [] : ['sources manifest content']),
		...(JSON.stringify(resolvers) === JSON.stringify(app.resolvers) ? [] : ['resolvers manifest content']),
		...(JSON.stringify(views) === JSON.stringify(app.views) ? [] : ['views manifest content']),
		...(JSON.stringify(routes) === JSON.stringify(app.routes) ? [] : ['routes manifest content']),
		...(JSON.stringify(probes) === JSON.stringify(app.probes) ? [] : ['probes manifest content']),
		...(schema.entities.length === app.schema.entities.length ? [] : ['schema entity count']),
		...(sources.providers.length === app.sources.providers.length ? [] : ['source provider count']),
		...(sources.sources.length === app.sources.sources.length ? [] : ['source count']),
		...(sources.bindings.length === app.sources.bindings.length ? [] : ['source binding count']),
		...(sources.runtimeBindings.length === app.sources.runtimeBindings.length ? [] : ['runtime source binding count']),
		...(sources.runtimeArtifacts.length === app.sources.runtimeArtifacts.length ? [] : ['runtime source artifact count']),
		...(resolvers.coverage.length === app.resolvers.coverage.length ? [] : ['resolver coverage count']),
		...(views.entityViews.length === app.views.entityViews.length ? [] : ['entity view count']),
		...(routes.sections.length === app.routes.sections.length ? [] : ['route section count']),
		...(routes.pages.length === app.routes.pages.length ? [] : ['route page count']),
		...(probes.routes.length === app.probes.routes.length ? [] : ['route probe count']),
		...(probes.boundaries.length === app.probes.boundaries.length ? [] : ['boundary probe count']),
		...(probes.cors.length === app.probes.cors.length ? [] : ['cors probe count']),
		...(ownership.length > 0 ? [] : ['ownership rows']),
		...(ownershipSummary.total === ownership.length ? [] : ['ownership summary total']),
		...(ownershipSummary.generated + ownershipSummary.handOwned === ownership.length ? [] : ['ownership summary partition']),
	]

	writeText('.generated/reports/expected-validation.md', [
		'# Expected Output Validation',
		'',
		`Expected files: ${expectedFiles.length}`,
		`Missing files: ${missingFiles.length}`,
		`Round-trip count mismatches: ${mismatches.length}`,
		`Generated-owned rows: ${ownershipSummary.generated}`,
		`Hand-owned rows preserved: ${ownershipSummary.handOwned}`,
		`Hand-owned entity views remaining: ${ownershipSummary.remainingHandOwnedGeneratedSurface.views}`,
		`Hand-owned route pages remaining: ${ownershipSummary.remainingHandOwnedGeneratedSurface.routes}`,
		`Hand-owned route sections remaining: ${ownershipSummary.remainingHandOwnedGeneratedSurface.routeSections}`,
		'',
		'## Missing Files',
		'',
		...(missingFiles.length === 0 ? ['None'] : missingFiles.map((file) => `- ${file}`)),
		'',
		'## Mismatches',
		'',
		...(mismatches.length === 0 ? ['None'] : mismatches.map((mismatch) => `- ${mismatch}`)),
	].join('\n'))

	if (missingFiles.length > 0)
		throw new Error(`Expected output is missing files: ${missingFiles.join(', ')}`)

	if (mismatches.length > 0)
		throw new Error(`Expected output does not match APP counts: ${mismatches.join(', ')}`)

	console.log(`Expected output validation passed: ${expectedFiles.length} files`)
}
