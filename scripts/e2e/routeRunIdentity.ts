import { createHash, randomUUID } from 'node:crypto'
import { readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export const routeRunIdentityVersion = 2
export const preservedRouteRunIdentityVersion = 1
export const writerLockFileName = '.route-run-writer.lock'

export type RouteRunIdentity = {
	version: typeof routeRunIdentityVersion
	runId: string
	commit: string
	dirtyTreeFingerprint: string
	appGeneratedRouteFingerprint: string
	fixtureMetadataFingerprint: string
	corpusVersion: string
	captureContractVersion: string
	classifierVersion: string
	buildIdentity: string
	browserIdentity: string
	captureConfigFingerprint: string
	attemptCohort: string
	artifactRoot: string
}

export type PreservedRouteRunIdentity = {
	version: typeof preservedRouteRunIdentityVersion
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
	runIdentity?: RouteRunIdentity
	[key: string]: unknown
}

export type RouteReport = {
	runIdentity: RouteRunIdentity
	corpusFingerprint: string
	resultSetFingerprint: string
	reports?: readonly RouteResult[]
	[key: string]: unknown
}

export type RouteCorpusArtifact = {
	runIdentity: RouteRunIdentity
	corpusFingerprint: string
	targets: readonly RouteCorpusTarget[]
}

export type RouteCheckpoint = {
	runIdentity: RouteRunIdentity
	corpusFingerprint: string
	results: readonly RouteResult[]
}

export type RouteMatrixArtifact = RouteReport & {
	reports: readonly RouteResult[]
}

export type RouteResultsArtifact = {
	runIdentity: RouteRunIdentity
	corpusFingerprint: string
	results: readonly RouteResult[]
}

const sha256 = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex')

/** Adapt the route matrix's discovered page targets without changing discovery ownership. */
export const routeCorpusTargetsFromPathnames = (pathnames: readonly string[]): RouteCorpusTarget[] => (
	[...pathnames].sort().map((pathname) => ({
		id: pathname,
		examples: [{ id: 'default', version: sha256(pathname) }],
	}))
)

export const routeResultFromReport = (
	report: { pathname: string } & Partial<RouteResult>,
	corpusTargets: readonly RouteCorpusTarget[],
	runIdentity?: RouteRunIdentity,
): RouteResult => {
	const target = corpusTargets.find(({ id }) => id === report.pathname)
	if (target == null)
		throw new Error(`route report references unknown corpus target: ${report.pathname}`)
	const example = target.examples[0]
	if (example == null)
		throw new Error(`route corpus target has no examples: ${report.pathname}`)
	return {
		...report,
		...(runIdentity == null ? {} : { runIdentity }),
		targetId: target.id,
		exampleId: example.id,
		exampleVersion: example.version,
	}
}

export const canonicalJson = (value: unknown): string => {
	if (value === null || typeof value !== 'object')
		return JSON.stringify(value) ?? 'undefined'

	if (Array.isArray(value))
		return `[${value.map(canonicalJson).join(',')}]`

	const entries: [string, unknown][] = Object.entries(value)
	return `{${entries
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
	artifactRoot = 'unbound',
	attemptCohort = 'all',
	captureConfigFingerprint = captureContractVersion,
}: {
	browserIdentity: string
	buildIdentity: string
	captureContractVersion: string
	classifierVersion: string
	corpusVersion: string
	repositoryDirectory: string
	artifactRoot?: string
	attemptCohort?: string
	captureConfigFingerprint?: string
}): Promise<RouteRunIdentity> => {
	const [commit, dirtyFingerprint] = await Promise.all([
		git(repositoryDirectory, 'rev-parse', 'HEAD'),
		dirtyTreeFingerprint(repositoryDirectory),
	])
	const identity: RouteRunIdentity = {
		version: routeRunIdentityVersion,
		runId: '',
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
		captureConfigFingerprint,
		attemptCohort,
		artifactRoot: resolve(artifactRoot),
	}
	return { ...identity, runId: `sha256:${sha256(canonicalJson(identity))}` }
}

/** Compatibility contract for preserved v1 attempt ledgers and historical manifests. */
export const historicalRouteRunId = ({ manifestSha256, commit, dirtyTreeFingerprint, runnerSha256 }: {
	manifestSha256: string
	commit: string
	dirtyTreeFingerprint: string
	runnerSha256: string
}) => `sha256:${sha256(`${manifestSha256}\u0000${commit}\u0000${dirtyTreeFingerprint}\u0000${runnerSha256}`)}`

export const acquireExclusiveWriterLock = async (artifactRoot: string) => {
	const lockPath = `${artifactRoot}${writerLockFileName}`
	const token = randomUUID()
	const lock = { pid: process.pid, hostname: process.env.HOSTNAME ?? 'unknown', token }
	for (;;) {
		try {
			await writeFile(lockPath, `${JSON.stringify(lock)}\n`, { flag: 'wx' })
			break
		}
		catch (error) {
			if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST')
				throw error
			const owner = JSON.parse(await readFile(lockPath, 'utf8')) as { pid?: number }
			let live = false
			if (typeof owner.pid === 'number') {
				try { process.kill(owner.pid, 0); live = true } catch (signalError) {
					if (signalError instanceof Error && 'code' in signalError && signalError.code === 'EPERM') live = true
				}
			}
			if (live)
				throw new Error(`controlled retry writer lock is active: ${lockPath}`)
			const reclaimPath = `${lockPath}.${token}.reclaim`
			try { await rename(lockPath, reclaimPath) }
			catch (reclaimError) {
				if (reclaimError instanceof Error && 'code' in reclaimError && reclaimError.code === 'ENOENT') continue
				throw reclaimError
			}
			await unlink(reclaimPath).catch((cleanupError) => {
				if (!(cleanupError instanceof Error) || !('code' in cleanupError) || cleanupError.code !== 'ENOENT') throw cleanupError
			})
		}
	}
	return async () => {
		try {
			const current = JSON.parse(await readFile(lockPath, 'utf8')) as { token?: string }
			if (current.token === token) await unlink(lockPath)
		} catch (error) {
			if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error
		}
	}
}

export const resultSetFingerprint = (results: readonly RouteResult[]) => sha256(
	canonicalJson([...results].sort((resultA, resultB) => (
		`${resultA.targetId}\u0000${resultA.exampleId}`.localeCompare(`${resultB.targetId}\u0000${resultB.exampleId}`)
	)))
)

export const corpusFingerprint = (corpusTargets: readonly RouteCorpusTarget[]) => sha256(
	canonicalJson([...corpusTargets].sort((targetA, targetB) => targetA.id.localeCompare(targetB.id)))
)

const identityFields = Object.keys({
	version: 0,
	runId: '',
	commit: '',
	dirtyTreeFingerprint: '',
	appGeneratedRouteFingerprint: '',
	fixtureMetadataFingerprint: '',
	corpusVersion: '',
	captureContractVersion: '',
	classifierVersion: '',
	buildIdentity: '',
	browserIdentity: '',
	captureConfigFingerprint: '',
	attemptCohort: '',
	artifactRoot: '',
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
	assertRouteCorpusTargetsCoherent(corpusTargets)
	const examplesByKey = new Map<string, string>(
		corpusTargets.flatMap((target) => target.examples.map((example) => [
			`${target.id}\u0000${example.id}`,
			example.version,
		] as const))
	)
	assertRouteResultEntriesCoherent({ corpusTargets, results })
	if (results.length !== examplesByKey.size)
		throw new Error(`result set is incomplete: expected ${examplesByKey.size} examples, received ${results.length}`)
}

export const assertRouteResultEntriesCoherent = ({
	corpusTargets,
	results,
}: {
	corpusTargets: readonly RouteCorpusTarget[]
	results: readonly RouteResult[]
}) => {
	assertRouteCorpusTargetsCoherent(corpusTargets)
	const examplesByKey = new Map<string, string>(
		corpusTargets.flatMap((target) => target.examples.map((example) => [
			`${target.id}\u0000${example.id}`,
			example.version,
		] as const))
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
}

const assertRouteCorpusTargetsCoherent = (corpusTargets: readonly RouteCorpusTarget[]) => {
	const targetIds = new Set<string>()
	for (const target of corpusTargets) {
		if (targetIds.has(target.id))
			throw new Error(`corpus contains duplicate target: ${target.id}`)
		targetIds.add(target.id)
		const exampleIds = new Set<string>()
		for (const example of target.examples) {
			if (exampleIds.has(example.id))
				throw new Error(`corpus target contains duplicate example: ${target.id}\u0000${example.id}`)
			exampleIds.add(example.id)
		}
	}
}

export const assertRouteCorpusArtifactCoherent = ({
	artifact,
	corpusTargets,
	runIdentity,
}: {
	artifact: RouteCorpusArtifact
	corpusTargets: readonly RouteCorpusTarget[]
	runIdentity: RouteRunIdentity
}) => {
	assertRunIdentityMatches(runIdentity, artifact.runIdentity, 'corpus')
	assertRouteCorpusTargetsCoherent(corpusTargets)
	assertRouteCorpusTargetsCoherent(artifact.targets)
	if (artifact.corpusFingerprint !== corpusFingerprint(corpusTargets))
		throw new Error('corpus has incoherent target versions')
	if (canonicalJson(artifact.targets) !== canonicalJson(corpusTargets))
		throw new Error('corpus artifact targets do not match the accepted corpus')
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
	if (artifact.corpusFingerprint !== corpusFingerprint(corpusTargets))
		throw new Error('results has incoherent corpus fingerprint')
	assertRouteResultsCoherent({
		corpusTargets,
		results: artifact.results,
		runIdentity,
	})
}

export const assertRouteCheckpointCoherent = ({
	checkpoint,
	corpusTargets,
	runIdentity,
}: {
	checkpoint: RouteCheckpoint
	corpusTargets: readonly RouteCorpusTarget[]
	runIdentity: RouteRunIdentity
}) => {
	assertRunIdentityMatches(runIdentity, checkpoint.runIdentity, 'checkpoint')
	if (checkpoint.corpusFingerprint !== corpusFingerprint(corpusTargets))
		throw new Error('checkpoint has incoherent corpus fingerprint')
	assertRouteResultEntriesCoherent({ corpusTargets, results: checkpoint.results })
}

export const assertRouteReportCoherent = ({
	acceptedResults,
	corpusTargets,
	report,
	runIdentity,
	reportName,
}: {
	acceptedResults: readonly RouteResult[]
	corpusTargets: readonly RouteCorpusTarget[]
	report: RouteReport
	runIdentity: RouteRunIdentity
	reportName: string
}) => {
	assertRunIdentityMatches(runIdentity, report.runIdentity, reportName)
	const expectedCorpusFingerprint = corpusFingerprint(corpusTargets)
	if (report.corpusFingerprint !== expectedCorpusFingerprint)
		throw new Error(`${reportName} has incoherent corpus fingerprint`)
	const expectedFingerprint = resultSetFingerprint(acceptedResults)
	if (report.resultSetFingerprint !== expectedFingerprint)
		throw new Error(`${reportName} was not derived from the accepted result set`)
	for (const result of report.reports ?? [])
		if (result.runIdentity != null)
			assertRunIdentityMatches(runIdentity, result.runIdentity, `${reportName} result`)
}
