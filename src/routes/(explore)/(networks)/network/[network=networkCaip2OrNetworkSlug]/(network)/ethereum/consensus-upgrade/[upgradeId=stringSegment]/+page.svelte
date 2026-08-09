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

	const pageSelection = $derived(select(EntityType.EthereumConsensusUpgrade, {
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
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.upgradeId ?? '') || 'Ethereum consensus upgrade' : pageSelection.entitySelector.upgradeId || pageSelection.entity.name || 'Ethereum consensus upgrade')} • Ethereum consensus upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumConsensusUpgradeView
		selection={pageSelection}
	/>
</Page>
