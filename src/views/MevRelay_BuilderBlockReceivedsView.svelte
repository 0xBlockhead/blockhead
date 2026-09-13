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
			fields: {
				slot: true,
				valueWei: true,
				$builder: true,
			},
		})
	}
>
	{#snippet Item({ item: mevRelayBuilderBlockReceived })}
		{@const mevRelayBuilderBlockReceivedSelector = mevRelayBuilderBlockReceived[EntityMetaKey.Selector]}
		{@const relay = mevRelayBuilderBlockReceivedSelector.$relay}
		<EntityView
			entityType={EntityType.MevRelay_BuilderBlockReceived}
			entitySelector={mevRelayBuilderBlockReceivedSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/received-bid/[slot=nonNegativeInteger]/[blockHash=zeroExHex]/[builderPubkey=stringSegment]/[receivedAtMs=nonNegativeInteger]',
					{
						network: (
							relay.$network.caip2 !== undefined ?
								caip2StringFromValue(relay.$network.caip2)
							:
								relay.$network.slug
						),
						host: relay.host,
						slot: String(mevRelayBuilderBlockReceivedSelector.slot),
						blockHash: mevRelayBuilderBlockReceivedSelector.blockHash,
						builderPubkey: mevRelayBuilderBlockReceivedSelector.$builder.builderPubkey,
						receivedAtMs: String(mevRelayBuilderBlockReceivedSelector.receivedAtMs),
					}
				)
			}
		>
			{#snippet Title()}
				{['Slot ' + String(mevRelayBuilderBlockReceivedSelector.slot), String(mevRelayBuilderBlockReceived.valueWei) + ' wei'].filter(Boolean).join(' ') || 'MEV relay builder block received'}
			{/snippet}

			{#snippet Value()}
				{mevRelayBuilderBlockReceived.valueWei + ' wei'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevRelayBuilderBlockReceivedSelector.$builder.builderPubkey || 'MEV builder'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
