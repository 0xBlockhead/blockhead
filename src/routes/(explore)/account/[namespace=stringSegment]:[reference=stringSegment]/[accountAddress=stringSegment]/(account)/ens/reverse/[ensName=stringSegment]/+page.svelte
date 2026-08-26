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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EnsReverseRecord, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsReverseRecordView from '$/views/EnsReverseRecordView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ENS reverse record'} • ENS reverse record • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ENS reverse record'} • ENS reverse record • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EnsReverseRecordView
		selection={pageSelection}
	/>
	{/if}
</Page>
