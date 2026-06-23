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
	import HyperliquidSpotPair_TimestampView from '$/views/HyperliquidSpotPair_TimestampView.svelte'
</script>


<Page>
	<HyperliquidSpotPair_TimestampView
		selection={select(EntityType.HyperliquidSpotPair_Timestamp, data.selector)}
	/>
</Page>
