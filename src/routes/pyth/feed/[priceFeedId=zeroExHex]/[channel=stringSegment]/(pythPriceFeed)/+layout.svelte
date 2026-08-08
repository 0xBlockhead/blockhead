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
			'/pyth/feed/[priceFeedId=zeroExHex]/[channel=stringSegment]',
			{
				priceFeedId: params.priceFeedId,
				channel: params.channel,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<PythPriceFeedView
			selection={
				select(EntityType.PythPriceFeed, data.selector, {
					sources: [
						Source.PythBenchmarks_Rest,
						Source.PythHermes_Rest,
						Source.Pyth_EvmContract,
						Source.Pyth_SolanaProgram,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
