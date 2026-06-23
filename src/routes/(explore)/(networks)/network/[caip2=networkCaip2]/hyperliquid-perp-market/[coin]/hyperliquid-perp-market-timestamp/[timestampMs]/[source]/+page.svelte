<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidPerpMarket_TimestampView from '$/views/HyperliquidPerpMarket_TimestampView.svelte'
</script>


<Page>
	<HyperliquidPerpMarket_TimestampView
		selection={select(EntityType.HyperliquidPerpMarket_Timestamp, data.selector)}
	/>
</Page>
