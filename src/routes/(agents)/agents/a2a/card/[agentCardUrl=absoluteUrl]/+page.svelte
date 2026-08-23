<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aAgentCard, data.selector, {
				sources: [
					Source.Eip8004Scan_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.agentCardUrl || 'A2A agent card')} • A2A agent card • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A agent card'} • A2A agent card • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aAgentCard, data.selector, {
				sources: [
					Source.Eip8004Scan_Rest,
				],
			})}

	<A2aAgentCardView
		selection={pageSelection}
	/>
	{/if}
</Page>
