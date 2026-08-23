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
	import MagnetLinkView from '$/views/MagnetLinkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MagnetLink, data.selector, {
				fields: {
					displayName: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.magnetUri ?? '') || 'magnet link' : (pageSelection.entity.displayName ?? '') || pageSelection.entitySelector.magnetUri || 'magnet link')} • magnet link • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'magnet link'} • magnet link • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MagnetLink, data.selector, {
				fields: {
					displayName: true,
				},
			})}

	<MagnetLinkView
		selection={pageSelection}
	/>
	{/if}
</Page>
