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
	import HyperliquidValidator_TimestampView from '$/views/HyperliquidValidator_TimestampView.svelte'
</script>


<Page>
	<HyperliquidValidator_TimestampView
		selection={select(EntityType.HyperliquidValidator_Timestamp, data.selector)}
	/>
</Page>
