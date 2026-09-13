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
	}: EntityListViewProps<EntityType.EigenLayerSlashingEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerSlashingEvent}
	bind:open
	resource={
		selection({
			fields: {
				$operator: true,
				$avs: true,
				slashedShares: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerSlashingEvent })}
		{@const eigenLayerSlashingEventSelector = eigenLayerSlashingEvent[EntityMetaKey.Selector]}
		{@const operator = eigenLayerSlashingEventSelector.$operator}
		<EntityView
			entityType={EntityType.EigenLayerSlashingEvent}
			entitySelector={eigenLayerSlashingEventSelector}
			href={
				eigenLayerSlashingEventSelector.source !== undefined
				&& eigenLayerSlashingEventSelector.slashId !== undefined
				&& eigenLayerSlashingEventSelector.$avs !== undefined
				&& operator !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/avs/[avsAddress=evmAddress]/slashing/[source=stringSegment]/[slashId=stringSegment]',
						{
							network: (
								operator.$network.caip2 !== undefined ?
									caip2StringFromValue(operator.$network.caip2)
								:
									operator.$network.slug
							),
							operatorAddress: operator.operatorAddress,
							avsAddress: eigenLayerSlashingEventSelector.$avs.avsAddress,
							source: eigenLayerSlashingEventSelector.source,
							slashId: eigenLayerSlashingEventSelector.slashId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{(eigenLayerSlashingEvent.$operator == null ? '' : eigenLayerSlashingEvent.$operator.operatorAddress || 'eigen layer operator') || 'eigen layer slashing event'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerSlashingEvent.$avs == null ? '' : eigenLayerSlashingEvent.$avs.avsAddress || 'eigen layer avs'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerSlashingEvent.slashedShares ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
