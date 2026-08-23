<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CosmosValidator_Timestamp, {
		$validator: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosValidator_TimestampView from '$/views/CosmosValidator_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.source || 'Cosmos validator timestamp')} • Cosmos validator timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cosmos validator timestamp'} • Cosmos validator timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CosmosValidator_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
