<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarTradeView from '$/views/StellarTradeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar trade'} • stellar trade • Blockhead</title>
</svelte:head>


<Page>
	<StellarTradeView
		selection={
			select(EntityType.StellarTrade, {
				$network: data.selector,
				tradeId: params.tradeId,
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
