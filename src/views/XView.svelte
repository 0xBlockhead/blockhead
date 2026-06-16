<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		href = resolve('/x'),
		open = $bindable(true),
	} = $props()

	import { stringify } from 'devalue'

	import { subscribe } from '$/routes/+layout.svelte'

	const selector: EntitySelector<typeof schema, EntityType.XNetwork> = {
		scope: 'XNetwork',
	}

	const exampleUserId = '783214'
	const examplePostId = '1955274825074221427'

	const networkSelectorKey = $derived(stringify(selector))

	const network = $derived(
		subscribe(EntityType.XNetwork,
			selector,
			({ sources: [Source.Constants_Internal], fields: { protocolName: true, homeUrl: true, docsUrl: true, registryLabel: true, topology: true, $$xUsers: ({ sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				] }), $$xPosts: ({ sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				] }) } }),
		),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<EntityView
	entityType={EntityType.XNetwork}
	entitySelector={selector}
	href={href}
	bind:open
	title="X"
>
	{#snippet Value()}
		X
	{/snippet}

	{#snippet Title()}
		X
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
							<dd>{String(network.fields.$$xUsers?.values.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Posts</dt>
							<dd>{String(network.fields.$$xPosts?.values.length ?? 0)}</dd>
						</div>
					{#if contentOpen}
						<div>
							<dt>Protocol</dt>
							<dd>{network.fields.protocolName}</dd>
						</div>

						<div>
							<dt>Registry</dt>
							<dd>{network.fields.registryLabel}</dd>
						</div>

						<div>
							<dt>Topology</dt>
							<dd>{network.fields.topology}</dd>
						</div>

						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.fields.homeUrl}>
									{network.fields.homeUrl}
								</a>
							</dd>
						</div>

						{#if network.fields.docsUrl != null && network.fields.docsUrl !== ''}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={network.fields.docsUrl}>
										{network.fields.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
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
			sections={collapsibleTabsSections([
				{ id: 'profiles', label: 'Profiles' },
				{ id: 'recent-posts', label: 'Recent posts' },
				{ id: 'examples-xNetworks', label: 'Examples' },
			])}
			id={`${networkSelectorKey}:carousel-registry`}
			data-card
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
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/x/users')}
					entityFieldReference={{
						entityType: EntityType.XNetwork,
						selector,
						fieldName: '$$xUsers',
					}}
					id={`${networkSelectorKey}:users`}
					open={_open}
					title="Profiles"
				/>
			{/snippet}

			{#snippet SectionRecentPosts({ id, label })}
				<XPostsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/x/posts')}
					entityFieldReference={{
						entityType: EntityType.XNetwork,
						selector,
						fieldName: '$$xPosts',
					}}
					id={`${networkSelectorKey}:posts`}
					open={_open}
					title="Recent posts"
				/>
			{/snippet}

			{#snippet SectionExamplesList({ id, label })}
				<ul>
					<li>
						<a href={resolve('/(social)/(x)/x/user/[userId]', {
							userId: encodeURIComponent(exampleUserId),
						})}>
							Example user
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/(x)/x/post/[postId]', {
							postId: examplePostId,
						})}>
							Example post
						</a>
					</li>
				</ul>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
