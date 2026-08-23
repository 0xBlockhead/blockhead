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
	import OracleFeedView from '$/views/OracleFeedView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OracleFeed, data.selector, {
					fields: {
						label: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'oracle feed' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.address || 'oracle feed')} • oracle feed • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'oracle feed'} • oracle feed • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OracleFeed, data.selector, {
					fields: {
						label: true,
					},
				}))}

		<OracleFeedView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
