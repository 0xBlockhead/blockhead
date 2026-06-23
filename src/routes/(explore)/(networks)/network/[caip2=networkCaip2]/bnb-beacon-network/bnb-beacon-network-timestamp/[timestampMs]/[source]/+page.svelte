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
	import BnbBeaconNetwork_TimestampView from '$/views/BnbBeaconNetwork_TimestampView.svelte'
</script>


<Page>
	<BnbBeaconNetwork_TimestampView
		selection={select(EntityType.BnbBeaconNetwork_Timestamp, data.selector)}
	/>
</Page>
