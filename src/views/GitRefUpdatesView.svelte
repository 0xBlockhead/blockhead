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
	}: EntityListViewProps<EntityType.GitRefUpdate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitRefUpdate}
	bind:open
	resource={
		selection({
			fields: {
				refName: true,
				updateKind: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: gitRefUpdate })}
		{@const gitRefUpdateSelector = gitRefUpdate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitRefUpdate}
			entitySelector={gitRefUpdateSelector}
			href={
				gitRefUpdateSelector.$repository.repositoryId !== undefined ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref-update/[refName=stringSegment]/[oldObjectId=zeroExHex]/[newObjectId=zeroExHex]',
						{
							repositoryId: gitRefUpdateSelector.$repository.repositoryId,
							refName: gitRefUpdateSelector.refName,
							oldObjectId: gitRefUpdateSelector.oldObjectId,
							newObjectId: gitRefUpdateSelector.newObjectId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{gitRefUpdateSelector.refName || 'Git ref update'}
			{/snippet}

			{#snippet Value()}
				{gitRefUpdate.updateKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitRefUpdate.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
