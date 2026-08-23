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
	import StellarAccountSignerView from '$/views/StellarAccountSignerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarAccountSigner, data.selector)}
		<title>{data?.title ?? 'stellar account signer'} • stellar account signer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar account signer'} • stellar account signer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarAccountSigner, data.selector)}

	<StellarAccountSignerView
		selection={pageSelection}
	/>
	{/if}
</Page>
