import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'
import UniswapPoolInterpretation from './UniswapPoolInterpretation.svelte'

test('renders exact price units and independent protocol fee shares', async () => {
	await render(UniswapPoolInterpretation, {
		sqrtPriceX96: 2n ** 96n,
		liquidity: 100n,
		feeProtocol: 100,
		observationCardinality: 32,
	})
	await expect.element(page.getByText('Spot ratio (raw token1/token0):', { exact: false })).toHaveTextContent('1 / 1')
	await expect.element(page.getByText('Protocol fee share:', { exact: false })).toHaveTextContent('token0 1/4; token1 1/6')
	await expect.element(page.getByText('Oracle capacity:', { exact: false })).toHaveTextContent('32 observations')
})

test('distinguishes an uninitialized empty pool from missing observations', async () => {
	await render(UniswapPoolInterpretation, {
		sqrtPriceX96: 0n,
		liquidity: 0n,
		feeProtocol: 0,
	})
	await expect.element(page.getByText('Pool status: Uninitialized')).toBeVisible()
	await expect.element(page.getByText('Active liquidity: 0')).toBeVisible()
	await expect.element(page.getByText('Protocol fee share:', { exact: false })).toHaveTextContent('token0 off; token1 off')
	await expect.element(page.getByText('Spot ratio', { exact: false })).not.toBeInTheDocument()
})

test('does not turn unavailable observations into zero state', async () => {
	await render(UniswapPoolInterpretation)
	await expect.element(page.getByText('Pool status: Uninitialized')).not.toBeInTheDocument()
	await expect.element(page.getByText('Active liquidity:', { exact: false })).not.toBeInTheDocument()
	await expect.element(page.getByText('Protocol fee share:', { exact: false })).not.toBeInTheDocument()
})
