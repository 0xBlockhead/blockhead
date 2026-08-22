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

	const pageSelection = $derived(select(EntityType.BalancerGauge, data.selector, {
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
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.gaugeAddress ?? '') || 'Balancer gauge' : [(pageSelection.entity.poolSymbol ?? ''), pageSelection.entitySelector.gaugeAddress].filter(Boolean).join(' ') || 'Balancer gauge')} • Balancer gauge • Blockhead</title>
</svelte:head>


<Page>
	<BalancerGaugeView
		selection={pageSelection}
	/>
</Page>
