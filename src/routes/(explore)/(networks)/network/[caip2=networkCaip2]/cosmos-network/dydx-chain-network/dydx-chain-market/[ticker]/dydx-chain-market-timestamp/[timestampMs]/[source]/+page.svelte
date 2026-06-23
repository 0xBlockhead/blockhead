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
	import DydxChainMarket_TimestampView from '$/views/DydxChainMarket_TimestampView.svelte'
</script>


<Page>
	<DydxChainMarket_TimestampView
		selection={select(EntityType.DydxChainMarket_Timestamp, data.selector)}
	/>
</Page>
