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
	}: EntityListViewProps<EntityType.GitForgeReleaseLink> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeReleaseLink}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					linkType: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitForgeReleaseLink })}
		{@const gitForgeReleaseLinkSelector = gitForgeReleaseLink[EntityMetaKey.Selector]}
		{@const release = gitForgeReleaseLinkSelector.$release}
		<EntityView
			entityType={EntityType.GitForgeReleaseLink}
			entitySelector={gitForgeReleaseLinkSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]/(gitForgeRelease)/asset/[linkId=nonNegativeInteger]',
					{
						forgeHost: release.$forgeMirror.forgeHost,
						owner: release.$forgeMirror.owner,
						repositoryName: release.$forgeMirror.repositoryName,
						releaseTagName: release.releaseTagName,
						linkId: String(gitForgeReleaseLinkSelector.linkId),
					}
				)
			}
		>
			{#snippet Title()}
				{gitForgeReleaseLink.name || 'Git forge release link'}
			{/snippet}

			{#snippet Value()}
				{gitForgeReleaseLink.linkType ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
