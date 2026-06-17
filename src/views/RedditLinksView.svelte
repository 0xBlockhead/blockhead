<script lang="ts">
import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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

	import { proxy } from '$/routes/+layout.svelte'


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: [
						Source.Constants_Internal,
						Source.Reddit_Rest,
					],
					}
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.Reddit_Rest,
						Source.Reddit_PublicJson,
					],
					limit,
				})} placeholderText="Loading submissions…">
				{#snippet children(links)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.RedditLink}
						id={`${id}-items`}
						{title}
						open={true}
						items={links.entities}
						getKey={(link) => link.entitySelector.fullname}
						getSortValue={(link) => link.entitySelector.fullname}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No Reddit submissions here yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<RedditLinkView
							selector={item.entitySelector}
							layout={EntityLayout.Summary}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
