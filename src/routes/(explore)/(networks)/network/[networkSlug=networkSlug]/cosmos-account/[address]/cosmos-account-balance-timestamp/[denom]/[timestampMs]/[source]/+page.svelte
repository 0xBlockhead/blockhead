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
	import CosmosAccountBalance_TimestampView from '$/views/CosmosAccountBalance_TimestampView.svelte'
</script>


<Page>
	<CosmosAccountBalance_TimestampView
		selection={select(EntityType.CosmosAccountBalance_Timestamp, data.selector)}
	/>
</Page>
