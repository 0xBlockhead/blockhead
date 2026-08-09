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
	}: EntityListViewProps<EntityType.GitFetchObservation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitFetchObservation}
	bind:open
	resource={
		selection({
			...{
				fields: {
					remoteName: true,
					status: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitFetchObservation })}
		{@const gitFetchObservationSelector = gitFetchObservation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitFetchObservation}
			entitySelector={gitFetchObservationSelector}
			href={
				'repositoryId' in gitFetchObservationSelector.$repository ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/remote/[remoteName=stringSegment]/(gitRemote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							repositoryId: gitFetchObservationSelector.$repository.repositoryId,
							remoteName: gitFetchObservationSelector.remoteName,
							timestampMs: String(gitFetchObservationSelector.timestampMs),
							source: gitFetchObservationSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{gitFetchObservationSelector.remoteName || 'Git fetch observation'}
			{/snippet}

			{#snippet Value()}
				{gitFetchObservation.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(gitFetchObservationSelector.timestampMs), gitFetchObservationSelector.source].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
