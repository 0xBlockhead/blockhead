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
	import EasAttestation_TimestampView from '$/views/EasAttestation_TimestampView.svelte'
</script>


<Page>
	<EasAttestation_TimestampView
		selection={select(EntityType.EasAttestation_Timestamp, data.selector)}
	/>
</Page>
