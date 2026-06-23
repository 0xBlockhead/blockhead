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
	import BlockheadRadicleNodeInventory_TimestampView from '$/views/BlockheadRadicleNodeInventory_TimestampView.svelte'
</script>


<Page>
	<BlockheadRadicleNodeInventory_TimestampView
		selection={select(EntityType.BlockheadRadicleNodeInventory_Timestamp, data.selector)}
	/>
</Page>
