import assert from 'node:assert/strict'
import test from 'node:test'

import { app, EntityType } from '../../APP.ts'
import type { App } from './model.ts'

type RouteNode = App['routes']['children'][string]

const publicShape = (segments: readonly string[]) => `/${segments
	.filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
	.map((segment) => segment.replaceAll(/=([^\]]+)(?=\]\]?)/g, ''))
	.join('/')}`.replaceAll('//', '/')

const repeatedPublicShapes = (children: Readonly<Record<string, RouteNode>>) => {
	const counts = new Map<string, number>()
	const visit = (nodes: Readonly<Record<string, RouteNode>>, ancestors: readonly string[]) => {
		for (const [segment, node] of Object.entries(nodes)) {
			const segments = [...ancestors, segment]
			const shape = publicShape(segments)
			counts.set(shape, (counts.get(shape) ?? 0) + 1)
			if (node.children != null)
				visit(node.children, segments)
		}
	}
	visit(children, [])
	return [...counts].filter(([, count]) => count > 1).map(([shape]) => shape).sort()
}

test('freezes the exact repeated public-shape denominator', () => {
	assert.deepEqual(repeatedPublicShapes(app.routes.children), [
		'/',
		'/bittorrent',
		'/cctp',
		'/evm',
		'/farcaster',
		'/farcaster/cast',
		'/farcaster/channel',
		'/lens',
		'/lens/account',
		'/network/[network]',
		'/network/[network]/account',
		'/network/[network]/asset',
		'/network/[network]/block',
		'/network/[network]/block/hash',
		'/network/[network]/contract',
		'/network/[network]/contract/[address]',
		'/network/[network]/contract/[address]/observations',
		'/network/[network]/contract/[address]/observations/[timestampMs]',
		'/network/[network]/contract/[address]/observations/[timestampMs]/[source]',
		'/network/[network]/ledger',
		'/network/[network]/market',
		'/network/[network]/observations',
		'/network/[network]/subnet',
		'/network/[network]/token',
		'/network/[network]/transaction',
		'/network/[network]/upgrade',
		'/network/[network]/validator',
		'/network/[network]/~',
		'/x',
		'/x/user',
		'/xmtp',
	])
})

const routesForSelector = (entityType: EntityType, selector: string) => {
	const paths: string[] = []
	const visit = (children: Readonly<Record<string, RouteNode>>, ancestors: readonly string[]) => {
		for (const [segment, node] of Object.entries(children)) {
			const segments = [...ancestors, segment]
			if (Object.hasOwn(node.selectors?.[entityType] ?? {}, selector))
				paths.push(publicShape(segments))
			if (node.children != null)
				visit(node.children, segments)
		}
	}
	visit(app.routes.children, [])
	return paths
}

test('keeps MEV sampling windows distinct in logical selector routes', () => {
	assert.deepEqual(
		routesForSelector(EntityType.MevRelay_Timestamp, 'RelayTimestampMsSourceSampleLimit'),
		['/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]-[sampleLimit]']
	)
	assert.deepEqual(
		routesForSelector(EntityType.MevBuilder_Timestamp, 'BuilderTimestampMsSourceSampleLimit'),
		['/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]-[sampleLimit]']
	)
})
