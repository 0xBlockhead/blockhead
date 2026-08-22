import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { matchesGlob } from 'node:path'

import {
	mainPlaywrightTestIgnore,
	mainPlaywrightTestMatch,
	vitestClientExclude,
	vitestClientInclude,
	vitestServerExclude,
	vitestServerInclude,
	walletPlaywrightTestDir,
	walletPlaywrightTestIgnore,
	walletPlaywrightTestMatch,
} from '../../test-discovery.config.mjs'

const testFilePattern = /\.(?:test|spec|e2e)\.(?:[cm]?[jt]sx?)$/
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

export const buildDiscoveryAuthority = ({
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
	) && !matchesAny(pathname, walletExtensionsPlaywrightConfig.testIgnore)

	const proofOwners = [
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
			matches: mainPlaywright,
		},
		{
			id: 'playwright-wallet-observations',
			lane: 'observation',
			matches: walletPlaywright,
		},
	]
	return {
		proofOwners,
		observationMatchers: [walletPlaywright],
	}
}

export const buildProofOwners = (inputs) => buildDiscoveryAuthority(inputs).proofOwners

export const inspectDiscovery = ({ pathnames, proofOwners, observationMatchers = [] }) => {
	const entries = pathnames.map((pathname) => {
		const owners = proofOwners.filter(({ matches }) => matches(pathname))
		const lane = observationMatchers.some((matches) => matches(pathname)) ? 'observation' : 'acceptance'
		return {
			pathname,
			lane,
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
				{ test: { name: 'client', include: vitestClientInclude, exclude: vitestClientExclude } },
				{ test: { name: 'server', include: vitestServerInclude, exclude: vitestServerExclude } },
			],
		},
	}
	const playwrightConfig = {
		testMatch: mainPlaywrightTestMatch,
		testIgnore: mainPlaywrightTestIgnore,
	}
	const walletExtensionsPlaywrightConfig = {
		testDir: walletPlaywrightTestDir,
		testMatch: walletPlaywrightTestMatch,
		testIgnore: walletPlaywrightTestIgnore,
	}
	const authority = buildDiscoveryAuthority({ viteConfig, playwrightConfig, walletExtensionsPlaywrightConfig })
	const inventory = inspectDiscovery({
		pathnames: readTrackedTestPathnames(root),
		proofOwners: authority.proofOwners,
		observationMatchers: authority.observationMatchers,
	})
	assertDiscoveryContract(inventory)
	console.log(JSON.stringify({
		counts: inventory.counts,
		undiscovered: inventory.undiscovered,
		duplicated: inventory.duplicated,
		promotedObservations: inventory.promotedObservations,
	}))
}
