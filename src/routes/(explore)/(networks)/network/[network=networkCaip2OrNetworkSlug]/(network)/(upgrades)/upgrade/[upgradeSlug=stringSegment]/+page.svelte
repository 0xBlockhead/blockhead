<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EthereumNetworkUpgrade, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			upgradeId: true,
			name: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
			$networkExecutionUpgrade: true,
			$networkConsensusUpgrade: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Ethereum network upgrade' : pageSelection.entity.upgradeId || pageSelection.entity.name || 'Ethereum network upgrade')} • Ethereum network upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumNetworkUpgradeView
		selection={pageSelection}
	/>
</Page>
