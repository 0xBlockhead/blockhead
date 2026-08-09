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
	}: EntityListViewProps<EntityType.BlockheadActionReadinessCheck_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionReadinessCheck_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					status: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadActionReadinessCheckTimestamp })}
		{@const blockheadActionReadinessCheckTimestampSelector = blockheadActionReadinessCheckTimestamp[EntityMetaKey.Selector]}
		{@const readinessCheck = blockheadActionReadinessCheckTimestampSelector.$readinessCheck}
		<EntityView
			entityType={EntityType.BlockheadActionReadinessCheck_Timestamp}
			entitySelector={blockheadActionReadinessCheckTimestampSelector}
			href={
				resolve(
					'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/readiness-check/[checkId=stringSegment]/(blockheadActionReadinessCheck)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						sessionId: readinessCheck.sessionId,
						actionId: readinessCheck.actionId,
						checkId: readinessCheck.checkId,
						timestampMs: String(blockheadActionReadinessCheckTimestampSelector.timestampMs),
						source: blockheadActionReadinessCheckTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadActionReadinessCheckTimestamp.status || 'blockhead action readiness check timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadActionReadinessCheckTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionReadinessCheckTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
