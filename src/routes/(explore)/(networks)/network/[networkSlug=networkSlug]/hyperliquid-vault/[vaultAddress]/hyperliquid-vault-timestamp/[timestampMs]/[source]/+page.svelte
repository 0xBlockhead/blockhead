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
	import HyperliquidVault_TimestampView from '$/views/HyperliquidVault_TimestampView.svelte'
</script>


<Page>
	<HyperliquidVault_TimestampView
		selection={select(EntityType.HyperliquidVault_Timestamp, data.selector)}
	/>
</Page>
