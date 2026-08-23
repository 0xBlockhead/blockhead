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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiDocument, {
		documentKind: params.documentKind,
		$artifact: data.selector,
	}, {
		sources: [
			Source.Eip8004Scan_Rest,
			Source.HuggingFaceHub_Rest,
			Source.Ipfs_Rest,
			Source.Mlflow_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiDocumentView from '$/views/AiDocumentView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.documentKind || 'AI document')} • AI document • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI document'} • AI document • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AiDocumentView
		selection={pageSelection}
	/>
	{/if}
</Page>
