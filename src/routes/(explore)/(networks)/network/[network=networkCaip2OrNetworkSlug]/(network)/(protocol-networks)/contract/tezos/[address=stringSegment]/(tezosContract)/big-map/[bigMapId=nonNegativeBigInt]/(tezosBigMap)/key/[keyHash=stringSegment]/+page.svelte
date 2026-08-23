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
	import TezosBigMapKeyView from '$/views/TezosBigMapKeyView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosBigMapKey, data.selector)}
		<title>{data?.title ?? 'tezos big map key'} • tezos big map key • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos big map key'} • tezos big map key • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosBigMapKey, data.selector)}

	<TezosBigMapKeyView
		selection={pageSelection}
	/>
	{/if}
</Page>
