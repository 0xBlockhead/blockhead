import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { matchesGlob } from 'node:path'

const testFilePattern = /\.(?:test|spec|e2e)\.(?:[cm]?[jt]sx?)$/
const observationPatterns = [
	'**/*live*.e2e.*',
	'**/*observations*.e2e.*',
	'**/*real-sources*.e2e.*',
	'**/provider-discovery.e2e.*',
	'**/real-wallets-required.e2e.*',
	'**/tests/e2e/wallet-extensions/*/*.e2e.*',
]
const isObservation = (pathname) => observationPatterns.some((pattern) => matchesGlob(pathname, pattern))
const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)))

const readTrackedTestPathnames = (root) => execFileSync(
	'git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }
)
	.split('\n')
	.filter((pathname) => testFilePattern.test(pathname))

const nodeTestPatterns = (scripts) => Object.values(scripts)
	.filter((script) => script.includes('--test '))
	.flatMap((script) => script.split(' --test ').slice(1))
	.flatMap((command) => command.split(/\s+(?:&&|\|\||;)/)[0].trim().split(/\s+/))
	.filter((pattern) => !pattern.startsWith('-'))

const matchesAny = (pathname, patterns) => patterns.some((pattern) => matchesGlob(pathname, pattern))

export const buildProofOwners = ({
	packageJson: manifest = packageJson,
	viteConfig,
	playwrightConfig,
	walletExtensionsPlaywrightConfig,
}) => {
	const viteProjects = viteConfig.test.projects.map(({ test: config }) => config)
	const nodePatterns = nodeTestPatterns(manifest.scripts)
	const mainPlaywright = (pathname) => (
		matchesGlob(pathname, playwrightConfig.testMatch)
		&& !matchesAny(pathname, playwrightConfig.testIgnore)
	)
	const walletPlaywright = (pathname) => matchesGlob(
		pathname,
		`${walletExtensionsPlaywrightConfig.testDir.replace('./', '')}/${walletExtensionsPlaywrightConfig.testMatch}`
	) && !mainPlaywright(pathname)

	return [
		{
			id: 'node-contracts',
			lane: 'acceptance',
			matches: (pathname) => matchesAny(pathname, nodePatterns),
		},
		...viteProjects.map((config) => ({
			id: `vitest-${config.name}`,
			lane: 'acceptance',
			matches: (pathname) => matchesAny(pathname, config.include)
				&& !matchesAny(pathname, config.exclude),
		})),
		{
			id: 'playwright-main',
			lane: 'acceptance',
			matches: (pathname) => mainPlaywright(pathname) && !isObservation(pathname),
		},
		{
			id: 'playwright-observations',
			lane: 'observation',
			matches: (pathname) => mainPlaywright(pathname) && isObservation(pathname),
		},
		{
			id: 'playwright-wallet-observations',
			lane: 'observation',
			matches: walletPlaywright,
		},
	]
}

export const inspectDiscovery = ({ pathnames, proofOwners }) => {
	const entries = pathnames.map((pathname) => {
		const owners = proofOwners.filter(({ matches }) => matches(pathname))
		return {
			pathname,
			lane: isObservation(pathname) ? 'observation' : 'acceptance',
			owners: owners.map(({ id, lane }) => ({ id, lane })),
		}
	})
	const undiscovered = entries.filter(({ owners }) => owners.length === 0).map(({ pathname }) => pathname)
	const duplicated = entries.filter(({ owners }) => owners.length > 1).map(({ pathname, owners }) => ({
		pathname,
		owners: owners.map(({ id }) => id),
	}))
	const promotedObservations = entries
		.filter(({ lane, owners }) => lane === 'observation' && owners.some(({ lane: ownerLane }) => ownerLane === 'acceptance'))
		.map(({ pathname, owners }) => ({ pathname, owners: owners.map(({ id }) => id) }))

	return {
		entries,
		undiscovered,
		duplicated,
		promotedObservations,
		counts: {
			total: entries.length,
			acceptance: entries.filter(({ lane }) => lane === 'acceptance').length,
			observation: entries.filter(({ lane }) => lane === 'observation').length,
			colocatedRoutes: entries.filter(({ pathname }) => pathname.startsWith('src/routes/')).length,
		},
	}
}

export const assertDiscoveryContract = (inventory) => {
	if (inventory.undiscovered.length || inventory.duplicated.length || inventory.promotedObservations.length)
		throw new Error(JSON.stringify({
			undiscovered: inventory.undiscovered,
			duplicated: inventory.duplicated,
			promotedObservations: inventory.promotedObservations,
		}, null, 2))
}

if (process.argv.includes('--report')) {
	const root = new URL('../..', import.meta.url)
	const viteConfig = {
		test: {
			projects: [
				{ test: { name: 'client', include: ['src/**/*.svelte.{test,spec}.{js,ts}'], exclude: ['src/lib/server/**', 'src/routes/demo/**'] } },
				{ test: { name: 'server', include: ['src/**/*.{test,spec}.{js,ts}'], exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/routes/demo/**'] } },
			],
		},
	}
	const playwrightConfig = {
		testMatch: '**/*.e2e.{ts,js}',
		testIgnore: [
			'**/.worktrees/**',
			'**/tests/e2e/wallet-extensions/*/*.e2e.ts',
			'**/tests/e2e/wallet-extensions/extension-loaded-smoke.e2e.ts',
			'**/tests/e2e/wallet-extensions/provider-discovery.e2e.ts',
			'**/tests/e2e/wallet-extensions/real-wallets-required.e2e.ts',
		],
	}
	const walletExtensionsPlaywrightConfig = {
		testDir: './tests/e2e/wallet-extensions',
		testMatch: '**/*.e2e.ts',
	}
	const inventory = inspectDiscovery({
		pathnames: readTrackedTestPathnames(root),
		proofOwners: buildProofOwners({ viteConfig, playwrightConfig, walletExtensionsPlaywrightConfig }),
	})
	assertDiscoveryContract(inventory)
	console.log(JSON.stringify(inventory.counts))
}
