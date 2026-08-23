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
	import HederaNodeView from '$/views/HederaNodeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaNode, data.selector)}
		<title>{data?.title ?? 'hedera node'} • hedera node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera node'} • hedera node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaNode, data.selector)}

	<HederaNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>
