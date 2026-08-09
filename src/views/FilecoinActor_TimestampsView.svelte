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
	}: EntityListViewProps<EntityType.FilecoinActor_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinActor_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					balanceAttoFil: true,
					height: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: filecoinActorTimestamp })}
		{@const filecoinActorTimestampSelector = filecoinActorTimestamp[EntityMetaKey.Selector]}
		{@const actor = filecoinActorTimestampSelector.$actor}
		<EntityView
			entityType={EntityType.FilecoinActor_Timestamp}
			entitySelector={filecoinActorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in actor.$network ?
								caip2StringFromValue(actor.$network.caip2)
							:
								actor.$network.slug
						),
						address: actor.address,
						height: String(filecoinActorTimestampSelector.height),
						tipsetKey: filecoinActorTimestampSelector.tipsetKey,
						source: filecoinActorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinActorTimestamp.timestampMs}
			{/snippet}

			{#snippet Value()}
				{filecoinActorTimestamp.balanceAttoFil ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinActorTimestampSelector.height}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
