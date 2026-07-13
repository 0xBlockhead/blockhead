<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


{#key [params.chainId, params.poolId].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
				chainId: params.chainId,
				poolId: params.poolId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = LiquidityPoolView}

			<DetailView
				selection={select(EntityType.LiquidityPool, data.selector)}
				href={
					resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
						chainId: params.chainId,
						poolId: params.poolId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
