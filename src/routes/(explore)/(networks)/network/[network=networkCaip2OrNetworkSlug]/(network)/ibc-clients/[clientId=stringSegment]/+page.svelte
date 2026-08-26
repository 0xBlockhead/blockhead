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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IbcClient, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcClientView from '$/views/IbcClientView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.clientId || 'IBC client')} • IBC client • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC client'} • IBC client • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IbcClientView
		selection={pageSelection}
	/>
	{/if}
</Page>
