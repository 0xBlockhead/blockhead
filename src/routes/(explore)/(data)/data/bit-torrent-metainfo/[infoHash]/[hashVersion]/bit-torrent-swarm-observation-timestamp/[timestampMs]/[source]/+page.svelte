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
	import BitTorrentSwarmObservation_TimestampView from '$/views/BitTorrentSwarmObservation_TimestampView.svelte'
</script>


<Page>
	<BitTorrentSwarmObservation_TimestampView
		selection={select(EntityType.BitTorrentSwarmObservation_Timestamp, data.selector)}
	/>
</Page>
