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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aAgentService, data.selector, {
				sources: [],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.endpointUrl || 'A2A agent service')} • A2A agent service • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A agent service'} • A2A agent service • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aAgentService, data.selector, {
				sources: [],
			})}

	<A2aAgentServiceView
		selection={pageSelection}
	/>
	{/if}
</Page>
