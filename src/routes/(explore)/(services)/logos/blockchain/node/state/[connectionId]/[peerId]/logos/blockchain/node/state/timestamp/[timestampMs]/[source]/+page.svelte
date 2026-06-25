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
	import BlockheadLogosBlockchainNodeState_TimestampView from '$/views/BlockheadLogosBlockchainNodeState_TimestampView.svelte'
</script>


<Page>
	<BlockheadLogosBlockchainNodeState_TimestampView
		selection={select(EntityType.BlockheadLogosBlockchainNodeState_Timestamp, data.selector)}
	/>
</Page>
