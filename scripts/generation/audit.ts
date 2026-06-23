import { existsSync } from 'node:fs'

import { extract } from './extract.ts'
import { readText, writeJsonl, writeText } from './files.ts'
import { inventoryWitnesses, roleCounts } from './inventory.ts'
import {
	conceptRowsFromFacts,
	decisionRowsFromFacts,
	patternRowsFromFacts,
} from './normalize.ts'
import type { EvidenceFact } from './types.ts'

const readJsonl = <_Row>(path: string): _Row[] => {
	if (!existsSync(path))
		return []

	return readText(path)
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as _Row)
}

const appRuntimeBoundaryViolations = () => [
	...readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/'))
		.filter((file) => file.path.endsWith('.ts') || file.path.endsWith('.svelte') || file.path.endsWith('.js'))
		.flatMap((file) => readText(file.path).split('\n').flatMap((line, lineIndex) => {
			if (!/^\s*(import|export)\s/.test(line))
				return []

			if (!line.includes('APP.ts') && !line.includes('scripts/') && !line.includes('.generated') && !line.includes('src/schema_') && !line.includes('src/views_') && !line.includes('src/routes_') && !line.includes('src/sources_') && !line.includes('src/resolvers_'))
				return []

			return {
				path: file.path,
				line: lineIndex + 1,
				text: line.trim(),
			}
		})),
]

const appDefinitionBoundaryViolations = () => {
	if (!existsSync('APP.ts'))
		return [
			{
				path: 'APP.ts',
				line: 0,
				text: 'missing APP.ts',
			},
		]

	return readText('APP.ts').split('\n').flatMap((line, lineIndex) => {
		if (!/^\s*import\s/.test(line) && !/^\s*export\s.+\sfrom\s/.test(line))
			return []

		return {
			path: 'APP.ts',
			line: lineIndex + 1,
			text: line.trim(),
		}
	})
}

const thingsThingPatternViolations = () => (
	readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/routes/'))
		.filter((file) => /\/([a-z][a-z-]+)s\/\1(\/|$)/.test(file.path))
		.map((file) => ({
			path: file.path,
			line: 0,
			text: 'adjacent plural/singular route path segment',
		}))
)

export const audit = async () => {
	await extract()

	const files = inventoryWitnesses()
	const facts = [
		...readJsonl<EvidenceFact>('.generated/extracted/schema-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/view-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/route-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/source-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/resolver-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/invariant-facts.jsonl'),
	]
	const boundaryViolations = [
		...appDefinitionBoundaryViolations(),
		...appRuntimeBoundaryViolations(),
	]
	const routePatternViolations = thingsThingPatternViolations()
	const unknownFiles = files.filter((file) => file.role === 'unknown')
	const patternRows = patternRowsFromFacts(facts)
	const conceptRows = conceptRowsFromFacts(facts)
	const decisionRows = decisionRowsFromFacts(facts)

	writeJsonl('.generated/ledgers/schema.jsonl', facts.filter((fact) => fact.kind.startsWith('schema.')))
	writeJsonl('.generated/ledgers/views.jsonl', facts.filter((fact) => fact.kind.startsWith('view.')))
	writeJsonl('.generated/ledgers/routes.jsonl', facts.filter((fact) => fact.kind.startsWith('route.')))
	writeJsonl('.generated/ledgers/sources.jsonl', facts.filter((fact) => fact.kind.startsWith('source.')))
	writeJsonl('.generated/ledgers/resolvers.jsonl', facts.filter((fact) => fact.kind.startsWith('resolver.')))
	writeJsonl('.generated/ledgers/invariants.jsonl', facts.filter((fact) => fact.kind.startsWith('invariant.')))
	writeJsonl('.generated/ledgers/patterns.jsonl', patternRows)
	writeJsonl('.generated/ledgers/concepts.jsonl', conceptRows)
	writeJsonl('.generated/ledgers/decisions.jsonl', decisionRows)
	writeJsonl('.generated/ledgers/boundary-violations.jsonl', boundaryViolations)
	writeJsonl('.generated/ledgers/route-pattern-violations.jsonl', routePatternViolations)

	writeText('.generated/reports/inventory.md', [
		'# Inventory Report',
		'',
		...Object.entries(roleCounts(files)).map(([role, count]) => `- ${role}: ${count}`),
		'',
		'## Unknown Files',
		'',
		...(unknownFiles.length === 0 ? ['None'] : unknownFiles.map((file) => `- ${file.path}`)),
	].join('\n'))

	writeText('.generated/reports/audit.md', [
		'# APP Pipeline Audit',
		'',
		`Witness files: ${files.length}`,
		`Extracted facts: ${facts.length}`,
		`Pattern rows: ${patternRows.length}`,
		`Concept rows: ${conceptRows.length}`,
		`Decision rows: ${decisionRows.length}`,
		`Unknown files: ${unknownFiles.length}`,
		`Boundary violations: ${boundaryViolations.length}`,
		`Route pattern violations: ${routePatternViolations.length}`,
		'',
		'## Boundary Violations',
		'',
		...(boundaryViolations.length === 0 ? ['None'] : boundaryViolations.map((violation) => `- ${violation.path}:${violation.line} ${violation.text}`)),
		'',
		'## Route Pattern Violations',
		'',
		...(routePatternViolations.length === 0 ? ['None'] : routePatternViolations.map((violation) => `- ${violation.path}`)),
	].join('\n'))

	writeText('.generated/reports/patterns.md', [
		'# Pattern Families',
		'',
		...Object.entries(Object.groupBy(patternRows, (row) => row.family))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([family, rows]) => `- ${family}: ${rows?.length ?? 0}`),
	].join('\n'))

	writeText('.generated/reports/concepts.md', [
		'# Concepts',
		'',
		...conceptRows.slice(0, 500).map((concept) => `- ${concept.family}: ${concept.concept} (${concept.factCount} facts, ${concept.sourceFiles.length} files)`),
		...(conceptRows.length > 500 ? [`- ... ${conceptRows.length - 500} more concepts`] : []),
	].join('\n'))

	writeText('.generated/reports/decisions.md', [
		'# Provisional Decisions',
		'',
		...Object.entries(Object.groupBy(decisionRows, (row) => row.decision))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([decision, rows]) => `- ${decision}: ${rows?.length ?? 0}`),
	].join('\n'))

	if (unknownFiles.length > 0 || boundaryViolations.length > 0 || routePatternViolations.length > 0) {
		console.error(`Audit failed: ${unknownFiles.length} unknown files, ${boundaryViolations.length} boundary violations, ${routePatternViolations.length} route pattern violations`)
		process.exit(1)
	}

	console.log(`Audit passed: ${files.length} witness files, ${facts.length} facts`)
}
