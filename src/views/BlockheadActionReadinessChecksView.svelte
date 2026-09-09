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
	}: EntityListViewProps<EntityType.BlockheadActionReadinessCheck> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionReadinessCheck}
	bind:open
	resource={
		selection({
			fields: {
				checkKind: true,
				capabilityKey: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadActionReadinessCheck })}
		{@const blockheadActionReadinessCheckSelector = blockheadActionReadinessCheck[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadActionReadinessCheck}
			entitySelector={blockheadActionReadinessCheckSelector}
			href={
				resolve(
					'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/readiness-check/[checkId=stringSegment]',
					{
						sessionId: blockheadActionReadinessCheckSelector.sessionId,
						actionId: blockheadActionReadinessCheckSelector.actionId,
						checkId: blockheadActionReadinessCheckSelector.checkId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadActionReadinessCheck.checkKind || 'blockhead action readiness check'}
			{/snippet}

			{#snippet Value()}
				{blockheadActionReadinessCheck.capabilityKey ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionReadinessCheck.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
