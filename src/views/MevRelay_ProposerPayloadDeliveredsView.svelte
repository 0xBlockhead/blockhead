<!-- Generated from APP.ts. -->

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
			...{
				fields: {
					slot: true,
					value: true,
					$builder: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: mevRelayProposerPayloadDelivered })}
		{@const mevRelayProposerPayloadDeliveredSelector = mevRelayProposerPayloadDelivered[EntityMetaKey.Selector]}
		{@const network = mevRelayProposerPayloadDeliveredSelector.$network}
		<EntityView
			entityType={EntityType.MevRelay_ProposerPayloadDelivered}
			entitySelector={mevRelayProposerPayloadDeliveredSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						relayHost: mevRelayProposerPayloadDeliveredSelector.relayHost,
						slot: String(mevRelayProposerPayloadDeliveredSelector.slot),
						blockHash: mevRelayProposerPayloadDeliveredSelector.blockHash,
					}
				)
			}
		>
			{#snippet Title()}
				{['Slot ' + String(mevRelayProposerPayloadDeliveredSelector.slot), (mevRelayProposerPayloadDelivered.value != null ? String(mevRelayProposerPayloadDelivered.value) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered'}
			{/snippet}

			{#snippet Value()}
				{mevRelayProposerPayloadDelivered.value != null ? mevRelayProposerPayloadDelivered.value + ' wei' : ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevRelayProposerPayloadDelivered.$builder == null ? '' : mevRelayProposerPayloadDelivered.$builder.builderPubkey || 'MEV builder'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
