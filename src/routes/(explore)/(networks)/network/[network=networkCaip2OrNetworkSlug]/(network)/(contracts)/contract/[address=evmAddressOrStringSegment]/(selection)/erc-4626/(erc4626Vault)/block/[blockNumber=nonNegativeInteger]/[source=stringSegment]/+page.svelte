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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4626Vault_BlockView from '$/views/Erc4626Vault_BlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Erc4626Vault_Block, {
				$vault: data.selector,
				blockNumber: Number(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.blockNumber) || 'erc4626 vault block')} • erc4626 vault block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'erc4626 vault block'} • erc4626 vault block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Erc4626Vault_Block, {
				$vault: data.selector,
				blockNumber: Number(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<Erc4626Vault_BlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
