import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertDiscoveryContract,
	inspectDiscovery,
} from './test-discovery.mjs'

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

test('owns the complete current inventory, including colocated route suites', () => {
	const inventory = contract([
		'src/routes/root-navigation.e2e.ts',
		'tests/e2e/route-matrix.e2e.ts',
		'scripts/check/test-discovery.contract.test.mjs',
	])
	assertDiscoveryContract(inventory)
	assert.equal(inventory.counts.colocatedRoutes, 1)
})

test('fails when a colocated route suite is omitted from the configured runner', () => {
	const owners = proofOwners.filter(({ id }) => id !== 'playwright-main' && id !== 'playwright-observations')
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
	const inventory = contract(['tests/e2e/provider-discovery.e2e.ts'], [{
		id: 'acceptance-config',
		lane: 'acceptance',
		matches: () => true,
	}])
	assert.deepEqual(inventory.promotedObservations, [{ pathname: 'tests/e2e/provider-discovery.e2e.ts', owners: ['acceptance-config'] }])
})
