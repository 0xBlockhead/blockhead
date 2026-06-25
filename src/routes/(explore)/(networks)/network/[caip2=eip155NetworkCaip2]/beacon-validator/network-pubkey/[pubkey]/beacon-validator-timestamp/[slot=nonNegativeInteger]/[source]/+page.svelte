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
	import BeaconValidator_TimestampView from '$/views/BeaconValidator_TimestampView.svelte'
</script>


<Page>
	<BeaconValidator_TimestampView
		selection={select(EntityType.BeaconValidator_Timestamp, data.selector)}
	/>
</Page>
