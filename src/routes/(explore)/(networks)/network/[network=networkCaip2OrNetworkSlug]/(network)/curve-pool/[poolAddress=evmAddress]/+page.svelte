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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CurvePool, data.selector, {
		sources: [
			Source.Curve_Rest,
		],
		fields: {
			name: true,
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CurvePoolView from '$/views/CurvePoolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Curve pool' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Curve pool')} • Curve pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Curve pool'} • Curve pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CurvePoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
