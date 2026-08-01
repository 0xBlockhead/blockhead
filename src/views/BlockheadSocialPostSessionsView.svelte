<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Social post sessions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSocialPostSession> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSocialPostSession}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				status: true,
				protocol: true,
				id: true,
				updatedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSocialPostSession })}
		{@const blockheadSocialPostSessionSelector = blockheadSocialPostSession[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSocialPostSession}
			entitySelector={blockheadSocialPostSessionSelector}
		>
			{#snippet Title()}
				{(blockheadSocialPostSession.name ?? '') || blockheadSocialPostSessionSelector.id || 'blockhead social post session'}
			{/snippet}

			{#snippet Value()}
				{[blockheadSocialPostSession.status, blockheadSocialPostSession.protocol].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSocialPostSession.updatedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
