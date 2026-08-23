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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBigMapDiff, {
		$operation: data.selector,
		bigMapId: BigInt(params.bigMapId),
		keyHash: params.keyHash,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBigMapDiffView from '$/views/TezosBigMapDiffView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos big map diff'} • tezos big map diff • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos big map diff'} • tezos big map diff • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosBigMapDiffView
		selection={pageSelection}
	/>
	{/if}
</Page>
