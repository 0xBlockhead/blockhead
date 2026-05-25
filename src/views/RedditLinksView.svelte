<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		entityFieldReference,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		title = 'Submissions'
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditLink>
			id: string
		limit?: number
		open?: boolean
		collapsible?: boolean
		title?: string
	} = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditLink}
	{id}
	{title}
	bind:open
	{collapsible}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Submissions and comment threads sourced from Reddit’s own HTTP APIs.
		</p>
		<p>
			Not Farcaster casts, team rooms, or file pinning networks.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Reddit submissions here yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						Source.Reddit_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						],
						limit,
					},
				},
			)}
			{@const links = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.RedditLink>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((link, index) => ({
							...link[EntityMetaKey.Id],
							sortKey: index,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RedditLink}
				id={`${id}-items`}
				{title}
				open={true}
				resource={links}
				placeholderText="Loading submissions…"
				getKey={(row) => row.fullname}
				getSortValue={(row) => row.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Reddit submissions here yet.
					</p>
				{/snippet}

					{#snippet Item({
						item: link,
					})}
						<RedditLinkView
							entityId={{ fullname: link.fullname }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
