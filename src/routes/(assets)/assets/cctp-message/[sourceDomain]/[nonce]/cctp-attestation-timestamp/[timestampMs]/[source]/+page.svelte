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
	import CctpAttestation_TimestampView from '$/views/CctpAttestation_TimestampView.svelte'
</script>


<Page>
	<CctpAttestation_TimestampView
		selection={select(EntityType.CctpAttestation_Timestamp, data.selector)}
	/>
</Page>
