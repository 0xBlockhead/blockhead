<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
			{
				chainId: params.chainId,
				poolId: params.poolId,
				blockSelector: params.blockSelector,
				sourceRevision: params.sourceRevision,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.LiquidityPool_Amm_EvmBlock, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import LiquidityPool_Amm_EvmBlockView from '$/views/LiquidityPool_Amm_EvmBlockView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<LiquidityPool_Amm_EvmBlockView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
