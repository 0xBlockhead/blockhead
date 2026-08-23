<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoStakeCredential, data.selector))}
			<title>{data?.title ?? 'Cardano stake credential'} • Cardano stake credential • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano stake credential'} • Cardano stake credential • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoStakeCredential, data.selector))}

		<CardanoStakeCredentialView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
