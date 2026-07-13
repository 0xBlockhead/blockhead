<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EthereumConsensusUpgrade, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
			previousForkVersion: true,
			currentForkVersion: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).upgradeId) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade')))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Ethereum consensus upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumConsensusUpgradeView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
				network: params.network,
				upgradeSlug: params.upgradeSlug,
			})
		}
		selection={pageSelection}
	/>
</Page>
