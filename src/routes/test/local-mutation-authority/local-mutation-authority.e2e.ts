import {
	expect,
	test,
} from '@playwright/test'
import * as Hash from 'ox/Hash'

import { Source } from '$/sources/Source.ts'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../tests/e2e/_routeViewFixtures.ts'


const openFixture = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo
) => {
	await installRouteViewSqliteIsolation(page, `local-mutation-authority-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}`)
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnTanStackWarnings: true,
	})
	await diagnostics.step(page.goto('/test/local-mutation-authority', {
		waitUntil: 'domcontentloaded',
		timeout: 120_000,
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await diagnostics.step(expect(page.getByRole('heading', {
		level: 1,
		name: 'Local mutation authority',
		exact: true,
	})).toBeVisible({ timeout: 120_000 }))

	return diagnostics
}

test('runtime session authority survives re-entry and deletes atomically', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const diagnostics = await openFixture(page, testInfo)
	await expect(page.getByTestId('session-awaited')).toBeAttached()
	await diagnostics.step(page.getByRole('button', {
		name: 'Clear sessions',
	}).click())
	await expect(page.getByTestId('sessions-persisted')).toContainText('persisted')

	await diagnostics.step(page.getByRole('button', {
		name: 'Create sessions',
	}).click())
	await expect(page.getByTestId('sessions-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session A')
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session B')
	await expect(page.getByTestId('session-awaited')).toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session B')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session A')
	await expect(page.getByTestId('session-awaited')).toContainText('Authority Session B')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session A')

	await diagnostics.step(page.getByRole('button', {
		name: 'Delete first session',
	}).click())
	await expect(page.getByTestId('session-direct')).not.toContainText('Authority Session A')
	await expect(page.getByTestId('session-direct')).toContainText('Authority Session B')
	await expect(page.getByTestId('session-awaited')).not.toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).not.toContainText('Authority Session A')
	await expect(page.locator('#local-authority-sessions')).toContainText('Authority Session B')
	await expect(page.getByTestId('sessions-persisted')).toHaveText('persisted')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('session-direct')).toHaveText('Authority Session B')
	await expect(page.getByTestId('session-awaited')).toHaveText('Authority Session B')
	await expect(page.locator('#local-authority-sessions')).not.toContainText('Authority Session A')
	await expect(page.locator('#main')).not.toContainText('Local_Internal')
})

