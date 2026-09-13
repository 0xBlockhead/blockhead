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
	}: EntityListViewProps<EntityType.GitRef> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitRef}
	bind:open
	resource={
		selection({
			fields: {
				refName: true,
				refKind: true,
				targetObjectId: true,
			},
		})
	}
>
	{#snippet Item({ item: gitRef })}
		{@const gitRefSelector = gitRef[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitRef}
			entitySelector={gitRefSelector}
			href={
				gitRefSelector.$repository.repositoryId !== undefined ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref/[refName=stringSegment]',
						{
							repositoryId: gitRefSelector.$repository.repositoryId,
							refName: gitRefSelector.refName,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{gitRefSelector.refName || 'Git ref'}
			{/snippet}

			{#snippet Value()}
				{gitRef.refKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitRef.targetObjectId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
