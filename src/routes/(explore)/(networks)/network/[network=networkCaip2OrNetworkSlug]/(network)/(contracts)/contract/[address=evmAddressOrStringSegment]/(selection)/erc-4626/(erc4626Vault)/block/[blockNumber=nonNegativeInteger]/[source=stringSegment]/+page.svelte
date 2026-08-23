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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Erc4626Vault_Block, {
		$vault: data.selector,
		blockNumber: Number(params.blockNumber),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4626Vault_BlockView from '$/views/Erc4626Vault_BlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.blockNumber) || 'erc4626 vault block')} • erc4626 vault block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'erc4626 vault block'} • erc4626 vault block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Erc4626Vault_BlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
