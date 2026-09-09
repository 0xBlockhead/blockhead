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
		title = 'Blockhead Radicle sync sessions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadicleSyncSession> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleSyncSession}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				sessionId: true,
				status: true,
				startedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadicleSyncSession })}
		{@const blockheadRadicleSyncSessionSelector = blockheadRadicleSyncSession[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadRadicleSyncSession}
			entitySelector={blockheadRadicleSyncSessionSelector}
			href={
				resolve(
					'/~/radicle/sync-session/[sessionId=stringSegment]',
					{
						sessionId: blockheadRadicleSyncSessionSelector.sessionId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadRadicleSyncSessionSelector.sessionId || 'blockhead radicle sync session'}
			{/snippet}

			{#snippet Value()}
				{blockheadRadicleSyncSession.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadRadicleSyncSession.startedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
