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
			fields: {
				eventName: true,
				indexInBlock: true,
				$pallet: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotEvent })}
		{@const polkadotEventSelector = polkadotEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotEvent}
			entitySelector={polkadotEventSelector}
			href={
				(
					'hash' in polkadotEventSelector.$block ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]',
							{
								network: (
									'caip2' in polkadotEventSelector.$block.$network ?
										String(caip2StringFromValue(polkadotEventSelector.$block.$network.caip2))
									:
										String(polkadotEventSelector.$block.$network.slug)
								),
								blockNumber: String(polkadotEventSelector.$block.blockNumber),
								hash: String(polkadotEventSelector.$block.hash),
								eventIndex: String(polkadotEventSelector.indexInBlock),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{([polkadotEvent.eventName, (String(polkadotEventSelector.indexInBlock) ? 'Event ' + String(polkadotEventSelector.indexInBlock) : '')].filter(Boolean).join(' ')) || 'Polkadot event'}
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
