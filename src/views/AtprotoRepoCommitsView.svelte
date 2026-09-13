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
		title = 'Repo commits',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AtprotoRepoCommit> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoRepoCommit}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				rev: true,
				commitCid: true,
				repoDid: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: atprotoRepoCommit })}
		{@const atprotoRepoCommitSelector = atprotoRepoCommit[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoRepoCommit}
			entitySelector={atprotoRepoCommitSelector}
			href={
				atprotoRepoCommitSelector.rev !== undefined ?
					resolve(
						'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/rev/[rev=stringSegment]/[source=stringSegment]',
						{
							repoDid: atprotoRepoCommitSelector.repoDid,
							rev: atprotoRepoCommitSelector.rev,
							source: atprotoRepoCommitSelector.source,
						}
					)
				:
					atprotoRepoCommitSelector.commitCid !== undefined ?
						resolve(
							'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/cid/[commitCid=stringSegment]/[source=stringSegment]',
							{
								repoDid: atprotoRepoCommitSelector.repoDid,
								commitCid: atprotoRepoCommitSelector.commitCid,
								source: atprotoRepoCommitSelector.source,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{[atprotoRepoCommit.rev, atprotoRepoCommit.commitCid].filter(Boolean).join(' ') || 'AT Protocol repo commit'}
			{/snippet}

			{#snippet Value()}
				{atprotoRepoCommitSelector.repoDid}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{atprotoRepoCommitSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
