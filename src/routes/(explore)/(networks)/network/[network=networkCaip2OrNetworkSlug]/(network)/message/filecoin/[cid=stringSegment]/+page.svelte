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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FilecoinMessage, data.selector, {
		sources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.cid || 'filecoin message')} • filecoin message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message'} • filecoin message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FilecoinMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
