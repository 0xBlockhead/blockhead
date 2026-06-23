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
	import CosmosNetwork_TimestampView from '$/views/CosmosNetwork_TimestampView.svelte'
</script>


<Page>
	<CosmosNetwork_TimestampView
		selection={select(EntityType.CosmosNetwork_Timestamp, data.selector)}
	/>
</Page>
