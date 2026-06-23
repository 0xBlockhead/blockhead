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
	import HyperliquidTransaction_TimestampView from '$/views/HyperliquidTransaction_TimestampView.svelte'
</script>


<Page>
	<HyperliquidTransaction_TimestampView
		selection={select(EntityType.HyperliquidTransaction_Timestamp, data.selector)}
	/>
</Page>
