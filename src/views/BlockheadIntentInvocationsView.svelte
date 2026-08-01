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
	}: EntityListViewProps<EntityType.BlockheadIntentInvocation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentInvocation}
	bind:open
	resource={
		selection({
			fields: {
				modality: true,
				resolvedIntentType: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadIntentInvocation })}
		<EntityView
			entityType={EntityType.BlockheadIntentInvocation}
			entitySelector={blockheadIntentInvocation[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadIntentInvocation.modality || 'blockhead intent invocation'}
			{/snippet}

			{#snippet Value()}
				{blockheadIntentInvocation.resolvedIntentType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadIntentInvocation.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
