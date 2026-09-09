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
	}: EntityListViewProps<EntityType.GitTreePathResolution> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitTreePathResolution}
	bind:open
	resource={
		selection({
			fields: {
				path: true,
				status: true,
				commitObjectId: true,
			},
		})
	}
>
	{#snippet Item({ item: gitTreePathResolution })}
		{@const gitTreePathResolutionSelector = gitTreePathResolution[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitTreePathResolution}
			entitySelector={gitTreePathResolutionSelector}
			href={
				'canonicalRemoteUrl' in gitTreePathResolutionSelector.$repository ?
					resolve(
						'/git/repository/remote/[canonicalRemoteUrl=absoluteUrl]/(gitRepository)/commit/[commitObjectId=zeroExHex]/path/[path=stringSegment]',
						{
							canonicalRemoteUrl: encodeURIComponent(gitTreePathResolutionSelector.$repository.canonicalRemoteUrl),
							commitObjectId: gitTreePathResolutionSelector.commitObjectId,
							path: gitTreePathResolutionSelector.path,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{gitTreePathResolutionSelector.path || 'Git tree path resolution'}
			{/snippet}

			{#snippet Value()}
				{gitTreePathResolution.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitTreePathResolutionSelector.commitObjectId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
