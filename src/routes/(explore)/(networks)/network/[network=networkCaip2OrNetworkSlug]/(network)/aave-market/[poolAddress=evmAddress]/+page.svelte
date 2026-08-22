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

	const pageSelection = $derived(select(EntityType.AaveMarket, data.selector, {
		sources: [
			Source.Aave_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AaveMarketView from '$/views/AaveMarketView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Aave market' : pageSelection.entity.name || 'Aave market')} • Aave market • Blockhead</title>
</svelte:head>


<Page>
	<AaveMarketView
		selection={pageSelection}
	/>
</Page>
