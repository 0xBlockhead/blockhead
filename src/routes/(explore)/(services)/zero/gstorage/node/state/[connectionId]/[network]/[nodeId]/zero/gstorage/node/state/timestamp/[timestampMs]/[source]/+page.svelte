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
	import BlockheadZeroGStorageNodeState_TimestampView from '$/views/BlockheadZeroGStorageNodeState_TimestampView.svelte'
</script>


<Page>
	<BlockheadZeroGStorageNodeState_TimestampView
		selection={select(EntityType.BlockheadZeroGStorageNodeState_Timestamp, data.selector)}
	/>
</Page>
