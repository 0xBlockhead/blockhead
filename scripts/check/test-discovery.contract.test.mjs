import assert from 'node:assert/strict'
import test from 'node:test'

import {
	buildDiscoveryAuthority,
	assertDiscoveryContract,
	inspectDiscovery,
} from './test-discovery.mjs'
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

const proofOwners = [{
	id: 'playwright-main',
	lane: 'acceptance',
	matches: (pathname) => pathname.endsWith('.e2e.ts') && !pathname.includes('provider-discovery'),
}, {
	id: 'node-contracts',
	lane: 'acceptance',
	matches: (pathname) => pathname.startsWith('scripts/check/'),
}]
const contract = (pathnames, owners = proofOwners) => inspectDiscovery({ pathnames, proofOwners: owners })

const configuredAuthority = buildDiscoveryAuthority({
	packageJson: { scripts: {} },
	viteConfig: {
		test: {
			projects: [
				{ test: { name: 'client', include: vitestClientInclude, exclude: vitestClientExclude } },
				{ test: { name: 'server', include: vitestServerInclude, exclude: vitestServerExclude } },
			],
		},
	},
	playwrightConfig: {
		testMatch: mainPlaywrightTestMatch,
		testIgnore: mainPlaywrightTestIgnore,
	},
	walletExtensionsPlaywrightConfig: {
		testDir: walletPlaywrightTestDir,
		testMatch: walletPlaywrightTestMatch,
		testIgnore: walletPlaywrightTestIgnore,
	},
})

const configuredContract = (pathnames) => inspectDiscovery({
	pathnames,
	proofOwners: configuredAuthority.proofOwners,
	observationMatchers: configuredAuthority.observationMatchers,
})

test('owns the complete current inventory, including colocated route suites', () => {
	const inventory = contract([
		'src/routes/root-navigation.e2e.ts',
		'tests/e2e/route-matrix.e2e.ts',
		'scripts/check/test-discovery.contract.test.mjs',
	])
	assertDiscoveryContract(inventory)
	assert.equal(inventory.counts.colocatedRoutes, 1)
})

test('assigns the isolated schema-selection type contract to one unit runner', () => {
	const inventory = configuredContract(['src/client/schema-selection-types.test.ts'])
	assertDiscoveryContract(inventory)
	assert.deepEqual(inventory.entries[0].owners, [{ id: 'vitest-server', lane: 'acceptance' }])
})

test('fails when a colocated route suite is omitted from the configured runner', () => {
	const owners = proofOwners.filter(({ id }) => id !== 'playwright-main')
	const inventory = contract(['src/routes/root-navigation.e2e.ts'], owners)
	assert.deepEqual(inventory.undiscovered, ['src/routes/root-navigation.e2e.ts'])
})

test('fails when one suite is silently owned by duplicate configs', () => {
	const owners = [
		{ id: 'first-config', lane: 'acceptance', matches: () => true },
		{ id: 'second-config', lane: 'acceptance', matches: () => true },
	]
	const inventory = contract(['tests/e2e/route-matrix.e2e.ts'], owners)
	assert.deepEqual(inventory.duplicated, [{ pathname: 'tests/e2e/route-matrix.e2e.ts', owners: ['first-config', 'second-config'] }])
})

test('fails when an observational suite is promoted to acceptance', () => {
	const inventory = inspectDiscovery({
		pathnames: ['tests/e2e/provider-discovery.e2e.ts'],
		proofOwners: [{ id: 'acceptance-config', lane: 'acceptance', matches: () => true }],
		observationMatchers: [() => true],
	})
	assert.deepEqual(inventory.promotedObservations, [{ pathname: 'tests/e2e/provider-discovery.e2e.ts', owners: ['acceptance-config'] }])
})

test('fails when an acceptance suite is assigned only to an observation runner', () => {
	const inventory = inspectDiscovery({
		pathnames: ['tests/e2e/route-matrix.e2e.ts'],
		proofOwners: [{ id: 'observation-config', lane: 'observation', matches: () => true }],
	})
	assert.deepEqual(inventory.laneMismatches, [{
		pathname: 'tests/e2e/route-matrix.e2e.ts',
		lane: 'acceptance',
		owners: [{ id: 'observation-config', lane: 'observation' }],
	}])
	assert.throws(() => assertDiscoveryContract(inventory), /laneMismatches/)
})

test('keeps a deterministic live-named route on the main acceptance lane', () => {
	const inventory = configuredContract([
		'src/routes/network/dydx-chain-market-live-dl.e2e.ts',
		'src/routes/network/pool-observations.e2e.ts',
	])
	assertDiscoveryContract(inventory)
	assert.equal(inventory.entries[0].lane, 'acceptance')
	assert.equal(inventory.entries[1].lane, 'acceptance')
	assert.deepEqual(inventory.promotedObservations, [])
})

test('keeps an explicitly wallet-configured provider observation observational', () => {
	const inventory = configuredContract([
		'tests/e2e/wallet-extensions/provider-discovery.e2e.ts',
		'tests/e2e/wallet-extensions/MetaMask/matrix.e2e.ts',
	])
	assertDiscoveryContract(inventory)
	assert.equal(inventory.entries[0].lane, 'observation')
	assert.equal(inventory.entries[1].lane, 'observation')
	assert.deepEqual(inventory.promotedObservations, [])
})

test('assigns deterministic wallet root suites only to main Playwright', () => {
	const inventory = configuredContract([
		'tests/e2e/wallet-extensions/architectures.e2e.ts',
		'tests/e2e/wallet-extensions/wallet-page-selectors.e2e.ts',
	])
	assertDiscoveryContract(inventory)
	assert.deepEqual(inventory.entries.map(({ owners }) => owners), [
		[{ id: 'playwright-main', lane: 'acceptance' }],
		[{ id: 'playwright-main', lane: 'acceptance' }],
	])
})
