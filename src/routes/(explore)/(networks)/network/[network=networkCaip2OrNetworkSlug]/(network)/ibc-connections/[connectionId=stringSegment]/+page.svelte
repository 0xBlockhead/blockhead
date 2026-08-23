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
	import IbcConnectionView from '$/views/IbcConnectionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IbcConnection, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.connectionId || 'IBC connection')} • IBC connection • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC connection'} • IBC connection • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IbcConnection, data.selector)}

	<IbcConnectionView
		selection={pageSelection}
	/>
	{/if}
</Page>
