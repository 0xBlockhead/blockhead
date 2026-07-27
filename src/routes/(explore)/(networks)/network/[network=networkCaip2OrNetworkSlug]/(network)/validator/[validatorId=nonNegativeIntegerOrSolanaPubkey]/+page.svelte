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

	const pageSelection = $derived(
		(
			data.entityType === EntityType.BeaconValidator && data.selectorName === 'NetworkIndexInNetwork' ?
				select(EntityType.BeaconValidator, data.selector, {
					sources: [
						Source.Beacon_Rest,
					],
					fields: {
						status: true,
						slashed: true,
						balanceGwei: true,
						effectiveBalanceGwei: true,
						pubkey: true,
					},
				})
			:
				select(EntityType.SolanaValidator, data.selector)
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.BeaconValidator && data.selectorName === 'NetworkIndexInNetwork' ?
				((String(data.selector.indexInNetwork ?? '') ? 'Validator #' + String(data.selector.indexInNetwork ?? '') : '') || 'beacon validator')
			:
				(data.selector.votePubkey || 'solana validator')
		)
	)
	const entityViewByType = {
		[EntityType.BeaconValidator]: {
			Component: BeaconValidatorView,
			label: 'beacon validator',
		},
		[EntityType.SolanaValidator]: {
			Component: SolanaValidatorView,
			label: 'solana validator',
		},
	}

	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • {entityViewByType[data.entityType].label} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType].Component}

	<EntityView
		selection={pageSelection}
	/>
</Page>
