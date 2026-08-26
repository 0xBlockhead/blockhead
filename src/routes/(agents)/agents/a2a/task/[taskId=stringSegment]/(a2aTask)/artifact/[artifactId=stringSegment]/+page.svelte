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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aArtifact, data.selector, {
		sources: [],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aArtifactView from '$/views/A2aArtifactView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.artifactId ?? '') || 'A2A artifact' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.artifactId || 'A2A artifact')} • A2A artifact • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A artifact'} • A2A artifact • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aArtifactView
		selection={pageSelection}
	/>
	{/if}
</Page>
