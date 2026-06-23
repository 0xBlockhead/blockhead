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
	import HyperliquidSpotAsset_TimestampView from '$/views/HyperliquidSpotAsset_TimestampView.svelte'
</script>


<Page>
	<HyperliquidSpotAsset_TimestampView
		selection={select(EntityType.HyperliquidSpotAsset_Timestamp, data.selector)}
	/>
</Page>
