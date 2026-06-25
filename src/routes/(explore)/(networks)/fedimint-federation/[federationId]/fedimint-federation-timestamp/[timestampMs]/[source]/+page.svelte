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
	import FedimintFederation_TimestampView from '$/views/FedimintFederation_TimestampView.svelte'
</script>


<Page>
	<FedimintFederation_TimestampView
		selection={select(EntityType.FedimintFederation_Timestamp, data.selector)}
	/>
</Page>
