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
	import BlockheadIntentOrder_TimestampView from '$/views/BlockheadIntentOrder_TimestampView.svelte'
</script>


<Page>
	<BlockheadIntentOrder_TimestampView
		selection={select(EntityType.BlockheadIntentOrder_Timestamp, data.selector)}
	/>
</Page>
