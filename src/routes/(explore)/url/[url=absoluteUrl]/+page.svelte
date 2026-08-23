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
	import UrlView from '$/views/UrlView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Url, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.url || 'URL')} • URL • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'URL'} • URL • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Url, data.selector)}

	<UrlView
		selection={pageSelection}
	/>
	{/if}
</Page>
