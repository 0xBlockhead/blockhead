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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EthereumNetworkUpgrade, {
				$network: data.selector,
				upgradeId: params.upgradeId,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.upgradeId ?? '') || 'Ethereum network upgrade' : pageSelection.entitySelector.upgradeId || pageSelection.entity.name || 'Ethereum network upgrade')} • Ethereum network upgrade • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Ethereum network upgrade'} • Ethereum network upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EthereumNetworkUpgrade, {
				$network: data.selector,
				upgradeId: params.upgradeId,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					name: true,
				},
			})}

	<EthereumNetworkUpgradeView
		selection={pageSelection}
	/>
	{/if}
</Page>
