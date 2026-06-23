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
	import HyperliquidAccount_TimestampView from '$/views/HyperliquidAccount_TimestampView.svelte'
</script>


<Page>
	<HyperliquidAccount_TimestampView
		selection={select(EntityType.HyperliquidAccount_Timestamp, data.selector)}
	/>
</Page>
