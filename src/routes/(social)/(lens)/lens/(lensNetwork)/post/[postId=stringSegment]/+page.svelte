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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LensPost, data.selector, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'Lens post' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'Lens post')} • Lens post • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lens post'} • Lens post • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LensPostView
		selection={pageSelection}
	/>
	{/if}
</Page>
