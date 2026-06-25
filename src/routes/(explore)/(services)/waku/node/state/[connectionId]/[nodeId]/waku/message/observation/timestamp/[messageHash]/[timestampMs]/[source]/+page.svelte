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
	import BlockheadWakuMessageObservation_TimestampView from '$/views/BlockheadWakuMessageObservation_TimestampView.svelte'
</script>


<Page>
	<BlockheadWakuMessageObservation_TimestampView
		selection={select(EntityType.BlockheadWakuMessageObservation_Timestamp, data.selector)}
	/>
</Page>
