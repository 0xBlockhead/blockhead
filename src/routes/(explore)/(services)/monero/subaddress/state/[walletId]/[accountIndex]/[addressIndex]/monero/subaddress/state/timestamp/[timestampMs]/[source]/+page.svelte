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
	import BlockheadMoneroSubaddressState_TimestampView from '$/views/BlockheadMoneroSubaddressState_TimestampView.svelte'
</script>


<Page>
	<BlockheadMoneroSubaddressState_TimestampView
		selection={select(EntityType.BlockheadMoneroSubaddressState_Timestamp, data.selector)}
	/>
</Page>
