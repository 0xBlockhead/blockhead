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
	}: EntityListViewProps<EntityType.NearExecutionOutcome> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearExecutionOutcome}
	bind:open
	resource={
		selection({
			fields: {
				outcomeId: true,
				status: true,
				gasBurnt: true,
			},
		})
	}
>
	{#snippet Item({ item: nearExecutionOutcome })}
		{@const nearExecutionOutcomeSelector = nearExecutionOutcome[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearExecutionOutcome}
			entitySelector={nearExecutionOutcomeSelector}
		>
			{#snippet Title()}
				{nearExecutionOutcomeSelector.outcomeId || 'near execution outcome'}
			{/snippet}

			{#snippet Value()}
				{nearExecutionOutcome.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearExecutionOutcome.gasBurnt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
