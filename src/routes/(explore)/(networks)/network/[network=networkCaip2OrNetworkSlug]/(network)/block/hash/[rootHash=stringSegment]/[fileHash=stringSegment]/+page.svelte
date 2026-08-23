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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonBlock, {
		$network: data.selector,
		rootHash: params.rootHash,
		fileHash: params.fileHash,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonBlockView from '$/views/TonBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON block'} • TON block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON block'} • TON block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
