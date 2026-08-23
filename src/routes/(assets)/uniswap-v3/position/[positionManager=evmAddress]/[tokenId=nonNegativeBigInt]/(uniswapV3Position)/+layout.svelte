<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]',
			{
				positionManager: params.positionManager,
				tokenId: params.tokenId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import UniswapV3PositionView from '$/views/UniswapV3PositionView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<UniswapV3PositionView
				selection={
					select(EntityType.UniswapV3Position, data.selector, {
						sources: [
							Source.Voltaire_JsonRpc,
							Source.UniswapContracts_Evm,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
