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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaNode, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNodeView from '$/views/HederaNodeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera node'} • hedera node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera node'} • hedera node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>
