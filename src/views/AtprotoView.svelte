<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { atprotoProbeDid, atprotoProbePostUri } from '$/constants/Social/Atproto.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/atproto',
			entityId,
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoNetwork>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const atprotoNetwork = useEntity(
		EntityType.AtprotoNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					homeUrl: {},
					docsUrl: {},
					topology: {},
					$$atprotoActors: {
						$: [
							Source.Constants_Internal,
							Source.Atproto_Xrpc,
							Source.Atproto_BskySocial_Xrpc,
						],
						$$posts: {
							$: [
								Source.Atproto_Xrpc,
								Source.Atproto_BskySocial_Xrpc,
							],
						},
					},
				}
			:
				{}),
		},
	)


	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoNetwork}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="AT Protocol"
>
	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		AT Protocol
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={atprotoNetwork}
			placeholderText="Loading AT Protocol directory…"
		>
			{#snippet children(atprotoNetwork)}
				{atprotoNetwork.protocolName ?? 'AT Protocol'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			The AT Protocol anchors accounts in DIDs served by personal data stores; lexicon schemas define posts, follows, and profile blobs replicated through relays as signed CAR commits.
		</p>
		<p>
			Actor and post counts in a hub snapshot cover only the handles and records that instance has synced—not every Bluesky-compatible identity on the network.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: _contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={atprotoNetwork}
				placeholderText="Loading AT Protocol directory…"
			>
				{#snippet children(atprotoNetwork)}
					{#if atprotoNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{atprotoNetwork.registryLabel}</dd>
						</div>
					{:else if atprotoNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{atprotoNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if _contentOpen}
						<div>
							<dt>Accounts</dt>
							<dd>{String(atprotoNetwork.$$atprotoActors?.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Posts</dt>
							<dd>{String(
								(atprotoNetwork.$$atprotoActors ?? [])
									.flatMap((actor) => actor.$$posts ?? [])
									.length
							)}</dd>
						</div>

						{#if atprotoNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{atprotoNetwork.topology}</dd>
							</div>
						{/if}

						{#if atprotoNetwork.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={atprotoNetwork.homeUrl}>{atprotoNetwork.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if atprotoNetwork.docsUrl != null && atprotoNetwork.docsUrl !== ''}
							<div>
								<dt>Documentation</dt>
								<dd>
									<a href={atprotoNetwork.docsUrl}>
										{atprotoNetwork.docsUrl}
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
		<EntityDetails
			entityType={EntityType.AtprotoNetwork}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels atproto-network-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-registry`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'registry-actors', label: 'Accounts' },
					{ id: 'registry-posts', label: 'Recent posts' },
					{ id: 'examples-list', label: 'Example routes' },
				]}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Directory & examples
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegistryActors({ id: _id, label: _label })}
					<AtprotoActorsView
						href={resolve('/atproto/actors')}
						entityFieldReference={{
							entityType: EntityType.AtprotoNetwork,
							entityId,
							fieldName: '$$atprotoActors',
						}}
						id={`${networkIdKey}:actors`}
						open={_open}
					/>
				{/snippet}

				{#snippet SectionRegistryPosts({ id: _id, label: _label })}
					<AtprotoPostsView
						href={resolve('/atproto/posts')}
						entityFieldReference={{
							entityType: EntityType.AtprotoNetwork,
							entityId,
							fieldName: '$$atprotoPosts',
						}}
						fieldOpen={_open}
						id={`${networkIdKey}:posts`}
						open={_open}
						title="Recent posts"
					/>
				{/snippet}

				{#snippet SectionExamplesList({ id: _id, label: _label })}
					<ul>
						<li>
							<a href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
								did: encodeURIComponent(atprotoProbeDid),
							})}>
								Actor example
							</a>
						</li>
						<li>
							<a href={resolve('/(social)/(atproto)/atproto/post/[uri]', {
								uri: encodeURIComponent(atprotoProbePostUri),
							})}>
								Post example
							</a>
						</li>
					</ul>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
