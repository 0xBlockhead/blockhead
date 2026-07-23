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

	const pageSelection = $derived(data.entityType === EntityType.BeaconValidator && data.selectorName === 'NetworkIndexInNetwork' ? select(EntityType.BeaconValidator, data.selector, {
		sources: [
			Source.Beacon_Rest,
		],
		fields: {
			pubkey: true,
			status: true,
			slashed: true,
			balanceGwei: true,
			effectiveBalanceGwei: true,
		},
	}) : select(EntityType.SolanaValidator, data.selector))
	const entityViewComponentByType = {
		[EntityType.BeaconValidator]: BeaconValidatorView,
		[EntityType.SolanaValidator]: SolanaValidatorView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.BeaconValidator && data.selectorName === 'NetworkIndexInNetwork' ? (pageSelection.entity == null ? (String((data.selector.indexInNetwork) ?? '') ? 'Validator #' + String((data.selector.indexInNetwork) ?? '') : '') || 'beacon validator' : (String((({ ...data.selector, ...pageSelection.entity }).indexInNetwork) ?? '') ? 'Validator #' + String((({ ...data.selector, ...pageSelection.entity }).indexInNetwork) ?? '') : '') || 'beacon validator') : (pageSelection.entity == null ? [String((data.selector.votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator' : [String((({ ...data.selector, ...pageSelection.entity }).votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator')} • {data.entityType === EntityType.BeaconValidator && data.selectorName === 'NetworkIndexInNetwork' ? 'beacon validator' : 'solana validator'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

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
