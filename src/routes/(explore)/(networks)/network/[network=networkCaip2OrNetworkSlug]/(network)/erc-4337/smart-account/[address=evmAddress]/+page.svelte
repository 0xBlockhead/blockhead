<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Erc4337SmartAccount, data.selector, {
		sources: [
			Source.Blockscout_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 smart account')} • ERC-4337 smart account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ERC-4337 smart account'} • ERC-4337 smart account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Erc4337SmartAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
