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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MagnetLink, data.selector, {
		fields: {
			displayName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MagnetLinkView from '$/views/MagnetLinkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.magnetUri ?? '') || 'magnet link' : (pageSelection.entity.displayName ?? '') || pageSelection.entitySelector.magnetUri || 'magnet link')} • magnet link • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'magnet link'} • magnet link • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MagnetLinkView
		selection={pageSelection}
	/>
	{/if}
</Page>
