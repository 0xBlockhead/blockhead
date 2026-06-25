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
	import BlockheadQuilibriumNodeState_TimestampView from '$/views/BlockheadQuilibriumNodeState_TimestampView.svelte'
</script>


<Page>
	<BlockheadQuilibriumNodeState_TimestampView
		selection={select(EntityType.BlockheadQuilibriumNodeState_Timestamp, data.selector)}
	/>
</Page>
