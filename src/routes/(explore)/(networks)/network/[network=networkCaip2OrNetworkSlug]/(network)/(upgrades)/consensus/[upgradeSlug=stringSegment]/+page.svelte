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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EthereumConsensusUpgrade, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			upgradeId: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Ethereum consensus upgrade' : pageSelection.entity.upgradeId || pageSelection.entity.name || 'Ethereum consensus upgrade')} • Ethereum consensus upgrade • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Ethereum consensus upgrade'} • Ethereum consensus upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EthereumConsensusUpgradeView
		selection={pageSelection}
	/>
	{/if}
</Page>
