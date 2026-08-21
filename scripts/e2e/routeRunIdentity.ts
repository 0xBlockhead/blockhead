import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export const routeRunIdentityVersion = 1

export type RouteRunIdentity = {
	version: typeof routeRunIdentityVersion
	commit: string
	dirtyTreeFingerprint: string
	appGeneratedRouteFingerprint: string
	fixtureMetadataFingerprint: string
	corpusVersion: string
	captureContractVersion: string
	classifierVersion: string
	buildIdentity: string
	browserIdentity: string
}

export type RouteCorpusTarget = {
	id: string
	examples: readonly {
		id: string
		version: string
	}[]
}

export type RouteResult = {
	targetId: string
	exampleId: string
	exampleVersion: string
	[key: string]: unknown
}

export type RouteReport = {
	runIdentity: RouteRunIdentity
	resultSetFingerprint: string
	[key: string]: unknown
}

export type RouteResultsArtifact = {
	runIdentity: RouteRunIdentity
	results: readonly RouteResult[]
}

const sha256 = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex')

const canonicalJson = (value: unknown): string => {
	if (value === null || typeof value !== 'object')
		return JSON.stringify(value) ?? 'undefined'

	if (Array.isArray(value))
		return `[${value.map(canonicalJson).join(',')}]`

	return `{${Object.entries(value)
		.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
		.map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`)
		.join(',')}}`
}

const git = async (repositoryDirectory: string, ...args: string[]) => (
	(await execFileAsync('git', args, { cwd: repositoryDirectory, maxBuffer: 32 * 1024 * 1024 })).stdout
)

const fingerprintFiles = async (
	repositoryDirectory: string,
	relativePaths: readonly string[]
) => sha256((await Promise.all([...relativePaths].sort().map(async (relativePath) => (
	`${relativePath}\u0000${sha256(await readFile(join(repositoryDirectory, relativePath)))}\n`
)))).join(''))

const dirtyTreeFingerprint = async (repositoryDirectory: string) => {
	const status = await git(repositoryDirectory, 'status', '--porcelain=v1', '-z')
	const diff = await git(repositoryDirectory, 'diff', 'HEAD', '--binary', '--', '.')
	const untracked = await git(repositoryDirectory, 'ls-files', '--others', '--exclude-standard', '-z')
	const untrackedFiles = await Promise.all(untracked.split('\u0000').filter(Boolean).sort().map(async (relativePath) => (
		`${relativePath}\u0000${sha256(await readFile(join(repositoryDirectory, relativePath)))}\n`
	)))
	return sha256(`${status}\u0000${diff}\u0000${untrackedFiles.join('')}`)
}

const generatedRoutePaths = async (repositoryDirectory: string) => (
	(await git(repositoryDirectory, 'ls-files', '-co', '--exclude-standard', '--', 'src/routes/**/+page.svelte'))
		.split('\n')
		.filter(Boolean)
)

export const createRouteRunIdentity = async ({
	browserIdentity,
	buildIdentity,
	captureContractVersion,
	classifierVersion,
	corpusVersion,
	repositoryDirectory,
}: {
	browserIdentity: string
	buildIdentity: string
	captureContractVersion: string
	classifierVersion: string
	corpusVersion: string
	repositoryDirectory: string
}): Promise<RouteRunIdentity> => {
	const [commit, dirtyFingerprint] = await Promise.all([
		git(repositoryDirectory, 'rev-parse', 'HEAD'),
		dirtyTreeFingerprint(repositoryDirectory),
	])
	return {
		version: routeRunIdentityVersion,
		commit: commit.trim(),
		dirtyTreeFingerprint: dirtyFingerprint,
		appGeneratedRouteFingerprint: await fingerprintFiles(repositoryDirectory, [
			'APP.ts',
			'tests/e2e/_generatedRouteFixtureMetadata.ts',
			'tests/e2e/_routeDiscovery.ts',
			...(await generatedRoutePaths(repositoryDirectory)),
		]),
		fixtureMetadataFingerprint: await fingerprintFiles(repositoryDirectory, [
			'tests/e2e/_generatedRouteFixtureMetadata.ts',
			'tests/e2e/_routeParamFixtures.ts',
		]),
		corpusVersion,
		captureContractVersion,
		classifierVersion,
		buildIdentity,
		browserIdentity,
	}
}

export const resultSetFingerprint = (results: readonly RouteResult[]) => sha256(
	canonicalJson([...results].sort((resultA, resultB) => (
		`${resultA.targetId}\u0000${resultA.exampleId}`.localeCompare(`${resultB.targetId}\u0000${resultB.exampleId}`)
	))),
)

const identityFields = Object.keys({
	version: 0,
	commit: '',
	dirtyTreeFingerprint: '',
	appGeneratedRouteFingerprint: '',
	fixtureMetadataFingerprint: '',
	corpusVersion: '',
	captureContractVersion: '',
	classifierVersion: '',
	buildIdentity: '',
	browserIdentity: '',
}) as (keyof RouteRunIdentity)[]

export const assertRunIdentityMatches = (
	expected: RouteRunIdentity,
	actual: RouteRunIdentity,
	artifactName: string
) => {
	const mismatches = identityFields.filter((field) => expected[field] !== actual[field])
	if (mismatches.length > 0)
		throw new Error(`${artifactName} has incoherent run identity: ${mismatches.join(', ')}`)
}

export const assertRouteResultsCoherent = ({
	corpusTargets,
	results,
}: {
	corpusTargets: readonly RouteCorpusTarget[]
	results: readonly RouteResult[]
	runIdentity: RouteRunIdentity
}) => {
	const examplesByKey = new Map<string, string>(
		corpusTargets.flatMap((target) => target.examples.map((example) => [
			`${target.id}\u0000${example.id}`,
			example.version,
		] as const)),
	)
	const seen = new Set<string>()
	for (const result of results) {
		const key = `${result.targetId}\u0000${result.exampleId}`
		const expectedVersion = examplesByKey.get(key)
		if (expectedVersion == null)
			throw new Error(`result references unknown corpus target/example: ${key}`)
		if (result.exampleVersion !== expectedVersion)
			throw new Error(`result references stale example version: ${key}`)
		if (seen.has(key))
			throw new Error(`result set evaluates corpus example more than once: ${key}`)
		seen.add(key)
	}
	if (seen.size !== examplesByKey.size)
		throw new Error(`result set is incomplete: expected ${examplesByKey.size} examples, received ${seen.size}`)
}

export const assertRouteResultsArtifactCoherent = ({
	artifact,
	corpusTargets,
	runIdentity,
}: {
	artifact: RouteResultsArtifact
	corpusTargets: readonly RouteCorpusTarget[]
	runIdentity: RouteRunIdentity
}) => {
	assertRunIdentityMatches(runIdentity, artifact.runIdentity, 'results')
	assertRouteResultsCoherent({
		corpusTargets,
		results: artifact.results,
		runIdentity,
	})
}

export const assertRouteReportCoherent = ({
	acceptedResults,
	report,
	runIdentity,
	reportName,
}: {
	acceptedResults: readonly RouteResult[]
	report: RouteReport
	runIdentity: RouteRunIdentity
	reportName: string
}) => {
	assertRunIdentityMatches(runIdentity, report.runIdentity, reportName)
	const expectedFingerprint = resultSetFingerprint(acceptedResults)
	if (report.resultSetFingerprint !== expectedFingerprint)
		throw new Error(`${reportName} was not derived from the accepted result set`)
}
