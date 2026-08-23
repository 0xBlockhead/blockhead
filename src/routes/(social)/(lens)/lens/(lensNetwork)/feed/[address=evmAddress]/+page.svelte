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
	import LensFeedView from '$/views/LensFeedView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensFeed, data.selector, {
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'Lens feed' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.address].filter(Boolean).join(' ') || 'Lens feed')} • Lens feed • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lens feed'} • Lens feed • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensFeed, data.selector, {
				fields: {
					name: true,
				},
			})}

	<LensFeedView
		selection={pageSelection}
	/>
	{/if}
</Page>
