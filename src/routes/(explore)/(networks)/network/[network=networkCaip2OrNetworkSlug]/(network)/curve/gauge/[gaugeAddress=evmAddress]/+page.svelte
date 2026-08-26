<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CurveGauge, {
		$network: data.selector,
		gaugeAddress: params.gaugeAddress,
	}, {
		sources: [
			Source.Curve_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CurveGaugeView from '$/views/CurveGaugeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.gaugeAddress ?? '') || 'Curve gauge' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || 'Curve gauge')} • Curve gauge • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Curve gauge'} • Curve gauge • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CurveGaugeView
		selection={pageSelection}
	/>
	{/if}
</Page>
