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
	import BlockheadMoneroOutputState_TimestampView from '$/views/BlockheadMoneroOutputState_TimestampView.svelte'
</script>


<Page>
	<BlockheadMoneroOutputState_TimestampView
		selection={select(EntityType.BlockheadMoneroOutputState_Timestamp, data.selector)}
	/>
</Page>
