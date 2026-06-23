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
	import DydxChainOrder_TimestampView from '$/views/DydxChainOrder_TimestampView.svelte'
</script>


<Page>
	<DydxChainOrder_TimestampView
		selection={select(EntityType.DydxChainOrder_Timestamp, data.selector)}
	/>
</Page>
