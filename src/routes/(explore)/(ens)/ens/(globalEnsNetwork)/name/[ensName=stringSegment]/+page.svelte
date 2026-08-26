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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EnsName, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.name || 'ENS name')} • ENS name • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ENS name'} • ENS name • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EnsNameView
		selection={pageSelection}
	/>
	{/if}
</Page>
