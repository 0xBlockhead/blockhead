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
	}: EntityListViewProps<EntityType.GitForgeJob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeJob}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				status: true,
				stage: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeJob })}
		{@const gitForgeJobSelector = gitForgeJob[EntityMetaKey.Selector]}
		{@const pipeline = gitForgeJobSelector.$pipeline}
		<EntityView
			entityType={EntityType.GitForgeJob}
			entitySelector={gitForgeJobSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pipeline/[pipelineId=nonNegativeInteger]/(gitForgePipeline)/job/[jobId=nonNegativeInteger]',
					{
						forgeHost: pipeline.$forgeMirror.forgeHost,
						owner: pipeline.$forgeMirror.owner,
						repositoryName: pipeline.$forgeMirror.repositoryName,
						pipelineId: String(pipeline.pipelineId),
						jobId: String(gitForgeJobSelector.jobId),
					}
				)
			}
		>
			{#snippet Title()}
				{gitForgeJob.name || 'Git forge job'}
			{/snippet}

			{#snippet Value()}
				{gitForgeJob.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitForgeJob.stage}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
