<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Erc4337SmartAccount, data.selector, {
				sources: [
					Source.Blockscout_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 smart account')} • ERC-4337 smart account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ERC-4337 smart account'} • ERC-4337 smart account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Erc4337SmartAccount, data.selector, {
				sources: [
					Source.Blockscout_Rest,
				],
			})}

	<Erc4337SmartAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
