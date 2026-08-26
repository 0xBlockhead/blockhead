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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoStakeCredential, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Cardano stake credential'} • Cardano stake credential • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano stake credential'} • Cardano stake credential • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoStakeCredentialView
		selection={pageSelection}
	/>
	{/if}
</Page>
