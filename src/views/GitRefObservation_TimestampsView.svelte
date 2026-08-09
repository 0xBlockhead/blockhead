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
	}: EntityListViewProps<EntityType.GitRefObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitRefObservation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					source: true,
					targetObjectId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitRefObservationTimestamp })}
		{@const gitRefObservationTimestampSelector = gitRefObservationTimestamp[EntityMetaKey.Selector]}
		{@const ref = gitRefObservationTimestampSelector.$ref}
		<EntityView
			entityType={EntityType.GitRefObservation_Timestamp}
			entitySelector={gitRefObservationTimestampSelector}
			href={
				'repositoryId' in ref.$repository ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref/[refName=stringSegment]/(gitRef)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							repositoryId: ref.$repository.repositoryId,
							refName: ref.refName,
							timestampMs: String(gitRefObservationTimestampSelector.timestampMs),
							source: gitRefObservationTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{gitRefObservationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{gitRefObservationTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitRefObservationTimestamp.targetObjectId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
