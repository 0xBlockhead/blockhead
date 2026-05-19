<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	let {
		open = $bindable(true),
	} = $props()

	const entityId = {
		scope: 'XNetwork' as const,
	}

	const exampleUserId = '783214' as const
	const examplePostId = '1955274825074221427' as const

	const networkIdKey = stringify(entityId)

	const network = useEntity(
		EntityType.XNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
			$$xUsers: {},
			$$xPosts: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<EntityView
	entityType={EntityType.XNetwork}
	{entityId}
	href={resolve('/(social)/x')}
	bind:open
	title="X"
>
	{#snippet Heading()}
		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			X (Twitter) profiles and posts: public text and media surfaced by the network hub.
		</p>
		<p>
			Not on-chain markets, Swarm blobs, Reddit, or end-to-end encrypted chat.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={network}
				placeholderText="Loading X network…"
			>
				{#snippet children(network)}
					<div>
						<dt>Profiles</dt>
						<dd>{String(network['$$xUsers'].length)}</dd>
					</div>
					<div>
						<dt>Posts</dt>
						<dd>{String(network['$$xPosts'].length)}</dd>
					</div>
					{#if contentOpen}
						<div>
							<dt>Protocol name</dt>
							<dd>{network.protocolName}</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.homeUrl}>
									{network.homeUrl}
								</a>
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						{#if network.docsUrl != null}
							{#if network.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={network.docsUrl}>
											{network.docsUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XNetwork}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels x-network-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-registry`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4 align-center"
					>
						<HeadingComponent>
							Directory & examples
						</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									X’s HTTP APIs identify users and posts with opaque string ids; tutorials often embed stable public examples for copy/paste.
								</p>
								<p>
									Search and timeline endpoints require OAuth or app-registered bearer tokens—rate limits and entitlements come from Twitter’s developer program, not from public HTML alone.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="About examples"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Profiles"
						href={`#${networkIdKey}:profiles`}
					>Profiles</a>
					<a
						data-scroll-marker-label="Recent posts"
						href={`#${networkIdKey}:recent-posts`}
					>Posts</a>
					<a
						data-scroll-marker-label="Examples"
						href={`#${networkIdKey}:examples-list`}
					>Examples</a>
				{/snippet}

				{#snippet children({ open: _o })}
					<section
						id={`${networkIdKey}:profiles`}
						data-scroll-marker-label="Profiles"
					>
						<XUsersView
							entityFieldReference={{
								entityType: EntityType.XNetwork,
								entityId,
								fieldName: '$$xUsers',
							}}
							href={resolve('/(social)/x')}
							id={`${networkIdKey}:users`}
							open={_open}
							title="Profiles"
						/>
					</section>

					<section
						id={`${networkIdKey}:recent-posts`}
						data-scroll-marker-label="Recent posts"
					>
						<XPostsView
							entityFieldReference={{
								entityType: EntityType.XNetwork,
								entityId,
								fieldName: '$$xPosts',
							}}
							href={resolve('/(social)/x')}
							id={`${networkIdKey}:posts`}
							open={_open}
							title="Recent posts"
						/>
					</section>

					<section
						id={`${networkIdKey}:examples-list`}
						data-scroll-marker-label="Examples"
					>
						<ul>
							<li>
								<a href={resolve('/(social)/x/user/[userId]', {
									userId: encodeURIComponent(exampleUserId),
								})}>
									Example user
								</a>
							</li>
							<li>
								<a href={resolve('/(social)/x/post/[postId]', {
									postId: examplePostId,
								})}>
									Example post
								</a>
							</li>
						</ul>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
