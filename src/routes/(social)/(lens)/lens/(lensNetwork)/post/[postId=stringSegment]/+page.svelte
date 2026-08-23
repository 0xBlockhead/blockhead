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
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LensPost, data.selector, {
					sources: [
						Source.Lens_Graphql,
					],
					fields: {
						text: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'Lens post' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'Lens post')} • Lens post • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Lens post'} • Lens post • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LensPost, data.selector, {
					sources: [
						Source.Lens_Graphql,
					],
					fields: {
						text: true,
					},
				}))}

		<LensPostView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
