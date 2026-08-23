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
	import GitForgeReleaseView from '$/views/GitForgeReleaseView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeRelease, data.selector, {
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.releaseTagName ?? '') || 'Git forge release' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.releaseTagName || 'Git forge release')} • Git forge release • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git forge release'} • Git forge release • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeRelease, data.selector, {
					fields: {
						name: true,
					},
				}))}

		<GitForgeReleaseView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
