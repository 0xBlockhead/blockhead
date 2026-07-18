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

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Caip2' ? select(EntityType.Network, data.selectorMapping.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
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
	}) : data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Slug' ? select(EntityType.Network, data.selectorMapping.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
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
	}) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Caip2' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [pageSelection.entitySelector.caip2 == null ? '' : String((`${(pageSelection.entitySelector.caip2).namespace}:${(pageSelection.entitySelector.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [({ ...pageSelection.entitySelector, ...pageSelection.entity }).caip2 == null ? '' : String((`${(({ ...pageSelection.entitySelector, ...pageSelection.entity }).caip2).namespace}:${(({ ...pageSelection.entitySelector, ...pageSelection.entity }).caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network') : data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Slug' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [pageSelection.entitySelector.caip2 == null ? '' : String((`${(pageSelection.entitySelector.caip2).namespace}:${(pageSelection.entitySelector.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [({ ...pageSelection.entitySelector, ...pageSelection.entity }).caip2 == null ? '' : String((`${(({ ...pageSelection.entitySelector, ...pageSelection.entity }).caip2).namespace}:${(({ ...pageSelection.entitySelector, ...pageSelection.entity }).caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Caip2' ? 'Network' : data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Slug' ? 'Network' : 'Entity')

	// Components
	import Page from '$/components/Page.svelte'
	import { entityViewComponentByType } from '$/views/index.ts'
</script>


<svelte:head>
	<title>{pageEntityTitle} • {pageEntityTypeLabel} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]', {
				network: params.network,
			})
		}
		selection={pageSelection}
	/>
</Page>
