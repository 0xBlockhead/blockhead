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
	import IbcClientView from '$/views/IbcClientView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IbcClient, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.clientId || 'IBC client')} • IBC client • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC client'} • IBC client • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IbcClient, data.selector)}

	<IbcClientView
		selection={pageSelection}
	/>
	{/if}
</Page>
