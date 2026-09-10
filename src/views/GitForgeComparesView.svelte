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
	}: EntityListViewProps<EntityType.GitForgeCompare> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeCompare}
	bind:open
	resource={
		selection({
			fields: {
				fromObjectId: true,
				toObjectId: true,
				$forgeMirror: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeCompare })}
		{@const gitForgeCompareSelector = gitForgeCompare[EntityMetaKey.Selector]}
		{@const forgeMirror = gitForgeCompareSelector.$forgeMirror}
		<EntityView
			entityType={EntityType.GitForgeCompare}
			entitySelector={gitForgeCompareSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/compare/[fromObjectId=zeroExHex]/[toObjectId=zeroExHex]',
					{
						forgeHost: forgeMirror.forgeHost,
						owner: forgeMirror.owner,
						repositoryName: forgeMirror.repositoryName,
						fromObjectId: gitForgeCompareSelector.fromObjectId,
						toObjectId: gitForgeCompareSelector.toObjectId,
					}
				)
			}
		>
			{#snippet Title()}
				{[gitForgeCompareSelector.fromObjectId, gitForgeCompareSelector.toObjectId].filter(Boolean).join(' ') || 'Git forge compare'}
			{/snippet}

			{#snippet Value()}
				{[gitForgeCompareSelector.$forgeMirror.owner, gitForgeCompareSelector.$forgeMirror.repositoryName].filter(Boolean).join(' ') || 'Git forge mirror'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
