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
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SwarmProtocol, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Swarm protocol' : pageSelection.entity.protocolName || 'Swarm protocol')} • Swarm protocol • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Swarm protocol'} • Swarm protocol • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SwarmProtocol, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
				},
			})}

	<SwarmProtocolView
		selection={pageSelection}
	/>
	{/if}
</Page>
