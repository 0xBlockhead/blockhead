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
	import BlockheadWakuNodeState_TimestampView from '$/views/BlockheadWakuNodeState_TimestampView.svelte'
</script>


<Page>
	<BlockheadWakuNodeState_TimestampView
		selection={select(EntityType.BlockheadWakuNodeState_Timestamp, data.selector)}
	/>
</Page>
