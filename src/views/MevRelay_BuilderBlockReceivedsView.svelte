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
	}: EntityListViewProps<EntityType.MevRelay_BuilderBlockReceived> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevRelay_BuilderBlockReceived}
	bind:open
	resource={
		selection({
			...{
				fields: {
					slot: true,
					valueWei: true,
					$builder: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: mevRelayBuilderBlockReceived })}
		{@const mevRelayBuilderBlockReceivedSelector = mevRelayBuilderBlockReceived[EntityMetaKey.Selector]}
		{@const network = mevRelayBuilderBlockReceivedSelector.$network}
		<EntityView
			entityType={EntityType.MevRelay_BuilderBlockReceived}
			entitySelector={mevRelayBuilderBlockReceivedSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/received-bid/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]/[builderPubkey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						relayHost: mevRelayBuilderBlockReceivedSelector.relayHost,
						slot: String(mevRelayBuilderBlockReceivedSelector.slot),
						blockHash: mevRelayBuilderBlockReceivedSelector.blockHash,
						builderPubkey: mevRelayBuilderBlockReceivedSelector.builderPubkey,
					}
				)
			}
		>
			{#snippet Title()}
				{['Slot ' + String(mevRelayBuilderBlockReceivedSelector.slot), (mevRelayBuilderBlockReceived.valueWei != null ? String(mevRelayBuilderBlockReceived.valueWei) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay builder block received'}
			{/snippet}

			{#snippet Value()}
				{mevRelayBuilderBlockReceived.valueWei != null ? mevRelayBuilderBlockReceived.valueWei + ' wei' : ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevRelayBuilderBlockReceived.$builder.builderPubkey || 'MEV builder'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
