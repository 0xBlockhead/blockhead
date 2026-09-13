<script lang="ts">
	import { protocolFeeShares, rawSpotPrice } from './uniswapPoolInterpretation.ts'


	let {
		sqrtPriceX96,
		liquidity,
		feeProtocol,
		observationCardinality,
	}: {
		sqrtPriceX96?: bigint | null,
		liquidity?: bigint | null,
		feeProtocol?: number | null,
		observationCardinality?: number | null,
	} = $props()
</script>


<section aria-label="Pool state interpretation" data-column="gap-2">

	{#if sqrtPriceX96 != null && sqrtPriceX96 > 0n}
		{@const price = rawSpotPrice(sqrtPriceX96)}
		<p>Spot ratio (raw token1/token0): {String(price.numerator)} / {String(price.denominator)}</p>
	{:else if sqrtPriceX96 === 0n}
		<p>Pool status: Uninitialized</p>
	{/if}

	{#if liquidity != null}
		<p>Active liquidity: {String(liquidity)}</p>
	{/if}

	{#if feeProtocol != null}
		{@const shares = protocolFeeShares(feeProtocol)}
		<p>Protocol fee share: token0 {shares.token0 === 0 ? 'off' : `1/${shares.token0}`}; token1 {shares.token1 === 0 ? 'off' : `1/${shares.token1}`}</p>
	{/if}

	{#if observationCardinality != null}
		<p>Oracle capacity: {observationCardinality} observations</p>
	{/if}

</section>
