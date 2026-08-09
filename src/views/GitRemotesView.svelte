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
	}: EntityListViewProps<EntityType.GitRemote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitRemote}
	bind:open
	resource={
		selection({
			...{
				fields: {
					remoteName: true,
					url: true,
					transportKind: true,
					hostKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitRemote })}
		{@const gitRemoteSelector = gitRemote[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitRemote}
			entitySelector={gitRemoteSelector}
			href={
				'repositoryId' in gitRemoteSelector.$repository ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/remote/[remoteName=stringSegment]',
						{
							repositoryId: gitRemoteSelector.$repository.repositoryId,
							remoteName: gitRemoteSelector.remoteName,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{gitRemoteSelector.remoteName || 'Git remote'}
			{/snippet}

			{#snippet Value()}
				{gitRemote.url}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[gitRemote.transportKind, (gitRemote.hostKind ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
