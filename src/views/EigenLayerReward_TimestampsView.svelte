<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EigenLayerReward_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerReward_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$earner: true,
				rewardContextKey: true,
				rewardToken: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerRewardTimestamp })}
		{@const eigenLayerRewardTimestampSelector = eigenLayerRewardTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerReward_Timestamp}
			entitySelector={eigenLayerRewardTimestampSelector}
		>
			{#snippet Title()}
				{eigenLayerRewardTimestampSelector.$earner.$actor.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerRewardTimestampSelector.rewardContextKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerRewardTimestamp.rewardToken ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
