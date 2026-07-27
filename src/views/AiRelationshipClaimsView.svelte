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
	}: EntityListViewProps<EntityType.AiRelationshipClaim> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiRelationshipClaim}
	bind:open
	resource={
		selection({
			fields: {
				relationshipKind: true,
				subjectKind: true,
				objectKind: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: aiRelationshipClaim })}
		{@const aiRelationshipClaimSelector = aiRelationshipClaim[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiRelationshipClaim}
			entitySelector={aiRelationshipClaimSelector}
		>
			{#snippet Title()}
				{aiRelationshipClaimSelector.relationshipKind || 'AI relationship claim'}
			{/snippet}

			{#snippet Value()}
				{[aiRelationshipClaimSelector.subjectKind, aiRelationshipClaimSelector.objectKind].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(aiRelationshipClaimSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
