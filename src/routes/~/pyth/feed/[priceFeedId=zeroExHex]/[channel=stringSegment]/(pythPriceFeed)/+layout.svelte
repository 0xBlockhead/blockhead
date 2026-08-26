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
			'/~/pyth/feed/[priceFeedId=zeroExHex]/[channel=stringSegment]',
			{
				priceFeedId: params.priceFeedId,
				channel: params.channel,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.PythPriceFeed, data.selector, {
		sources: [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<PythPriceFeedView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
