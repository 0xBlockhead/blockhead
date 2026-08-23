<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsRecordView from '$/views/EnsRecordView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EnsRecord, data.selector, {
				sources: [
					Source.TheGraph_Graphql,
					Source.Voltaire_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.recordKey || 'ENS record')} • ENS record • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ENS record'} • ENS record • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EnsRecord, data.selector, {
				sources: [
					Source.TheGraph_Graphql,
					Source.Voltaire_JsonRpc,
				],
			})}

	<EnsRecordView
		selection={pageSelection}
	/>
	{/if}
</Page>
