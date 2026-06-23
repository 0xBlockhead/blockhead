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
	import NetworkEndpointObservation_TimestampView from '$/views/NetworkEndpointObservation_TimestampView.svelte'
</script>


<Page>
	<NetworkEndpointObservation_TimestampView
		selection={select(EntityType.NetworkEndpointObservation_Timestamp, data.selector)}
	/>
</Page>
