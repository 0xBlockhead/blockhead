<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aArtifactView from '$/views/A2aArtifactView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aArtifact, data.selector, {
					sources: [],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.artifactId ?? '') || 'A2A artifact' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.artifactId || 'A2A artifact')} • A2A artifact • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'A2A artifact'} • A2A artifact • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aArtifact, data.selector, {
					sources: [],
					fields: {
						name: true,
					},
				}))}

		<A2aArtifactView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
