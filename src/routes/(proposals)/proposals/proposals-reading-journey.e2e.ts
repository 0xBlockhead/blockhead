import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'


const attach = { timeout: 120_000 }
const proposalPath = '/proposals/ethereum/eip/EIP-1559'
const contentsUrl = 'https://api.github.com/repos/ethereum/EIPs/contents/EIPS?ref=master'
const markdownUrl = 'https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1559.md'
const ethereumEipsBinding = sourceProviderDefinitions
	.find(({ provider }) => provider === SourceProvider.EthereumEips)
	?.bindings.find(({ target }) => (
		target.kind === SourceTargetKind.GitRepository
		&& target.key === 'ethereum/EIPs@master:EIPS'
	))
if (ethereumEipsBinding?.proxyId == null)
	throw new Error('Ethereum EIPs Git repository proxy binding is missing')

const githubApiEndpointIndex = ethereumEipsBinding.endpoints
	.findIndex(({ origin }) => origin === 'https://api.github.com')
const githubRawEndpointIndex = ethereumEipsBinding.endpoints
	.findIndex(({ origin }) => origin === 'https://raw.githubusercontent.com')
if (
	githubApiEndpointIndex < 0
	|| githubRawEndpointIndex < 0
)
	throw new Error('Ethereum EIPs Git repository endpoints are missing')

const proposalMarkdown = [
	'---',
	'eip: 1559',
	'title: Fee market change for ETH 1.0 chain',
	'status: Final',
	'category: Core',
	'---',
	'',
	'# Abstract',
	'',
	'This deterministic fixture introduces a base fee that adjusts with network demand.',
	'',
	'## Motivation',
	'',
	'Wallets can provide more predictable transaction fee estimates.',
].join('\n')

const getProposalCard = (page: Page) => page.locator('#main article').filter({
	has: page.getByRole('heading', {
		name: 'EIP-1559: Fee market change for ETH 1.0 chain',
		exact: true,
	}),
}).first()

const installEthereumProposalFixtures = async (
	page: Page,
	markdownResponse: {
		body: string
		status: number
	} = {
		body: proposalMarkdown,
		status: 200,
	}
) => {
	const requests: {
		contents: number
		markdown: number
		unexpected: string[]
	} = {
		contents: 0,
		markdown: 0,
		unexpected: [],
	}
	await page.route(
		(url) => decodeURIComponent(url.href).includes('ethereum/EIPs'),
		(route) => {
			const request = route.request()
			const decodedUrl = decodeURIComponent(request.url())
			if (
				request.method() === 'GET'
				&& decodedUrl.endsWith(`/api-proxy/${ethereumEipsBinding.proxyId}/${githubApiEndpointIndex}/${contentsUrl}`)
			) {
				requests.contents += 1
				return route.fulfill({
					contentType: 'application/json',
					json: [
						{
							type: 'file',
							name: 'eip-1559.md',
						},
					],
				})
			}
			if (
				request.method() === 'GET'
				&& decodedUrl.endsWith(`/api-proxy/${ethereumEipsBinding.proxyId}/${githubRawEndpointIndex}/${markdownUrl}`)
			) {
				requests.markdown += 1
				return route.fulfill({
					body: markdownResponse.body,
					contentType: 'text/markdown',
					status: markdownResponse.status,
				})
			}

			requests.unexpected.push(`${request.method()} ${decodedUrl}`)
			return route.fulfill({
				body: 'Unexpected Ethereum proposal fixture request',
				status: 418,
			})
		}
	)

	return requests
}

