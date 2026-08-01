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

	const documentTitle = $derived(
		(
			data.entityType === EntityType.BeaconValidator ?
				((String(data.selector.indexInNetwork ?? '') ? 'Validator #' + String(data.selector.indexInNetwork ?? '') : '') || 'beacon validator') + ' • beacon validator • Blockhead'
			:
				(data.selector.votePubkey || 'solana validator') + ' • solana validator • Blockhead'
		)
	)
	const entityViewByType = {
		[EntityType.BeaconValidator]: BeaconValidatorView,
		[EntityType.SolanaValidator]: SolanaValidatorView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<svelte:head>
	<title>{documentTitle}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.BeaconValidator ?
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
		}
	/>
</Page>
