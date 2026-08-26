<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SwarmResource, data.selector, {
		sources: [
			Source.Swarm_Rest,
		],
		fields: {
			canonicalUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Swarm resource' : pageSelection.entity.canonicalUri || 'Swarm resource')} • Swarm resource • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Swarm resource'} • Swarm resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SwarmResourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
