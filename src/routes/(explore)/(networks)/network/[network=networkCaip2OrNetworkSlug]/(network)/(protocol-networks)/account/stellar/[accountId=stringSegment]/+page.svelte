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
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarAccount, data.selector)}
		<title>{data?.title ?? 'stellar account'} • stellar account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar account'} • stellar account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarAccount, data.selector)}

	<StellarAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
