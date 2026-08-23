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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BalancerGauge, data.selector, {
		sources: [
			Source.Balancer_Rest,
		],
		fields: {
			poolSymbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerGaugeView from '$/views/BalancerGaugeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.gaugeAddress ?? '') || 'Balancer gauge' : [(pageSelection.entity.poolSymbol ?? ''), pageSelection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || 'Balancer gauge')} • Balancer gauge • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Balancer gauge'} • Balancer gauge • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BalancerGaugeView
		selection={pageSelection}
	/>
	{/if}
</Page>
