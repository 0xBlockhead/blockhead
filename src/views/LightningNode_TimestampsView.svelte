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
	}: EntityListViewProps<EntityType.LightningNode_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningNode_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				alias: true,
				timestampMs: true,
				capacitySats: true,
			},
		})
	}
>
	{#snippet Item({ item: lightningNodeTimestamp })}
		{@const lightningNodeTimestampSelector = lightningNodeTimestamp[EntityMetaKey.Selector]}
		{@const node = lightningNodeTimestampSelector.$node}
		<EntityView
			entityType={EntityType.LightningNode_Timestamp}
			entitySelector={lightningNodeTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]/(lightningNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in node.$network ?
								caip2StringFromValue(node.$network.caip2)
							:
								node.$network.slug
						),
						pubkey: node.publicKey,
						timestampMs: String(lightningNodeTimestampSelector.timestampMs),
						source: lightningNodeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(lightningNodeTimestamp.alias ?? ''), String(lightningNodeTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'Lightning public node observation'}
			{/snippet}

			{#snippet Value()}
				{lightningNodeTimestamp.capacitySats ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