test('runtime wallet authority survives re-entry and deletes atomically', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const diagnostics = await openFixture(page, testInfo)
	await expect(page.getByTestId('wallet-awaited')).toBeAttached()
	await diagnostics.step(page.getByRole('button', {
		name: 'Clear wallet connections',
	}).click())
	await diagnostics.step(expect(page.getByTestId('wallets-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	}))

	await diagnostics.step(page.getByRole('button', {
		name: 'Create wallet connections',
	}).click())
	await diagnostics.step(expect(page.getByTestId('wallets-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	}))
	await expect(page.getByTestId('wallet-awaited')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-b')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-awaited')).toContainText('authority-connection-b')
	await expect(page.getByTestId('wallet-hydration-summary')).toHaveText(
		'authority-wallet-a|1|0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	)

	await diagnostics.step(page.getByRole('button', {
		name: 'Disconnect first wallet connection',
	}).click())
	await diagnostics.step(expect(page.getByTestId('wallets-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	}))
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-a')

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-awaited')).toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-hydration-settled')).toHaveText('settled')
	await expect(page.getByTestId('wallet-hydration-summary')).toHaveText('authority-wallet-a|0|none')

	await diagnostics.step(page.getByRole('button', {
		name: 'Delete first wallet connection',
	}).click())
	await expect(page.getByTestId('wallet-direct')).not.toContainText('authority-connection-a')
	await expect(page.getByTestId('wallet-direct')).toContainText('authority-connection-b')
	await expect(page.getByTestId('wallet-awaited')).not.toContainText('authority-connection-a')
	await diagnostics.step(expect(page.getByTestId('wallets-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	}))

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect(page.getByTestId('wallet-direct')).toHaveText('authority-connection-b')
	await expect(page.getByTestId('wallet-awaited')).toHaveText('authority-connection-b')
	await expect(page.locator('#main')).not.toContainText('Local_Internal')
})

test('nested callable references update collection and first ResourceBoundary consumers', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const derivedInertWarnings: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'warning' && message.text().includes('derived_inert'))
			derivedInertWarnings.push(message.text())
	})
	const diagnostics = await openFixture(page, testInfo)
	const collectionBoundary = page.getByTestId('nested-resource-collection-awaited')
	const firstCurrent = page.getByTestId('nested-resource-first-current')
	const firstPromise = page.getByTestId('nested-resource-first-promise')
	const firstBoundary = page.getByTestId('nested-resource-first-awaited')
	await expect(collectionBoundary).toBeAttached({
		timeout: 120_000,
	})
	await expect(firstCurrent).toBeAttached({
		timeout: 120_000,
	})
	await expect(firstPromise).toBeAttached({
		timeout: 120_000,
	})
	await expect(firstBoundary).toBeAttached({
		timeout: 120_000,
	})
	await expect(collectionBoundary).toHaveText('')
	await expect(firstCurrent).toHaveText('')
	await expect(firstPromise).toHaveText('')
	await expect(firstBoundary).toHaveText('')

	await diagnostics.step(page.getByRole('button', {
		name: 'Materialize boundary session',
	}).click())
	await diagnostics.step(expect(collectionBoundary).toHaveText('Resource Boundary 100', {
		timeout: 120_000,
	}))
	await diagnostics.step(expect(firstCurrent).toHaveText('Resource Boundary 100', {
		timeout: 120_000,
	}))
	await diagnostics.step(expect(firstPromise).toHaveText('Resource Boundary 100', {
		timeout: 120_000,
	}))
	await diagnostics.step(expect(firstBoundary).toHaveText('Resource Boundary 100', {
		timeout: 120_000,
	}))

	await diagnostics.step(page.getByRole('button', {
		name: 'Update boundary session',
	}).click())
	await diagnostics.step(expect(collectionBoundary).toHaveText('Resource Boundary 101', {
		timeout: 120_000,
	}))
	await diagnostics.step(expect(firstCurrent).toHaveText('Resource Boundary 101', {
		timeout: 120_000,
	}))
	await diagnostics.step(expect(firstPromise).toHaveText('Resource Boundary 101', {
		timeout: 120_000,
	}))
	await diagnostics.step(expect(firstBoundary).toHaveText('Resource Boundary 101', {
		timeout: 120_000,
	}))

	await diagnostics.step(page.getByRole('button', {
		name: 'Materialize entity reference',
	}).click())
	const latestSimulation = page
		.getByTestId('entity-reference-session-view')
		.getByText('Latest simulation', {
			exact: true,
		})
		.locator('..')
		.locator('dd')
	await diagnostics.step(expect(latestSimulation.getByRole('link')).toHaveAttribute(
		'href',
		'/~/session/simulation/entity-reference-simulation-a',
		{
			timeout: 120_000,
		}
	))

	await diagnostics.step(page.getByRole('button', {
		name: 'Replace entity reference',
	}).click())
	await diagnostics.step(expect(latestSimulation.getByRole('link')).toHaveAttribute(
		'href',
		'/~/session/simulation/entity-reference-simulation-b',
		{
			timeout: 120_000,
		}
	))
	expect(derivedInertWarnings).toEqual([])
})

test('local simulation graph persistence survives a fresh client reload', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const diagnostics = await openFixture(page, testInfo)
	const rootInput = '0x14bd0a7b000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000002a'
	const childInput = '0x60fe47b1000000000000000000000000000000000000000000000000000000000000002a'
	const rootRevert = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d6e6573746564206661696c656400000000000000000000000000000000000000'
	const childRevert = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d746172676574206661696c656400000000000000000000000000000000000000'
	const logData = '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a'
	await diagnostics.step(page.getByRole('button', {
		name: 'Materialize durable G15 simulation',
	}).click())
	await expect(page.getByTestId('durable-g15-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	})
	const simulationSelector = {
		id: 'simulation-g15-durable',
	}
	const rootSelector = {
		simulationId: 'simulation-g15-durable',
		callPath: 'root',
	}
	const childSelector = {
		simulationId: 'simulation-g15-durable',
		callPath: '0',
	}
	const logSelector = {
		simulationId: 'simulation-g15-durable',
		logIndex: 0,
	}
	const readGraph = () => page.evaluate(async () => (
		await window.__blockheadClientProbe?.g15SimulationGraph()
	))
	const beforeReload = await readGraph()
	expect(beforeReload).toBeDefined()
	const field = (
		entityType: string,
		fieldName: string,
		parentSelector: object,
		value: object | string | boolean | readonly string[]
	) => expect.objectContaining({
		entityType,
		fieldName,
		parentSelector,
		value,
	})
	expect(beforeReload?.simulations).toEqual(expect.arrayContaining([
		expect.objectContaining({ selector: simulationSelector }),
	]))
	expect(beforeReload?.calls).toEqual(expect.arrayContaining([
		expect.objectContaining({ selector: rootSelector }),
		expect.objectContaining({ selector: childSelector }),
	]))
	expect(beforeReload?.logs).toEqual(expect.arrayContaining([
		expect.objectContaining({ selector: logSelector }),
	]))
	expect(beforeReload?.fields).toEqual(expect.arrayContaining([
		field('BlockheadSessionSimulation', '$session', simulationSelector, expect.objectContaining({
			__selector: expect.objectContaining({ id: expect.any(String) }),
		})),
		field('BlockheadSessionSimulation', '$$calls', simulationSelector, expect.objectContaining({ __selector: rootSelector })),
		field('BlockheadSessionSimulation', '$$calls', simulationSelector, expect.objectContaining({ __selector: childSelector })),
		field('BlockheadSessionSimulation', '$$logs', simulationSelector, expect.objectContaining({ __selector: logSelector })),
		field('BlockheadSessionSimulationCall', '$simulation', rootSelector, expect.objectContaining({ __selector: simulationSelector })),
		field('BlockheadSessionSimulationCall', '$simulation', childSelector, expect.objectContaining({ __selector: simulationSelector })),
		field('BlockheadSessionSimulationCall', 'parentCallPath', childSelector, 'root'),
		field('BlockheadSessionSimulationCall', 'inputDataHash', rootSelector, Hash.sha256(rootInput)),
		field('BlockheadSessionSimulationCall', 'outputDataHash', rootSelector, Hash.sha256(rootRevert)),
		field('BlockheadSessionSimulationCall', 'error', rootSelector, 'nested failed'),
		field('BlockheadSessionSimulationCall', 'reverted', rootSelector, true),
		field('BlockheadSessionSimulationCall', 'value', rootSelector, '0n'),
		field('BlockheadSessionSimulationCall', 'gasUsed', rootSelector, '28823n'),
		field('BlockheadSessionSimulationCall', 'inputDataHash', childSelector, Hash.sha256(childInput)),
		field('BlockheadSessionSimulationCall', 'outputDataHash', childSelector, Hash.sha256(childRevert)),
		field('BlockheadSessionSimulationCall', 'error', childSelector, 'target failed'),
		field('BlockheadSessionSimulationCall', 'reverted', childSelector, true),
		field('BlockheadSessionSimulationCall', 'value', childSelector, '0n'),
		field('BlockheadSessionSimulationCall', 'gasUsed', childSelector, '4623n'),
		field('BlockheadSessionSimulationLog', '$simulation', logSelector, expect.objectContaining({ __selector: simulationSelector })),
		field('BlockheadSessionSimulationLog', 'topic0', logSelector, '0x850a767d264ab988d24d1ff1a7b843b2902e6cc83a7c7a457d97796c773b2b63'),
		field('BlockheadSessionSimulationLog', 'topics', logSelector, [
			'0x850a767d264ab988d24d1ff1a7b843b2902e6cc83a7c7a457d97796c773b2b63',
			'0x000000000000000000000000000000000000000000000000000000000000002a',
		]),
		field('BlockheadSessionSimulationLog', 'dataHash', logSelector, Hash.sha256(logData)),
		field('BlockheadSessionSimulationLog', 'removed', logSelector, false),
	]))

	await diagnostics.step(page.reload({
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await expect.poll(() => page.evaluate(() => (
		window.__blockheadClientProbe != null
	)), {
		timeout: 120_000,
	}).toBe(true)
	const afterReload = await readGraph()
	expect(afterReload).toEqual(beforeReload)
})

test('persisted simulation graph downloads as the complete hash-only envelope', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const diagnostics = await openFixture(page, testInfo)
	await diagnostics.step(page.getByRole('button', {
		name: 'Materialize durable G15 simulation',
	}).click())
	await expect(page.getByTestId('durable-g15-persisted')).toHaveText('persisted', {
		timeout: 120_000,
	})

	await diagnostics.step(page.goto('/~/session/simulation/simulation-g15-durable', {
		waitUntil: 'domcontentloaded',
		timeout: 120_000,
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	const downloadButton = page.getByRole('button', {
		name: 'Download JSON',
		exact: true,
	})
	await expect(downloadButton).toBeEnabled({ timeout: 120_000 })
	const downloadPromise = page.waitForEvent('download')
	await diagnostics.step(downloadButton.click())
	const download = await downloadPromise
	expect(download.suggestedFilename()).toBe('blockhead-session-simulation.json')
	const stream = await download.createReadStream()
	const chunks: Buffer[] = []
	for await (const chunk of stream)
		chunks.push(Buffer.from(chunk))
	const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))

	expect(payload).toMatchObject({
		schemaVersion: 1,
		kind: 'blockhead.sessionSimulation',
		selector: {
			id: 'simulation-g15-durable',
		},
		source: Source.Local_Internal,
		simulation: {
			id: 'simulation-g15-durable',
			status: 'failed',
			error: 'nested failed',
		},
	})
	expect(payload.calls).toHaveLength(2)
	expect(payload.logs).toHaveLength(1)
	for (const call of payload.calls) {
		expect(call).not.toHaveProperty('inputData')
		expect(call).not.toHaveProperty('outputData')
	}
})
