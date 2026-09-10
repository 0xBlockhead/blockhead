import { describe, expect, it } from 'vitest'
import ipfs from '$/resolvers/Ipfs-Rest.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { observationTimeWriterManifest } from '../../scripts/app/accountability.ts'
import { readFileSync } from 'node:fs'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import captureSchema from '$/schema/IpfsResource_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { ipfsGatewaySampleCid } from '$/sources/Ipfs/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

describe('IPFS historical capability boundary', () => {
	it('requires the exact generated resource, time and source capture coordinate', () => {
		const selector = {
			$resource: { namespace: 'ipfs', target: ipfsGatewaySampleCid, contentPath: 'docs/readme.txt' },
			timestampMs: 2000,
			source: Source.Ipfs_Rest,
		}
		expect(parseRouteEntitySelector(schema, captureSchema, selector, 'ResourceTimestampMsSource')).toEqual(selector)
		for (const incomplete of [
			{ $resource: selector.$resource, source: selector.source },
			{ $resource: selector.$resource, timestampMs: selector.timestampMs },
			{ timestampMs: selector.timestampMs, source: selector.source },
		])
			expect(parseRouteEntitySelector(schema, captureSchema, incomplete, 'ResourceTimestampMsSource')).toBeInstanceOf(type.errors)
	})

	it('has no remote resolver for either an old content capture or an old access observation', () => {
		const capabilities = ipfs.resolvers.map((resolver) => resolver.entityType)
		expect(capabilities).not.toContain(EntityType.IpfsResource_Timestamp)
		expect(capabilities).not.toContain(EntityType._GlobalIpfsAccess_Timestamp)
	})

	it('classifies the actual capture writer as HTTP response completion, separately from access refresh', () => {
		const writers = observationTimeWriterManifest([{
			source: ipfs.source,
			path: 'src/resolvers/Ipfs-Rest.ts',
			sourceText: readFileSync(new URL('./Ipfs-Rest.ts', import.meta.url), 'utf8'),
		}])
		expect(writers).toEqual(expect.arrayContaining([
			expect.objectContaining({ entityType: 'IpfsResource_Timestamp', provenance: 'HttpResponse' }),
			expect.objectContaining({ entityType: '_GlobalIpfsAccess_Timestamp', provenance: 'LocalRefresh' }),
		]))
	})
})
