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
			upgradeId: true,
			name: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'Ethereum execution upgrade' : [String((({ ...data.selector, ...pageSelection.entity }).upgradeId) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || 'Ethereum execution upgrade'))} • Ethereum execution upgrade • Blockhead</title>
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
