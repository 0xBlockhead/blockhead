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
	import HyperliquidOrder_TimestampView from '$/views/HyperliquidOrder_TimestampView.svelte'
</script>


<Page>
	<HyperliquidOrder_TimestampView
		selection={select(EntityType.HyperliquidOrder_Timestamp, data.selector)}
	/>
</Page>
