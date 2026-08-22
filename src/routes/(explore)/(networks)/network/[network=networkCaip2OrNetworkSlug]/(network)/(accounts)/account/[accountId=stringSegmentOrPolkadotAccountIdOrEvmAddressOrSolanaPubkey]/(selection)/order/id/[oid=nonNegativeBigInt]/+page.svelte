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
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hyperliquid order'} • hyperliquid order • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidOrderView
		selection={
			select(EntityType.HyperliquidOrder, {
				$account: data.selector,
				oid: BigInt(params.oid),
			})
		}
	/>
</Page>
