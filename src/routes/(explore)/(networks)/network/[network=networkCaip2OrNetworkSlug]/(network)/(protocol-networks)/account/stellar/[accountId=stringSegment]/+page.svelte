<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarAccount, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar account'} • stellar account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar account'} • stellar account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
