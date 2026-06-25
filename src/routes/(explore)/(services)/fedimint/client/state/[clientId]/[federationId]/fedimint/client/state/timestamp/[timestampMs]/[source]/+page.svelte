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
	import BlockheadFedimintClientState_TimestampView from '$/views/BlockheadFedimintClientState_TimestampView.svelte'
</script>


<Page>
	<BlockheadFedimintClientState_TimestampView
		selection={select(EntityType.BlockheadFedimintClientState_Timestamp, data.selector)}
	/>
</Page>
