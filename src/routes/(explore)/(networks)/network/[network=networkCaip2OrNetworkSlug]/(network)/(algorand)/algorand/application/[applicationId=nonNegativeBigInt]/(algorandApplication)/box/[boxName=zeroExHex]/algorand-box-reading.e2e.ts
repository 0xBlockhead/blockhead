import { expect, test } from '@playwright/test'

import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'


const applicationId = '1134695678'
const boxName = '0x6170261ab95e592dc700853f042fbecab4f624c434cb2e66ea395f26328b1be0408e'
const boxNameBase64 = 'YXAmGrleWS3HAIU/BC++yrT2JMQ0yy5m6jlfJjKLG+BAjg=='
const boxPath = `/network/algorand/algorand/application/${applicationId}/box/${boxName}`
const algodBinding = bindings[Source.Nodely].find(({ apiFamily }) => (
	apiFamily === ApiFamily.AlgodRestApi
))

if (algodBinding == null)
	throw new Error('Algorand box E2E is missing the Nodely Algod binding')

const algodProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(algodBinding))}/0/`
)


test.setTimeout(180_000)

test.beforeEach(async ({ context }, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-algorand-box-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('application box detail reads its source-clocked value with Algod goal-argument encoding', async ({ page }) => {
	const requests: string[] = []
	const unexpectedRequests: string[] = []
	const pageErrors: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.route('**/api-proxy/**', async (route) => {
		const request = route.request()
		const decodedUrl = decodeURIComponent(request.url())
		if (
			decodedUrl.includes(`/v2/applications/${applicationId}`)
			&& !decodedUrl.includes('/box')
		) {
			await route.fulfill({
				json: {
					application: {
						deleted: false,
						id: Number(applicationId),
						params: {
							creator: 'A'.repeat(58),
						},
					},
					'current-round': 64_248_043,
				},
			})
			return
		}
		if (algodProxyRoute.test(request.url())) {
			const providerUrl = new URL(decodeURIComponent(
				new URL(request.url()).pathname.split('/').at(-1) ?? ''
			))
			requests.push(`${request.method()} ${providerUrl.pathname}${providerUrl.search}`)
			if (
				request.method() === 'GET'
				&& providerUrl.pathname === `/v2/applications/${applicationId}/box`
				&& providerUrl.searchParams.get('name') === `b64:${boxNameBase64}`
			) {
				await route.fulfill({
					headers: {
						'x-algo-round': '64248043',
					},
					json: {
						name: boxNameBase64,
						value: 'AAAAAGeHoTeHYdKLr54gil+vM2ZLa1RJ0nrWhGMtXS5G8w097xDvJQ==',
					},
				})
				return
			}
		}

		unexpectedRequests.push(`${request.method()} ${decodedUrl}`)
		await route.fulfill({
			body: 'Unexpected Algorand fixture request',
			status: 418,
		})
	})

	await page.goto(boxPath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	const observationPath = `${boxPath}/observation/64248043/${Source.Nodely}`
	const observationLink = page.locator(`#main a[href="${observationPath}"]`)
	await expect(observationLink).toBeAttached({ timeout: 120_000 })
	await observationLink.click()
	await expect(page).toHaveURL(observationPath)
	await expect(page.getByRole('button', {
		name: '0x68911a6a7ee3ffb4ff7ab2d7da3790d3f8f96a8869056ef93c70aaea907808e',
	})).toBeAttached()

	expect(requests).toEqual([
		`GET /v2/applications/${applicationId}/box?name=b64%3A${encodeURIComponent(boxNameBase64)}`,
	])
	expect(unexpectedRequests).toEqual([])
	expect(pageErrors).toEqual([])
})
