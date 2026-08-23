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
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Erc4626Vault, data.selector, {
					sources: [
						Source.Blockscout_Rest,
						Source.Defillama_Rest,
						Source.Etherscan_Rest,
						Source.Sourcify_Rest,
						Source.Voltaire_JsonRpc,
					],
					fields: {
						name: true,
						symbol: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'erc4626 vault' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.symbol ?? '')].filter(Boolean).join(' ') || 'erc4626 vault')} • erc4626 vault • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'erc4626 vault'} • erc4626 vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Erc4626Vault, data.selector, {
					sources: [
						Source.Blockscout_Rest,
						Source.Defillama_Rest,
						Source.Etherscan_Rest,
						Source.Sourcify_Rest,
						Source.Voltaire_JsonRpc,
					],
					fields: {
						name: true,
						symbol: true,
					},
				}))}

		<Erc4626VaultView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
