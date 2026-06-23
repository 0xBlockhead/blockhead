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
	import HyperliquidNetwork_TimestampView from '$/views/HyperliquidNetwork_TimestampView.svelte'
</script>


<Page>
	<HyperliquidNetwork_TimestampView
		selection={select(EntityType.HyperliquidNetwork_Timestamp, data.selector)}
	/>
</Page>
