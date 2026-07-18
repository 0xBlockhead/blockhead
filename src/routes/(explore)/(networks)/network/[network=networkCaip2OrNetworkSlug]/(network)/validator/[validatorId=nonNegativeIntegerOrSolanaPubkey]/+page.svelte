<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.BeaconValidator && data.selectorMapping.selectorName === 'NetworkIndexInNetwork' ? select(EntityType.BeaconValidator, data.selectorMapping.selector, {
		sources: [
			Source.Beacon_Rest,
		],
		fields: {
			status: true,
			slashed: true,
			balanceGwei: true,
			effectiveBalanceGwei: true,
		},
	}) : data.selectorMapping.entityType === EntityType.SolanaValidator && data.selectorMapping.selectorName === 'NetworkVotePubkey' ? select(EntityType.SolanaValidator, data.selectorMapping.selector) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.BeaconValidator && data.selectorMapping.selectorName === 'NetworkIndexInNetwork' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInNetwork) ?? '') ? 'Validator #' + String((pageSelection.entitySelector.indexInNetwork) ?? '') : '') || 'beacon validator' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInNetwork) ?? '') ? 'Validator #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInNetwork) ?? '') : '') || 'beacon validator') : data.selectorMapping.entityType === EntityType.SolanaValidator && data.selectorMapping.selectorName === 'NetworkVotePubkey' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.BeaconValidator && data.selectorMapping.selectorName === 'NetworkIndexInNetwork' ? 'beacon validator' : data.selectorMapping.entityType === EntityType.SolanaValidator && data.selectorMapping.selectorName === 'NetworkVotePubkey' ? 'solana validator' : 'Entity')

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
			resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
				network: params.network,
				validatorId: params.validatorId,
			})
		}
		selection={pageSelection}
	/>
</Page>
