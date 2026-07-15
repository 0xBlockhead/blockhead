import assert from 'node:assert/strict'
import {
	copyFileSync,
	mkdtempSync,
	rmSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

import {
	routes,
	type App,
} from '../../APP.ts'


const compileTypeScript = (
	root: string,
	filePath: string
) => spawnSync(
	process.execPath,
	[
		'--max-old-space-size=4096',
		path.join(root, 'node_modules/typescript/bin/tsc'),
		'--noEmit',
		'--ignoreConfig',
		'--allowImportingTsExtensions',
		'--strict',
		'--skipLibCheck',
		'--module',
		'preserve',
		'--moduleResolution',
		'bundler',
		'--target',
		'esnext',
		filePath,
	],
	{
		cwd: root,
		encoding: 'utf8',
	}
)

const assertRouteProbeMapping = <const _Mapping extends {
	href?: object
	probeCases: readonly {
		id: string
		params: Readonly<Record<string, string>>
	}[]
}>(
	mapping: _Mapping,
	paramNames: readonly string[],
	context: string
) => {
	assert.ok(mapping.probeCases.length > 0, `${context} has no probe cases`)
	assert.ok(!('fixture' in mapping), `${context} retains legacy fixture`)
	assert.ok(!('variants' in mapping), `${context} retains legacy variants`)
	assert.ok(mapping.href == null || Object.keys(mapping.href).length > 0, `${context} has an empty href placeholder`)
	assert.equal(
		new Set(mapping.probeCases.map(({ id }) => id)).size,
		mapping.probeCases.length,
		`${context} has duplicate probe case ids`
	)
	for (const probeCase of mapping.probeCases)
		assert.deepEqual(
			Object.keys(probeCase.params).sort(),
			[...paramNames].sort(),
			`${context} probe case ${probeCase.id}`
		)
}


test('route probe cases derive exact local and inherited parameter keys from the route tree', () => {
	const root = process.cwd()
	const typeTestRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-route-probe-cases-test-'))

	try {
		copyFileSync(
			path.join(root, 'scripts/app/route-probe-cases.types.ts'),
			path.join(typeTestRoot, 'route-probe-cases.types.ts')
		)
		writeFileSync(path.join(typeTestRoot, 'fixture.ts'), `
			import { defineRoutes } from './route-probe-cases.types.ts'

			const defineFixtureRoutes = defineRoutes({ entities: [] })

			defineFixtureRoutes({
				children: {
					'network': {
						children: {
							'[network=networkId]': {
								children: {
									'tx': {
										children: {
											'[transactionId]': {
												selectors: {
													EvmTransaction: {
														EvmNetworkTxHash: {
															probeCases: [{
																id: 'ethereum',
																params: {
																	network: 'network.ethereum',
																	transactionId: 'transaction.ethereum',
																},
															}],
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
					'swarm': {
						selectors: {
							SwarmProtocol: {
								Scope: {
									probeCases: [{ id: 'default', params: {} }],
								},
							},
						},
					},
					'repository': {
						children: {
							'[...repositoryPath=rest]': {
								selectors: {
									Repository: {
										Path: {
											probeCases: [{
												id: 'rest',
												params: { repositoryPath: 'repository.path' },
											}],
										},
									},
								},
							},
						},
					},
				},
			})

			// @ts-expect-error Missing inherited parameter.
			defineFixtureRoutes({ children: { '[network]': { children: { '[transactionId]': { selectors: { EvmTransaction: { TxHash: { probeCases: [{ id: 'missing', params: { transactionId: 'transaction' } }] } } } } } } } })

			// @ts-expect-error Misspelled inherited parameter.
			defineFixtureRoutes({ children: { '[network]': { selectors: { Network: { Caip2: { probeCases: [{ id: 'misspelled', params: { netwrok: 'network' } }] } } } } } })

			// @ts-expect-error Extra architecture parameter.
			defineFixtureRoutes({ children: { '[network]': { selectors: { Network: { Caip2: { probeCases: [{ id: 'extra', params: { network: 'network', architecture: 'evm' } }] } } } } } })

			// @ts-expect-error Every selector mapping requires a nonempty tuple.
			defineFixtureRoutes({ children: { '[network]': { selectors: { Network: { Caip2: { probeCases: [] } } } } } })

			// @ts-expect-error Static routes reject parameter records.
			defineFixtureRoutes({ children: { 'swarm': { selectors: { SwarmProtocol: { Scope: { probeCases: [{ id: 'extra', params: { scope: 'swarm' } }] } } } } } })
		`)

		const result = compileTypeScript(root, path.join(typeTestRoot, 'fixture.ts'))

		assert.equal(result.status, 0, result.stderr || result.stdout)
	} finally {
		rmSync(typeTestRoot, {
			force: true,
			recursive: true,
		})
	}
})

test('legacy and incomplete route probe structures fail the APP traversal invariant', () => {
	for (const mapping of [
		{
			probeCases: [],
		},
		{
			fixture: {},
			probeCases: [{ id: 'default', params: { network: 'network.ethereum' } }],
		},
		{
			variants: {},
			probeCases: [{ id: 'default', params: { network: 'network.ethereum' } }],
		},
		{
			href: {},
			probeCases: [{ id: 'default', params: { network: 'network.ethereum' } }],
		},
		{
			probeCases: [{ id: 'default', params: {} }],
		},
		{
			probeCases: [{
				id: 'default',
				params: {
					architecture: 'architecture.evm',
					network: 'network.ethereum',
				},
			}],
		},
		{
			probeCases: [
				{ id: 'default', params: { network: 'network.ethereum' } },
				{ id: 'default', params: { network: 'network.bitcoin' } },
			],
		},
	])
		assert.throws(() => assertRouteProbeMapping(mapping, ['network'], 'negative control'))
})

test('the real APP route source owns complete nonempty probe cases', () => {
	type RouteNode = App['routes']['children'][string]

	let mappingCount = 0
	const walk = (
		node: RouteNode,
		internalPath: string,
		ancestorParamNames: readonly string[]
	) => {
		const paramNames = [
			...ancestorParamNames,
			...[...internalPath.matchAll(/\[(?:\.\.\.)?([^=\]]+)(?:=[^\]]+)?\]/g)]
				.map((match) => match[1])
				.filter((paramName) => !ancestorParamNames.includes(paramName)),
		]

		for (const selectorByName of Object.values(node.selectors ?? {}))
			for (const mapping of Object.values(selectorByName ?? {})) {
				mappingCount++
				assertRouteProbeMapping(mapping, paramNames, internalPath)
			}

		for (const [segment, child] of Object.entries(node.children ?? {}))
			walk(child, `${internalPath}/${segment}`, paramNames)
	}

	for (const [segment, node] of Object.entries(routes.children))
		walk(node, `/${segment}`, [])

	assert.ok(mappingCount > 0)
})
