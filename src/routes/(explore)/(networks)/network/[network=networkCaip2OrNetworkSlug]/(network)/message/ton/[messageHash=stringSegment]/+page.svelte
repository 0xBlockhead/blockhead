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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonMessage, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON message'} • TON message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON message'} • TON message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
