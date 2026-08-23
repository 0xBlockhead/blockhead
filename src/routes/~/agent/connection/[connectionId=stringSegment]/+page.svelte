<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadAgentConnection, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.connectionId || 'blockhead agent connection')} • blockhead agent connection • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead agent connection'} • blockhead agent connection • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadAgentConnection, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadAgentConnectionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
