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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EthereumExecutionUpgrade, data.selector, {
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
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Ethereum execution upgrade' : pageSelection.entity.upgradeId || pageSelection.entity.name || 'Ethereum execution upgrade')} • Ethereum execution upgrade • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Ethereum execution upgrade'} • Ethereum execution upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EthereumExecutionUpgradeView
		selection={pageSelection}
	/>
	{/if}
</Page>
