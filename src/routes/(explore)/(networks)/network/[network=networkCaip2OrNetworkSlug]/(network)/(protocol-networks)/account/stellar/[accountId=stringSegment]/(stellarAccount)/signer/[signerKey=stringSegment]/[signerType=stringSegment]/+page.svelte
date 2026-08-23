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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarAccountSigner, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarAccountSignerView from '$/views/StellarAccountSignerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar account signer'} • stellar account signer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar account signer'} • stellar account signer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarAccountSignerView
		selection={pageSelection}
	/>
	{/if}
</Page>
