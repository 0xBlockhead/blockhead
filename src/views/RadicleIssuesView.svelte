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
	}: EntityListViewProps<EntityType.RadicleIssue> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleIssue}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleIssue })}
		{@const radicleIssueSelector = radicleIssue[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadicleIssue}
			entitySelector={radicleIssueSelector}
			href={
				resolve(
					'/radicle/repository/[rid=stringSegment]/(radicleRepository)/issue/[issueId=stringSegment]',
					{
						rid: radicleIssueSelector.$repository.rid,
						issueId: radicleIssueSelector.issueId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
