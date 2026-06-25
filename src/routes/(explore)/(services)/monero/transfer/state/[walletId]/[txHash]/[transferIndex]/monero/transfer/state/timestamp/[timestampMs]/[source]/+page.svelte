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
	import BlockheadMoneroTransferState_TimestampView from '$/views/BlockheadMoneroTransferState_TimestampView.svelte'
</script>


<Page>
	<BlockheadMoneroTransferState_TimestampView
		selection={select(EntityType.BlockheadMoneroTransferState_Timestamp, data.selector)}
	/>
</Page>
