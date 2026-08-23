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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadicleIdentityDocument, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleIdentityDocumentView from '$/views/RadicleIdentityDocumentView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle identity document'} • radicle identity document • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle identity document'} • radicle identity document • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadicleIdentityDocumentView
		selection={pageSelection}
	/>
	{/if}
</Page>