test.describe('proposal catalog journey', () => {
	test('proposal discovery follows realm and kind hierarchy', async ({ page }, testInfo) => {
		testInfo.setTimeout(300_000)
		const fixtureRequests = await installEthereumProposalFixtures(page)

		await page.goto('/proposals', { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#nav-menu a[href="/proposals"]')).toBeVisible(attach)
		await expect(page.locator('#specification-realms')).toBeVisible(attach)

		const ethereumRealm = page.locator('#main #specification-realms a[href="/proposals/ethereum"]')
		await expect(ethereumRealm).toBeVisible(attach)
		await expect(ethereumRealm).toContainText('Ethereum')
		await ethereumRealm.click()
		await expect(page).toHaveURL(/\/proposals\/ethereum\/?$/)
		await expect(page.getByRole('heading', { name: 'Ethereum' }).first()).toBeVisible(attach)

		const eipKind = page.locator('#main').getByRole('link', {
			name: 'EIPs',
			exact: true,
		})
		await expect(eipKind).toBeVisible(attach)
		await expect(eipKind).toContainText('EIPs')
		await eipKind.click()
		await expect(page).toHaveURL(/\/proposals\/ethereum\/eip\/?$/)
		await expect(page.getByRole('heading', { name: 'EIPs' }).first()).toBeVisible(attach)

		const proposalLink = page.locator('#main').getByRole('link', {
			name: 'EIP-1559',
			exact: true,
		})
		await expect(proposalLink).toBeVisible(attach)
		await expect(proposalLink).toContainText('EIP-1559')
		await expect(proposalLink).toHaveAttribute('href', proposalPath)
		await proposalLink.click()
		await expect(page).toHaveURL((url) => url.pathname === proposalPath)

		const proposal = getProposalCard(page)
		await expect(proposal).toBeVisible(attach)
		await expect(proposal.getByText('EIP-1559: Fee market change for ETH 1.0 chain', { exact: true }).first()).toBeVisible(attach)
		expect(fixtureRequests.contents).toBeGreaterThan(0)
		expect(fixtureRequests.markdown).toBeGreaterThan(0)
		expect(fixtureRequests.unexpected).toEqual([])
	})

	test('reading position preserves proposal identity and document context', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const fixtureRequests = await installEthereumProposalFixtures(page)

		await page.goto(proposalPath, { waitUntil: 'domcontentloaded' })
		await expect(page).toHaveURL((url) => url.pathname === proposalPath)

		const proposal = getProposalCard(page)
		await expect(proposal).toBeVisible(attach)
		await expect(proposal.getByText('EIP-1559: Fee market change for ETH 1.0 chain', { exact: true }).first()).toBeVisible(attach)
		await expect(proposal.getByText('Status', { exact: true })).toBeVisible(attach)
		await expect(proposal.getByText('Final', { exact: true })).toBeVisible(attach)
		await expect(proposal.getByRole('link', { name: 'Ethereum', exact: true })).toHaveAttribute('href', '/proposals/ethereum')
		await expect(proposal.getByRole('link', { name: 'EIP', exact: true })).toHaveAttribute('href', '/proposals/ethereum/eip')

		const documentBody = proposal.locator('[data-scroll-marker-label="Document body"]')
		await expect(documentBody.getByRole('heading', { name: 'Document body' })).toBeVisible(attach)
		await expect(documentBody.getByRole('heading', { name: 'Abstract' })).toBeVisible(attach)
		await expect(documentBody.getByText('This deterministic fixture introduces a base fee that adjusts with network demand.')).toBeVisible(attach)
		await expect(documentBody).not.toContainText('[object Object]')
		await expect(documentBody.locator('pre').filter({ hasText: /^\s*\{/ })).toHaveCount(0)
		expect(fixtureRequests.markdown).toBeGreaterThan(0)
		expect(fixtureRequests.unexpected).toEqual([])
	})

	test('governance capability absence is explicit and does not invent controls', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const fixtureRequests = await installEthereumProposalFixtures(page)

		await page.goto(proposalPath, { waitUntil: 'domcontentloaded' })

		const proposal = getProposalCard(page)
		await expect(proposal).toBeVisible(attach)
		const typeAnnotation = proposal.locator('.tooltip-trigger').filter({
			hasText: 'Specification proposal',
		})
		await typeAnnotation.focus()
		await expect(proposal.getByText(
			'Catalog entries capture stewarded specification text and lifecycle status; live vote weights and treasury execution are tracked in governance systems on-chain or in forums.',
			{ exact: true }
		)).toBeVisible(attach)
		await expect(proposal.getByRole('button', { name: /vote|deposit|execute/i })).toHaveCount(0)
		await expect(proposal.getByText(/vote tally|deposit required|connect wallet to vote/i)).toHaveCount(0)
		expect(fixtureRequests.unexpected).toEqual([])
	})
})
