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
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Erc4337Bundler, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 bundler')} • ERC-4337 bundler • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ERC-4337 bundler'} • ERC-4337 bundler • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Erc4337Bundler, data.selector))}

		<Erc4337BundlerView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
