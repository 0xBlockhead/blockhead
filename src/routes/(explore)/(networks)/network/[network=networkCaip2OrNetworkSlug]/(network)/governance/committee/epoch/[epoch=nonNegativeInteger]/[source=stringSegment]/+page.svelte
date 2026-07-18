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

	const pageSelection = $derived(select(EntityType.CardanoCommittee_Epoch, data.selector, {
		sources: [data.selector.source],
		fields: {
			memberCount: true,
			dissolved: true,
			govActionId: true,
			$seatingProposal: true,
			quorumNumerator: true,
			quorumDenominator: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [(String((pageSelection.entitySelector.epoch) ?? '') ? 'Epoch ' + String((pageSelection.entitySelector.epoch) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano committee epoch' : [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).epoch) ?? '') ? 'Epoch ' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).epoch) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano committee epoch')))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoCommittee_EpochView from '$/views/CardanoCommittee_EpochView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Cardano committee epoch • Blockhead</title>
</svelte:head>


<Page>
	<CardanoCommittee_EpochView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				epoch: params.epoch,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
