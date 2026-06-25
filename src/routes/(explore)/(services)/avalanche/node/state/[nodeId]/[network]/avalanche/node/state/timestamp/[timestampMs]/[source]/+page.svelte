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
	import BlockheadAvalancheNodeState_TimestampView from '$/views/BlockheadAvalancheNodeState_TimestampView.svelte'
</script>


<Page>
	<BlockheadAvalancheNodeState_TimestampView
		selection={select(EntityType.BlockheadAvalancheNodeState_Timestamp, data.selector)}
	/>
</Page>
