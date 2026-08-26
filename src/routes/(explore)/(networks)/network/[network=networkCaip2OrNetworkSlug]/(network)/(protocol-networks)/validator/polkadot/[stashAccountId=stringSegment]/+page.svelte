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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotValidator, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.stashAccountId || 'Polkadot validator')} • Polkadot validator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot validator'} • Polkadot validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotValidatorView
		selection={pageSelection}
	/>
	{/if}
</Page>
