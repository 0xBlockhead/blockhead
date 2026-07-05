<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._GlobalRedditNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalRedditNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const globalRedditNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived('Reddit')
	const viewDomId = $derived('-global-reddit-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import GlobalRedditNetwork_TimestampsView from '$/views/_GlobalRedditNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalRedditNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalRedditNetwork}>
			{#snippet Pending()}
				{title || 'Reddit'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = selection.entitySelector.scope ?? prefetched.scope}
							{#if scope !== undefined && scope !== null}
								{String(('Reddit') ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String(('Reddit') ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RedditSubredditsView
				selection={
						selection[EntityProxyField]<EntityType.RedditSubreddit>('$$sourceWindowSubreddits', {
							sources: [
								Source.Constants_Internal,
								Source.Reddit_PublicJson,
							],
						})
					}
				title='Subreddits'
				href={resolve('/(social)/(reddit)/reddit/subreddits')}
				id='RedditSubredditsView-$$sourceWindowSubreddits'
			/>

			<RedditLinksView
				selection={
						selection[EntityProxyField]<EntityType.RedditLink>('$$sourceWindowLinks', {
							sources: [
								Source.Constants_Internal,
								Source.Reddit_PublicJson,
							],
						})
					}
				title='Popular submissions'
				href={resolve('/(social)/(reddit)/reddit/links')}
				id='RedditLinksView-$$sourceWindowLinks'
			/>

			<GlobalRedditNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalRedditNetwork_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No Reddit network observations.'
				id='_GlobalRedditNetwork_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
