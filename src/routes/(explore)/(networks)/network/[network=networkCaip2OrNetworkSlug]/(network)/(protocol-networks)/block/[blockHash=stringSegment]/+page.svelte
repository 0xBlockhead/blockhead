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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.KaspaBlock, data.selector, {
		sources: [
			Source.KaspaExplorer,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaBlockView from '$/views/KaspaBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'kaspa block'} • kaspa block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'kaspa block'} • kaspa block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<KaspaBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
