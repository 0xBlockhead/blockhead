<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.OracleFeed_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed_Round}
	bind:open
	resource={
		selection({
			fields: {
				roundId: true,
				answer: true,
				updatedAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: oracleFeedRound })}
		{@const oracleFeedRoundSelector = oracleFeedRound[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.OracleFeed_Round}
			entitySelector={oracleFeedRoundSelector}
		>
			{#snippet Title()}
				{oracleFeedRoundSelector.roundId}
			{/snippet}

			{#snippet Value()}
				{oracleFeedRound.answer ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{oracleFeedRound.updatedAtMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
