<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aAgentService, data.selector, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.endpointUrl || 'A2A agent service')} • A2A agent service • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A agent service'} • A2A agent service • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aAgentServiceView
		selection={pageSelection}
	/>
	{/if}
</Page>
