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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBigMapKey, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBigMapKeyView from '$/views/TezosBigMapKeyView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos big map key'} • tezos big map key • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos big map key'} • tezos big map key • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosBigMapKeyView
		selection={pageSelection}
	/>
	{/if}
</Page>
