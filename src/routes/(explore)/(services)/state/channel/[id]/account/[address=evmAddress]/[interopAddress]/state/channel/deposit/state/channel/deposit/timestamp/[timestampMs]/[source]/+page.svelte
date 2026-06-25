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
	import BlockheadStateChannelDeposit_TimestampView from '$/views/BlockheadStateChannelDeposit_TimestampView.svelte'
</script>


<Page>
	<BlockheadStateChannelDeposit_TimestampView
		selection={select(EntityType.BlockheadStateChannelDeposit_Timestamp, data.selector)}
	/>
</Page>
