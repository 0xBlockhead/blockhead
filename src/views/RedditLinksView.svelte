<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Submissions'
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditLink>
			id: string
		limit?: number
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.RedditLink}
	{id}
	{title}
	bind:open
	{collapsible}
	{href}
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Constants_Internal,
						Source.Reddit_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						],
						limit,
					},
				} }),
			)}
			{@const links = derive(
				parent,
				(parent) => {
					const redditLinks: readonly Entity<typeof schema, EntityType.RedditLink>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						redditLinks.map((link, index) => ({
							...link[EntityMetaKey.Selector],
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
				getKey={(link) => link.fullname}
				getSortValue={(link) => link.sortKey}
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
							selector={{ fullname: link.fullname }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
