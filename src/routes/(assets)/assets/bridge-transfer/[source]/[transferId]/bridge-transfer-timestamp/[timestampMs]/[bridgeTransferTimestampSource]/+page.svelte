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
	import BridgeTransfer_TimestampView from '$/views/BridgeTransfer_TimestampView.svelte'
</script>


<Page>
	<BridgeTransfer_TimestampView
		selection={select(EntityType.BridgeTransfer_Timestamp, data.selector)}
	/>
</Page>
