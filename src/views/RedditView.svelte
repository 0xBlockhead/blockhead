<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityId = {
		scope: 'RedditNetwork' as const,
	}

	const networkIdKey = stringify(entityId)

	const redditNetwork = useEntity(
		EntityType.RedditNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			docsUrl: {},
			homeUrl: {},
			protocolName: {},
			$$redditLinks: {
				$: [
					Source.Reddit_Rest,
				],
			},
			$$redditSubreddits: {
				$: [
					Source.Reddit_Rest,
				],
			},
		},
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditNetwork}
	{entityId}
	href={resolve('/(social)/reddit')}
	open={true}
	title="Reddit"
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={redditNetwork}
			placeholderText="Loading Reddit…"
		>
			{#snippet children(u)}
				<dl>
					<div>
						<dt>Scope</dt>
						<dd>{entityId.scope}</dd>
					</div>
					<div>
						<dt>Communities</dt>
						<dd>{String(u.$$redditSubreddits.length)}</dd>
					</div>
					<div>
						<dt>Posts</dt>
						<dd>{String(u.$$redditLinks.length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{String(u.protocolName ?? 'Reddit')}</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={String(u.homeUrl ?? '#')}>
									{String(u.homeUrl ?? '—')}
								</a>
							</dd>
						</div>
					{/if}
					{#if open}
						{#if u.docsUrl != null}
							{#if u.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={u.docsUrl}>
											{u.docsUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditNetwork}
			{entityId}
		/>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Popular index
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Subreddits">
						<RedditSubredditsView
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditSubreddits',
							}}
							href={resolve('/(social)/reddit')}
							id={`${networkIdKey}:subreddits`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Popular posts">
						<RedditLinksView
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditLinks',
							}}
							href={resolve('/(social)/reddit')}
							id={`${networkIdKey}:links`}
							open={false}
							title="Popular posts"
						/>
					</section>
				</div>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
