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
	}: EntityListViewProps<EntityType.GitCommit> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitCommit}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				message: true,
				objectFormat: true,
			},
		})
	}
>
	{#snippet Item({ item: gitCommit })}
		{@const gitCommitSelector = gitCommit[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitCommit}
			entitySelector={gitCommitSelector}
			href={
				resolve(
					'/git/commit/[objectId=zeroExHex]/[objectFormat=stringSegment]',
					{
						objectId: gitCommitSelector.objectId,
						objectFormat: gitCommitSelector.objectFormat,
					}
				)
			}
		>
			{#snippet Title()}
				{gitCommitSelector.objectId || 'Git commit'}
			{/snippet}

			{#snippet Value()}
				{gitCommit.message ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitCommitSelector.objectFormat}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
