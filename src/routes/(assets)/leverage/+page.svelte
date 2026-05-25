<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<Page>
	<section data-column="gap-4">
		<p>
			Leverage rows model concentrated-liquidity LP position accounting on Uniswap v3-style pools—tick range, in-range liquidity, uncollected fees, and optional ERC-721 token ids.
		</p>

		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				Not CEX margin, borrow APR, liquidation price, or perpetual funding. No position indexer is wired yet; detail routes accept position ids when a resolver maps them.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						This label “Leverage” follows the schema’s concentrated-liquidity position shape—the same fields as liquidity positions under accounts.
					</p>
					<p>
						Pool pair market stats live under liquidity pools (Dexscreener); on-chain LP NFT state requires an execution RPC or subgraph.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About leverage rows"
				>ⓘ</abbr>
			</Tooltip>
		</div>

		<p>
			<a href={resolve('/~/accounts/positions')}>Browse LP positions</a>
			<span data-text="muted"> (catalog empty until indexed)</span>
		</p>
	</section>
</Page>
