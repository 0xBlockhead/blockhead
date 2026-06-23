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
	import HyperliquidOrderbook_TimestampView from '$/views/HyperliquidOrderbook_TimestampView.svelte'
</script>


<Page>
	<HyperliquidOrderbook_TimestampView
		selection={select(EntityType.HyperliquidOrderbook_Timestamp, data.selector)}
	/>
</Page>
