<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.entityType === EntityType.Network && data.selectorName === 'Caip2' ? select(EntityType.Network, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			slug: true,
			$icon: true,
			name: true,
			namespace: true,
			ledgerModels: true,
			executionModels: true,
			$networkStack: true,
			environment: true,
			Evm: {
				fields: {
					consensusProtocol: true,
					registryStatus: true,
					shortName: true,
					peeringId: true,
					slip44: true,
					$nativeCoinInstance: true,
					$nativeCoin: true,
					$parent: true,
					$mainnet: true,
				},
			},
			ZeroG: {
				fields: {
					chainId: true,
				},
			},
			Lightning: {
				fields: {
					$settlementNetwork: true,
				},
			},
			Hedera: {
				fields: {
					shard: true,
					realm: true,
				},
			},
		},
	}) : select(EntityType.Network, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			caip2: true,
			$icon: true,
			name: true,
			namespace: true,
			ledgerModels: true,
			executionModels: true,
			$networkStack: true,
			environment: true,
			Evm: {
				fields: {
					consensusProtocol: true,
					registryStatus: true,
					shortName: true,
					peeringId: true,
					slip44: true,
					$nativeCoinInstance: true,
					$nativeCoin: true,
					$parent: true,
					$mainnet: true,
				},
			},
			ZeroG: {
				fields: {
					chainId: true,
				},
			},
			Lightning: {
				fields: {
					$settlementNetwork: true,
				},
			},
			Hedera: {
				fields: {
					shard: true,
					realm: true,
				},
			},
		},
	}))
	const entityViewComponentByType = {
		[EntityType.Network]: NetworkView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.Network && data.selectorName === 'Caip2' ? (pageSelection.entity == null ? [data.selector.caip2 == null ? '' : String(`${(data.selector.caip2).namespace}:${(data.selector.caip2).reference}`)].filter(Boolean).join(' ') || 'Network' : [String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [({ ...data.selector, ...pageSelection.entity }).caip2 == null ? '' : String(`${(({ ...data.selector, ...pageSelection.entity }).caip2).namespace}:${(({ ...data.selector, ...pageSelection.entity }).caip2).reference}`)].filter(Boolean).join(' ') || 'Network') : (pageSelection.entity == null ? 'Network' : [String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [({ ...data.selector, ...pageSelection.entity }).caip2 == null ? '' : String(`${(({ ...data.selector, ...pageSelection.entity }).caip2).namespace}:${(({ ...data.selector, ...pageSelection.entity }).caip2).reference}`)].filter(Boolean).join(' ') || 'Network')} • Network • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]', {
				network: params.network,
			})
		}
		selection={pageSelection}
	/>
</Page>
