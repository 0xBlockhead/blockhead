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
	}: EntityListViewProps<EntityType.BlockheadSession> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSession}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					status: true,
					id: true,
					updatedAt: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadSession })}
		{@const blockheadSessionSelector = blockheadSession[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSession}
			entitySelector={blockheadSessionSelector}
			href={
				resolve(
					'/~/session/[sessionId=stringSegment]',
					{
						sessionId: blockheadSessionSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadSession.name ?? '') || blockheadSessionSelector.id || 'session'}
			{/snippet}

			{#snippet Value()}
				{blockheadSession.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSession.updatedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
