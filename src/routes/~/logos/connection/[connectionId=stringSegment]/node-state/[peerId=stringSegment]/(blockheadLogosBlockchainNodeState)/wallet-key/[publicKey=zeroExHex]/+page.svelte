<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLogosBlockchainWalletKeyStateView from '$/views/BlockheadLogosBlockchainWalletKeyStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLogosBlockchainWalletKeyState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.LogosBlockchainNode_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'blockhead Logos blockchain wallet key state')} • blockhead Logos blockchain wallet key state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead Logos blockchain wallet key state'} • blockhead Logos blockchain wallet key state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLogosBlockchainWalletKeyState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.LogosBlockchainNode_Rest,
					],
				}))}

		<BlockheadLogosBlockchainWalletKeyStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
