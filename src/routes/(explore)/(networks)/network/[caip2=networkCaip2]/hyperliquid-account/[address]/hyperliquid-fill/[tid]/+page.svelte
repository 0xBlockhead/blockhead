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
	import HyperliquidFillView from '$/views/HyperliquidFillView.svelte'
</script>


<Page>
	<HyperliquidFillView
		selection={select(EntityType.HyperliquidFill, data.selector)}
	/>
</Page>
