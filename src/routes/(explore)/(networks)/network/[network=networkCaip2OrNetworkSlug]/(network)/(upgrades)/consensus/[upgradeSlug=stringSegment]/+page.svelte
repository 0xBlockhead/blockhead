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
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EthereumConsensusUpgrade, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						upgradeId: true,
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Ethereum consensus upgrade' : pageSelection.entity.upgradeId || pageSelection.entity.name || 'Ethereum consensus upgrade')} • Ethereum consensus upgrade • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Ethereum consensus upgrade'} • Ethereum consensus upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EthereumConsensusUpgrade, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						upgradeId: true,
						name: true,
					},
				}))}

		<EthereumConsensusUpgradeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
