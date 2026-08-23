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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CurvePoolView from '$/views/CurvePoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CurvePool, data.selector, {
				sources: [
					Source.Curve_Rest,
				],
				fields: {
					name: true,
					symbol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Curve pool' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Curve pool')} • Curve pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Curve pool'} • Curve pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CurvePool, data.selector, {
				sources: [
					Source.Curve_Rest,
				],
				fields: {
					name: true,
					symbol: true,
				},
			})}

	<CurvePoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
