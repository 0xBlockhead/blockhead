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
		title = 'Events',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotEvent}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					eventName: true,
					indexInBlock: true,
					$pallet: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotEvent })}
		{@const polkadotEventSelector = polkadotEvent[EntityMetaKey.Selector]}
		{@const block = polkadotEventSelector.$block}
		<EntityView
			entityType={EntityType.PolkadotEvent}
			entitySelector={polkadotEventSelector}
			href={
				'hash' in block ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in block.$network ?
									caip2StringFromValue(block.$network.caip2)
								:
									block.$network.slug
							),
							blockNumber: String(block.blockNumber),
							hash: block.hash,
							eventIndex: String(polkadotEventSelector.indexInBlock),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[polkadotEvent.eventName, 'Event ' + String(polkadotEventSelector.indexInBlock)].filter(Boolean).join(' ') || 'Polkadot event'}
			{/snippet}

			{#snippet Value()}
				{polkadotEvent.eventName}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotEvent.$pallet == null ? '' : polkadotEvent.$pallet.palletName || 'Polkadot pallet'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
