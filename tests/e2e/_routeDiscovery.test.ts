import assert from 'node:assert/strict'
import test from 'node:test'

import { swarmDocsLandingReference } from '../../src/sources/Swarm/Rest/constants.ts'
import { e2eRouteFixtureMetadataByNodeId } from './_generatedRouteFixtureMetadata.ts'
import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'
import { e2eRouteProbeAtomValueById } from './_routeParamFixtures.ts'


test('route probe atom values exactly cover every generated atom', () => {
	assert.deepEqual(
		[...new Set(Object.values(e2eRouteFixtureMetadataByNodeId).flatMap((metadata) => (
			metadata.mappings.flatMap((mapping) => (
				mapping.probeCases.flatMap((probeCase) => Object.values(probeCase.params))
			))
		)))].sort(),
		Object.keys(e2eRouteProbeAtomValueById).sort()
	)
})

test('completes global discovery including IPFS and Swarm selector path variants', async () => {
	assert.deepEqual(
		(await discoverPathnamesFromRoutes()).filter((pathname) => (
			pathname.startsWith('/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG')
			|| pathname.startsWith(`/swarm/${swarmDocsLandingReference}`)
		)),
		[
			'/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
			'/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/path/readme',
			`/swarm/${swarmDocsLandingReference}`,
			`/swarm/${swarmDocsLandingReference}/path/readme`,
		]
	)
})
