<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CurvePoolCoinView from '$/views/CurvePoolCoinView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CurvePoolCoin, {
				$pool: data.selector,
				coinAddress: params.coinAddress,
			}, {
				sources: [
					Source.Curve_Rest,
				],
				fields: {
					symbol: true,
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Curve pool coin' : [pageSelection.entity.symbol, pageSelection.entity.name].filter(Boolean).join(' ') || 'Curve pool coin')} • Curve pool coin • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Curve pool coin'} • Curve pool coin • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CurvePoolCoin, {
				$pool: data.selector,
				coinAddress: params.coinAddress,
			}, {
				sources: [
					Source.Curve_Rest,
				],
				fields: {
					symbol: true,
					name: true,
				},
			})}

	<CurvePoolCoinView
		selection={pageSelection}
	/>
	{/if}
</Page>
