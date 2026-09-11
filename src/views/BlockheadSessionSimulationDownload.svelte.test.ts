import { page, userEvent } from 'vitest/browser'
import { afterEach, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'
import BlockheadSessionSimulationDownload from './BlockheadSessionSimulationDownload.svelte'


const resource = <_Value,>(data: _Value) => new TanStackLiveQueryResource(() => ({
	data,
	isLoading: false,
	isError: false,
	isReady: true,
	status: 'ready',
}))

afterEach(() => {
	vi.restoreAllMocks()
})

test('downloads the deterministic persisted hash-only simulation envelope from the rendered control', async () => {
	let downloadedBlob: Blob | undefined
	let downloadedName: string | undefined
	vi.spyOn(Date, 'now').mockReturnValue(300)
	vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
		downloadedBlob = blob
		return 'blob:simulation-export'
	})
	const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
	vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
		downloadedName = this.download
	})
	const callCount = new TanStackLiveQueryResource<number>(() => ({
		data: 0,
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	}))

	await render(BlockheadSessionSimulationDownload, {
		simulationId: 'simulation-1',
		simulation: resource({
			status: 'completed',
			createdAt: 100,
			completedAt: 200,
			paramsHash: `0x${'a'.repeat(64)}`,
			forkBlockNumber: 18_000_000n,
			gasUsed: 42_000n,
		}),
		session: resource({
			entitySelector: {
				id: 'session-1',
			},
		}),
		calls: resource({
			values: [
				{
					callPath: '1',
					depth: 1,
					callIndex: 1,
					value: 12n,
					inputDataHash: `0x${'b'.repeat(64)}`,
					outputDataHash: `0x${'c'.repeat(64)}`,
				},
				{
					callPath: '0.1',
					parentCallPath: '0',
					depth: 2,
					callIndex: 1,
				},
				{
					callPath: 'root',
					depth: 0,
					callIndex: 0,
				},
				{
					callPath: '0.0',
					parentCallPath: '0',
					depth: 2,
					callIndex: 0,
				},
				{
					callPath: '0',
					parentCallPath: 'root',
					depth: 1,
					callIndex: 0,
				},
			],
		}),
		callCount,
		logs: resource({
			values: [
				{
					logIndex: 10,
					topics: [`0x${'d'.repeat(64)}`],
					dataHash: `0x${'e'.repeat(64)}`,
				},
				{
					logIndex: 2,
					topics: [],
					decodedArgs: {
						amount: '100',
					},
				},
			],
		}),
		logCount: resource(2),
	})

	await expect.element(page.getByRole('button', { name: 'Download JSON' })).not.toBeInTheDocument()
	callCount.set(6)
	const download = page.getByRole('button', { name: 'Download JSON' })
	await expect.element(download).toBeDisabled()
	await expect.element(page.getByText('Download unavailable until every persisted call and log is loaded.')).toBeVisible()
	callCount.set(5)
	await expect.element(download).toBeEnabled()
	callCount.set(4)
	await expect.element(download).toBeDisabled()
	callCount.set(5)
	await expect.element(download).toBeEnabled()
	await userEvent.click(download)
	if (downloadedBlob == null)
		throw new Error('Download did not create a Blob')
	const body = JSON.parse(await downloadedBlob.text())

	expect(downloadedName).toBe('blockhead-session-simulation.json')
	expect(revokeObjectUrl).toHaveBeenCalledWith('blob:simulation-export')
	expect(body).toMatchObject({
		schemaVersion: 1,
		kind: 'blockhead.sessionSimulation',
		selector: { id: 'simulation-1' },
		source: 'Local_Internal',
		exportedAtMs: 300,
		simulation: {
			id: 'simulation-1',
			session: { sessionId: 'session-1' },
			forkBlockNumber: '18000000',
			gasUsed: '42000',
		},
	})
	expect(body.calls.map((call: { callPath: string }) => call.callPath)).toEqual([
		'root',
		'0',
		'0.0',
		'0.1',
		'1',
	])
	expect(body.logs.map((log: { logIndex: number }) => log.logIndex)).toEqual([2, 10])
	expect(body.simulation).toMatchObject({
		executionSourceKind: null,
		executionSourceVersion: null,
		executionNetworkCaip2: null,
	})
	expect(body.calls[4]).toMatchObject({
		value: '12',
		inputDataHash: `0x${'b'.repeat(64)}`,
		outputDataHash: `0x${'c'.repeat(64)}`,
	})
	expect(body.logs[0].decodedArgs).toEqual({ amount: '100' })
	expect(downloadedBlob.type).toBe('application/json;charset=utf-8')
	expect(await downloadedBlob.text()).toMatch(/\n$/)
	expect(body.calls[4]).not.toHaveProperty('inputData')
	expect(body.calls[4]).not.toHaveProperty('outputData')
	expect(body.logs[1]).not.toHaveProperty('data')
})

test('includes populated Anvil execution provenance in the simulation envelope', async () => {
	let downloadedBlob: Blob | undefined
	vi.spyOn(Date, 'now').mockReturnValue(400)
	vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
		downloadedBlob = blob
		return 'blob:anvil-simulation-export'
	})
	vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
	vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

	await render(BlockheadSessionSimulationDownload, {
		simulationId: 'simulation-anvil',
		simulation: resource({
			status: 'completed',
			createdAt: 100,
			completedAt: 200,
			paramsHash: `0x${'a'.repeat(64)}`,
			executionSourceKind: 'Anvil',
			executionSourceVersion: '0.3.0',
			$executionNetwork: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				[EntityMetaKey.SelectorKey]: 'Network.Caip2:eip155:1',
				[EntityMetaKey.Source]: Source.Local_Internal,
				entitySelector: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			forkBlockNumber: 18_000_000n,
			forkRpcOrigin: 'https://ethereum.example',
			actionCount: 1,
			gasUsed: 42_000n,
			resultPayloadHash: `0x${'f'.repeat(64)}`,
		}),
		session: resource({
			entitySelector: {
				id: 'session-anvil',
			},
		}),
		calls: resource({ values: [] }),
		callCount: resource(0),
		logs: resource({ values: [] }),
		logCount: resource(0),
	})

	await userEvent.click(page.getByRole('button', { name: 'Download JSON' }))
	if (downloadedBlob == null)
		throw new Error('Download did not create a Blob')
	const body = JSON.parse(await downloadedBlob.text())

	expect(body.simulation).toMatchObject({
		id: 'simulation-anvil',
		executionSourceKind: 'Anvil',
		executionSourceVersion: '0.3.0',
		executionNetworkCaip2: {
			namespace: 'eip155',
			reference: '1',
		},
	})
	expect(body.simulation).not.toHaveProperty('chainId')
})
