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

	const pageSelection = $derived(select(EntityType.EthereumConsensusUpgrade, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			upgradeId: true,
			name: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
			previousForkVersion: true,
			currentForkVersion: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Ethereum consensus upgrade' : pageSelection.entity.upgradeId || pageSelection.entity.name || 'Ethereum consensus upgrade')} • Ethereum consensus upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumConsensusUpgradeView
		selection={pageSelection}
	/>
</Page>
