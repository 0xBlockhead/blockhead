import { describe, expect, test } from 'vitest'

import { resolveProbeEntitySelector } from './_fixtures.ts'
import {
	resolverSnapshotCoordinates,
	resolveSnapshotOnceThenProject,
} from './_runProbes.ts'


describe('resolver snapshot probes', () => {
	test('resolves alternate selectors from exact selector-addressed fixtures', async () => {
		await expect(resolveProbeEntitySelector(
			'AtprotoActor',
			'Handle'
		)).resolves.toEqual({
			handle: 'bsky.app',
		})
	})

	test('creates one coordinate for every exact supported selector', () => {
		const firstResolver = {
			resolve: {
				ByHash: () => 'hash',
				ByHeight: () => 'height',
			},
		}
		const secondResolver = {
			resolve: {
				ById: () => 'id',
			},
		}

		expect(resolverSnapshotCoordinates([
			firstResolver,
			secondResolver,
		])).toEqual([
			{
				resolver: firstResolver,
				selectorName: 'ByHash',
			},
			{
				resolver: firstResolver,
				selectorName: 'ByHeight',
			},
			{
				resolver: secondResolver,
				selectorName: 'ById',
			},
		])
	})

	test('resolves each selector snapshot once before applying every projection', async () => {
		const rootCalls: string[] = []
		const projectionSnapshots: { selectorName: string }[] = []
		const coordinates = resolverSnapshotCoordinates([{
			resolve: {
				ByHash: () => 'hash',
				ByHeight: () => 'height',
			},
		}])

		const executions = await Promise.all(coordinates.map(({ selectorName }) => (
			resolveSnapshotOnceThenProject(
				() => {
					rootCalls.push(selectorName)

					return { selectorName }
				},
				[
					(snapshot) => {
						projectionSnapshots.push(snapshot)

						return `field:${snapshot.selectorName}`
					},
					(snapshot) => {
						projectionSnapshots.push(snapshot)

						return `count:${snapshot.selectorName}`
					},
				]
			)
		)))

		expect(rootCalls).toEqual([
			'ByHash',
			'ByHeight',
		])
		expect(projectionSnapshots).toEqual([
			executions[0].snapshot,
			executions[0].snapshot,
			executions[1].snapshot,
			executions[1].snapshot,
		])
		expect(executions.map(({ projections }) => projections)).toEqual([
			[
				'field:ByHash',
				'count:ByHash',
			],
			[
				'field:ByHeight',
				'count:ByHeight',
			],
		])
	})
})
