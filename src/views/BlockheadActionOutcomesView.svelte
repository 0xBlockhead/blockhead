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
			fields: {
				outcomeKind: true,
				transactionHash: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadActionOutcome })}
		<EntityView
			entityType={EntityType.BlockheadActionOutcome}
			entitySelector={blockheadActionOutcome[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadActionOutcome.outcomeKind || 'blockhead action outcome'}
			{/snippet}

			{#snippet Value()}
				{blockheadActionOutcome.transactionHash ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionOutcome.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
