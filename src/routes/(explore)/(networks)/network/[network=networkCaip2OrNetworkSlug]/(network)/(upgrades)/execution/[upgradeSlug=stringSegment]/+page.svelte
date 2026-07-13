<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ExecutionProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EthereumExecutionUpgrade, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum execution upgrade' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).upgradeId) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || 'Ethereum execution upgrade')))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Ethereum execution upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumExecutionUpgradeView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
				network: params.network,
				upgradeSlug: params.upgradeSlug,
			})
		}
		selection={pageSelection}
	/>
</Page>
