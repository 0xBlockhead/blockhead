<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/reddit'),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.RedditNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const networkSelectorKey = stringify(selector)

	const redditNetwork = subscribe(EntityType.RedditNetwork,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { protocolName: true, registryLabel: true, ...(open ? ({ docsUrl: true, homeUrl: true, topology: true, $$redditLinks: ({ sources: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						] }), $$redditSubreddits: ({ sources: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						] }) }) : ({  })) } }),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditNetwork}
	entitySelector={selector}
	href={href}
	layout={EntityLayout.SummaryDetails}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Reddit"
>
	{#snippet Value()}
		Reddit
	{/snippet}

	{#snippet Title()}
		Reddit
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Reddit’s HTTP APIs return communities, ranked submissions, and linked comment threads under a common JSON model.
		</p>
		<p>
			Reddit’s public API surfaces subreddits, submissions, and comment trees over HTTPS—separate transport from low-latency game/voice rooms or Nostr/Farcaster relays.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={redditNetwork}
				placeholderText="Loading Reddit…"
			>
				{#snippet children(redditNetwork)}
					{#if redditNetwork.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{redditNetwork.fields.registryLabel}</dd>
						</div>
					{:else if redditNetwork.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{redditNetwork.fields.protocolName}</dd>
						</div>
					{/if}

						{#if open}
							<div>
								<dt>Communities</dt>
								<dd>{String(redditNetwork.fields.$$redditSubreddits?.values.length ?? 0)}</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Submissions</dt>
								<dd>{String(redditNetwork.fields.$$redditLinks?.values.length ?? 0)}</dd>
							</div>
						{/if}

						{#if open && redditNetwork.fields.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={redditNetwork.fields.homeUrl}>
										{redditNetwork.fields.homeUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if open && redditNetwork.fields.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={redditNetwork.fields.docsUrl}>
										{redditNetwork.fields.docsUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if open && redditNetwork.fields.topology}
							<div>
								<dt>Topology</dt>
								<dd>{redditNetwork.fields.topology}</dd>
							</div>
						{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'subreddits', label: 'Subreddits' },
				{ id: 'links', label: 'Popular submissions' },
			]}
			id={`${networkSelectorKey}:registry`}
			data-card
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Popular index
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSubreddits({ id, label })}
				<RedditSubredditsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/reddit/subreddits')}
					entityFieldReference={{
						entityType: EntityType.RedditNetwork,
						selector,
						fieldName: '$$redditSubreddits',
					}}
					id={`${networkSelectorKey}:subreddits-redditNetworks`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionLinks({ id, label })}
				<RedditLinksView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/reddit/links')}
					entityFieldReference={{
						entityType: EntityType.RedditNetwork,
						selector,
						fieldName: '$$redditLinks',
					}}
					id={`${networkSelectorKey}:links-redditNetworks`}
					open={_open}
					title="Popular submissions"
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
