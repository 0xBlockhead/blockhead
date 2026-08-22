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

	const pageSelection = $derived(select(EntityType.GmxMarket, {
		$network: data.selector,
		marketTokenAddress: params.marketTokenAddress,
	}, {
		sources: [
			Source.Gmx_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GmxMarketView from '$/views/GmxMarketView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'GMX market' : pageSelection.entity.name || 'GMX market')} • GMX market • Blockhead</title>
</svelte:head>


<Page>
	<GmxMarketView
		selection={pageSelection}
	/>
</Page>
