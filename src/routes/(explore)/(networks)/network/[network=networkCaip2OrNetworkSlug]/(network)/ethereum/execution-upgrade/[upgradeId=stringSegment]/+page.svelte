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

	const pageSelection = $derived(select(EntityType.EthereumExecutionUpgrade, {
		$network: data.selector,
		upgradeId: params.upgradeId,
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.upgradeId ?? '') || 'Ethereum execution upgrade' : pageSelection.entitySelector.upgradeId || pageSelection.entity.name || 'Ethereum execution upgrade')} • Ethereum execution upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumExecutionUpgradeView
		selection={pageSelection}
	/>
</Page>
