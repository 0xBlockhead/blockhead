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
	}: EntityListViewProps<EntityType.SuiCheckpoint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCheckpoint}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiCheckpoint })}
		{@const suiCheckpointSelector = suiCheckpoint[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiCheckpoint}
			entitySelector={suiCheckpointSelector}
			href={
				'sequence' in suiCheckpointSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-checkpoint/[sequence=nonNegativeBigInt]',
						{
							network: (
								'caip2' in suiCheckpointSelector.$network.$network ?
									caip2StringFromValue(suiCheckpointSelector.$network.$network.caip2)
								:
									suiCheckpointSelector.$network.$network.slug
							),
							sequence: String(suiCheckpointSelector.sequence),
						}
					)
				:
					'digest' in suiCheckpointSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-checkpoint-digest/[digest=stringSegment]',
							{
								network: (
									'caip2' in suiCheckpointSelector.$network.$network ?
										caip2StringFromValue(suiCheckpointSelector.$network.$network.caip2)
									:
										suiCheckpointSelector.$network.$network.slug
								),
								digest: suiCheckpointSelector.digest,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				Sui checkpoint
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
