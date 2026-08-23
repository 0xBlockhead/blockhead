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
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SwarmResource, data.selector, {
					sources: [
						Source.Swarm_Rest,
					],
					fields: {
						canonicalUri: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Swarm resource' : pageSelection.entity.canonicalUri || 'Swarm resource')} • Swarm resource • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Swarm resource'} • Swarm resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SwarmResource, data.selector, {
					sources: [
						Source.Swarm_Rest,
					],
					fields: {
						canonicalUri: true,
					},
				}))}

		<SwarmResourceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
