<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadActionOutcome> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionOutcome}
	bind:open
	resource={
		selection({
			...{
				fields: {
					outcomeKind: true,
					transactionId: true,
					createdAt: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadActionOutcome })}
		{@const blockheadActionOutcomeSelector = blockheadActionOutcome[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadActionOutcome}
			entitySelector={blockheadActionOutcomeSelector}
			href={
				resolve(
					'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/outcome/[outcomeId=stringSegment]',
					{
						sessionId: blockheadActionOutcomeSelector.sessionId,
						actionId: blockheadActionOutcomeSelector.actionId,
						outcomeId: blockheadActionOutcomeSelector.outcomeId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadActionOutcome.outcomeKind || 'blockhead action outcome'}
			{/snippet}

			{#snippet Value()}
				{blockheadActionOutcome.transactionId ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionOutcome.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
