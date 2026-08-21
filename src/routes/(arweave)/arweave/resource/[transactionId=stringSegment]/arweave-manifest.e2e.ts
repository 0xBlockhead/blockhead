import {
	expect,
	test,
} from '@playwright/test'

const transactionId = 'A'.repeat(43)
const fallbackTransactionId = 'B'.repeat(43)
const indexTransactionId = 'C'.repeat(43)
const pathTransactionId = 'D'.repeat(43)
const manifest = JSON.stringify({
	manifest: 'arweave/paths',
	version: '0.2.0',
	index: { path: 'index.html', id: indexTransactionId },
	fallback: { id: fallbackTransactionId },
	paths: {
		'index.html': { id: pathTransactionId },
		'assets/app.js': { id: 'E'.repeat(43) },
	},
})

test('renders raw v0.2 declarations independently from resolved root content', async ({ page }) => {
	const pageErrors: string[] = []
	const providerRequests: string[] = []
	const unexpectedRequests: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))
	page.on('request', (request) => {
		if (request.url().includes('arweave'))
			providerRequests.push(request.url())
	})
	await page.route('https://arweave.net/**', async (route) => {
		unexpectedRequests.push(route.request().url())
		await route.fulfill({ status: 418 })
	})
	await page.route('https://arweave.net/graphql', async (route) => {
		await route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify({
				data: {
					transaction: {
						id: transactionId,
						anchor: '',
						signature: 'signature',
						recipient: '',
						owner: { address: 'F'.repeat(43), key: 'owner-key' },
						fee: { winston: '0' },
						quantity: { winston: '0' },
						data: { size: '0', type: 'text/plain' },
						tags: [],
						block: null,
					},
				},
			}),
		})
	})
	await page.route(/^https:\/\/arweave\.net\/tx\/[A-E]{43}$/, async (route) => {
		const id = route.request().url().split('/').at(-1)
		if (id == null)
			throw new Error('missing transaction fixture ID')
		await route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify({
				format: 2,
				id,
				last_tx: '',
				owner: 'F'.repeat(43),
				tags: [],
				target: '',
				quantity: '0',
				data: '',
				data_size: '0',
				data_root: '',
				reward: '0',
				signature: 'signature',
			}),
		})
	})
	await page.route(/^https:\/\/arweave\.net\/tx\/[A-E]{43}\/status$/, async (route) => route.fulfill({
		contentType: 'application/json',
		body: JSON.stringify('Pending'),
	}))
	await page.route(/^https:\/\/arweave\.net\/tx\/[A-E]{43}\/offset$/, async (route) => route.fulfill({
		contentType: 'application/json',
		body: JSON.stringify({
			offset: '1',
			size: String(new TextEncoder().encode(manifest).byteLength),
		}),
	}))
	await page.route(/^https:\/\/arweave\.net\/raw\/[B-E]{43}$/, async (route) => route.fulfill({
		contentType: 'text/plain',
		body: 'not a manifest',
	}))
	await page.route(/^https:\/\/arweave\.net\/[B-E]{43}$/, async (route) => route.fulfill({
		contentType: 'text/plain',
		body: 'target resource',
	}))
	await page.route(`https://arweave.net/raw/${transactionId}`, async (route) => route.fulfill({
		contentType: 'application/x.arweave-manifest+json; charset=utf-8',
		body: manifest,
	}))
	await page.route(`https://arweave.net/${transactionId}`, async (route) => route.fulfill({
		contentType: 'text/plain',
		body: 'gateway-resolved root content, not a manifest',
	}))

	await page.goto(`/arweave/resource/${transactionId}`)

	await expect(page.getByText('0.2.0', { exact: true }).first()).toBeVisible({
		timeout: 30_000,
	}).catch((error: unknown) => {
		throw new Error(`${String(error)}\nProvider requests: ${providerRequests.join('\n')}\nPage errors: ${pageErrors.join('\n')}\nUnexpected requests: ${unexpectedRequests.join('\n')}`)
	})
	await expect(page.getByText('index.html', { exact: true }).first()).toBeVisible()
	await expect(page.getByText(`ar://${fallbackTransactionId}`, { exact: true }).first()).toBeAttached()
	await expect(page.getByText(`ar://${indexTransactionId}`, { exact: true }).first()).toBeAttached()
	await page.getByRole('link', { name: 'index.html', exact: true }).click()
	await expect(page).toHaveURL(`/arweave/resource/${transactionId}/manifest-path/index.html`)
	await expect(page.getByText(`ar://${pathTransactionId}`, { exact: true }).first()).toBeAttached()
	expect(pageErrors).toEqual([])
	expect(unexpectedRequests).toEqual([])
})
