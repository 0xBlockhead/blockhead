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
	import BlockheadRadicleSeedObservation_TimestampView from '$/views/BlockheadRadicleSeedObservation_TimestampView.svelte'
</script>


<Page>
	<BlockheadRadicleSeedObservation_TimestampView
		selection={select(EntityType.BlockheadRadicleSeedObservation_Timestamp, data.selector)}
	/>
</Page>
