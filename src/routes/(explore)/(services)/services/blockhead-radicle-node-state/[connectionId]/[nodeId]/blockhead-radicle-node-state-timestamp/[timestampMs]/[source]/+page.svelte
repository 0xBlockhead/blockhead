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
	import BlockheadRadicleNodeState_TimestampView from '$/views/BlockheadRadicleNodeState_TimestampView.svelte'
</script>


<Page>
	<BlockheadRadicleNodeState_TimestampView
		selection={select(EntityType.BlockheadRadicleNodeState_Timestamp, data.selector)}
	/>
</Page>
