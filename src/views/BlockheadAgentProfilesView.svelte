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
	}: EntityListViewProps<EntityType.BlockheadAgentProfile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentProfile}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				$model: true,
				profileId: true,
				updatedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentProfile })}
		{@const blockheadAgentProfileSelector = blockheadAgentProfile[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentProfile}
			entitySelector={blockheadAgentProfileSelector}
		>
			{#snippet Title()}
				{(blockheadAgentProfile.label ?? '') || blockheadAgentProfileSelector.profileId || 'blockhead agent profile'}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentProfile.$model == null ? '' : (blockheadAgentProfile.$model.label ?? '') || blockheadAgentProfile.$model.providerModelId || 'AI model'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentProfile.updatedAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
