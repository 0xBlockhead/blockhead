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
	import HederaTopicView from '$/views/HederaTopicView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTopic, data.selector)}
		<title>{data?.title ?? 'hedera topic'} • hedera topic • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera topic'} • hedera topic • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTopic, data.selector)}

	<HederaTopicView
		selection={pageSelection}
	/>
	{/if}
</Page>
