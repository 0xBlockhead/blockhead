<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Algorand participation keys',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAlgorandParticipationKey> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAlgorandParticipationKey}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				participationId: true,
				nodeId: true,
				firstValidRound: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAlgorandParticipationKey })}
		{@const blockheadAlgorandParticipationKeySelector = blockheadAlgorandParticipationKey[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAlgorandParticipationKey}
			entitySelector={blockheadAlgorandParticipationKeySelector}
		>
			{#snippet Title()}
				{blockheadAlgorandParticipationKeySelector.participationId || 'blockhead algorand participation key'}
			{/snippet}

			{#snippet Value()}
				{blockheadAlgorandParticipationKeySelector.nodeId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAlgorandParticipationKey.firstValidRound ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
