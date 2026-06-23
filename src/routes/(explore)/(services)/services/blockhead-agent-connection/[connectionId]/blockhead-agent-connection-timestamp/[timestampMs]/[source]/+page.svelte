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
	import BlockheadAgentConnection_TimestampView from '$/views/BlockheadAgentConnection_TimestampView.svelte'
</script>


<Page>
	<BlockheadAgentConnection_TimestampView
		selection={select(EntityType.BlockheadAgentConnection_Timestamp, data.selector)}
	/>
</Page>
