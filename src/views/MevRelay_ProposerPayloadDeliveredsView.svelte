<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MevRelay_ProposerPayloadDelivered> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				value: true,
				$builder: true,
			},
		})
	}
>
	{#snippet Item({ item: mevRelayProposerPayloadDelivered })}
		{@const mevRelayProposerPayloadDeliveredSelector = mevRelayProposerPayloadDelivered[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MevRelay_ProposerPayloadDelivered}
			entitySelector={mevRelayProposerPayloadDeliveredSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
					{
						network: (
							'caip2' in mevRelayProposerPayloadDeliveredSelector.$network ?
								String(caip2StringFromValue(mevRelayProposerPayloadDeliveredSelector.$network.caip2))
							:
								String(mevRelayProposerPayloadDeliveredSelector.$network.slug)
						),
						relayHost: String(mevRelayProposerPayloadDeliveredSelector.relayHost),
						slot: String(mevRelayProposerPayloadDeliveredSelector.slot),
						blockHash: String(mevRelayProposerPayloadDeliveredSelector.blockHash),
					}
				)
			}
		>
			{#snippet Title()}
				{([(String(mevRelayProposerPayloadDeliveredSelector.slot) ? 'Slot ' + String(mevRelayProposerPayloadDeliveredSelector.slot) : ''), (String(mevRelayProposerPayloadDelivered.value ?? '') ? String(mevRelayProposerPayloadDelivered.value ?? '') + ' wei' : '')].filter(Boolean).join(' ')) || 'MEV relay proposer payload delivered'}
			{/snippet}

			{#snippet Value()}
				{(String(mevRelayProposerPayloadDelivered.value ?? '') ? String(mevRelayProposerPayloadDelivered.value ?? '') + ' wei' : '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevRelayProposerPayloadDelivered.$builder == null ? '' : mevRelayProposerPayloadDelivered.$builder.builderPubkey || 'MEV builder'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
