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
	}: EntityListViewProps<EntityType.GitForgePipeline> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgePipeline}
	bind:open
	resource={
		selection({
			fields: {
				pipelineIid: true,
				status: true,
				ref: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgePipeline })}
		{@const gitForgePipelineSelector = gitForgePipeline[EntityMetaKey.Selector]}
		{@const forgeMirror = gitForgePipelineSelector.$forgeMirror}
		<EntityView
			entityType={EntityType.GitForgePipeline}
			entitySelector={gitForgePipelineSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pipeline/[pipelineId=nonNegativeInteger]',
					{
						forgeHost: forgeMirror.forgeHost,
						owner: forgeMirror.owner,
						repositoryName: forgeMirror.repositoryName,
						pipelineId: String(gitForgePipelineSelector.pipelineId),
					}
				)
			}
		>
			{#snippet Title()}
				{'Pipeline #' + gitForgePipeline.pipelineIid}
			{/snippet}

			{#snippet Value()}
				{gitForgePipeline.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitForgePipeline.ref}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
