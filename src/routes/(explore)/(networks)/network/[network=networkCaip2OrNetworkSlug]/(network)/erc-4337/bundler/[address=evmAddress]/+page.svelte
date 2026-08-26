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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Erc4337Bundler, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 bundler')} • ERC-4337 bundler • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ERC-4337 bundler'} • ERC-4337 bundler • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Erc4337BundlerView
		selection={pageSelection}
	/>
	{/if}
</Page>
