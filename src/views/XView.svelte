<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		href = resolve('/x'),
		open = $bindable(true),
	} = $props()

	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

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
			registryLabel: {},
			topology: {},
			$$xUsers: {
				$: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			},
			$$xPosts: {
				$: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			},
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
	href={href}
	bind:open
	title="X"
>
	{#snippet Value()}
		{entityId.scope}

	{/snippet}

	{#snippet Title()}
		X
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
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
				{#snippet children(loadedNetwork)}
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
							<dd>{loadedNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Registry label</dt>
							<dd>{loadedNetwork.registryLabel}</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Topology</dt>
							<dd>{loadedNetwork.topology}</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={loadedNetwork.homeUrl}>
									{loadedNetwork.homeUrl}
								</a>
							</dd>
						</div>
					{/if}

					{#if (
						contentOpen
						&& network.docsUrl != null
						&& network.docsUrl !== ''
					)}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={loadedNetwork.docsUrl}>
									{loadedNetwork.docsUrl}
								</a>
							</dd>
						</div>
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
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'profiles', label: 'Profiles' },
					{ id: 'recent-posts', label: 'Recent posts' },
					{ id: 'examples-list', label: 'Examples' },
				]}
				id={`${networkIdKey}:carousel-registry`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
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

				{#snippet SectionProfiles({ id, label })}
					<XUsersView
						href={resolve('/x/users')}
						entityFieldReference={{
							entityType: EntityType.XNetwork,
							entityId,
							fieldName: '$$xUsers',
						}}
						id={`${networkIdKey}:users`}
						open={_open}
						title="Profiles"
					/>
				{/snippet}

				{#snippet SectionRecentPosts({ id, label })}
					<XPostsView
						href={resolve('/x/posts')}
						entityFieldReference={{
							entityType: EntityType.XNetwork,
							entityId,
							fieldName: '$$xPosts',
						}}
						id={`${networkIdKey}:posts`}
						open={_open}
						title="Recent posts"
					/>
				{/snippet}

				{#snippet SectionExamplesList({ id, label })}
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
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

