<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'


	const entityId = (
		{
			scope: 'AtprotoNetwork' as const,
		} satisfies EntityId<typeof schema, EntityType.AtprotoNetwork>
	)

	const exampleDid = (
		'did:plc:z72i7hdynmk6r22z27h6tvur' as const
	)

	const examplePostUri = (
		'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3la6vijfoie2r' as const
	)

	let {
		open = $bindable(true),
	}: {
		open?: boolean
	} = $props()

	const networkIdKey = $derived(
		stringify(entityId),
	)

	const atprotoNetwork = useEntity(
		EntityType.AtprotoNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			...(open ?
				{
					protocolName: {},
					homeUrl: {},
					docsUrl: {},
					$$atprotoActors: {},
					$$atprotoPosts: {},
				}
			:
				{}),
		},
	)
</script>


<EntityView
	entityType={EntityType.AtprotoNetwork}
	{entityId}
	href={resolve('/(social)/atproto')}
	bind:open
	title="AT Protocol"
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.scope}
		</span>
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
		<ResourceBoundary
			resource={atprotoNetwork}
			placeholderText="Loading AT Protocol directory…"
		>
			{#snippet children(atprotoNetwork)}
				<dl data-column-item="center">
					{#if _contentOpen}
						<div>
							<dt>Protocol</dt>
							<dd>{atprotoNetwork.protocolName ?? 'AT Protocol'}</dd>
						</div>
					{/if}

					{#if _contentOpen}
						{#if atprotoNetwork.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={atprotoNetwork.homeUrl}>{atprotoNetwork.homeUrl}</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if _contentOpen}
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

					{#if _contentOpen}
						<div>
							<dt>Local ATProto cache</dt>
							<dd data-text="muted">
								{String(atprotoNetwork.$$atprotoActors?.length ?? 0)} accounts · {String(atprotoNetwork.$$atprotoPosts?.length ?? 0)} records
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.AtprotoNetwork}
			{entityId}
		/>

		<div
			class="atproto-network-detail-carousels"
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
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Directory & examples
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Accounts"
						href={`#${networkIdKey}:registry-actors`}
					>Accounts</a>
					<a
						data-scroll-marker-label="Recent posts"
						href={`#${networkIdKey}:registry-posts`}
					>Recent posts</a>
					<a
						data-scroll-marker-label="Example routes"
						href={`#${networkIdKey}:examples-list`}
					>Examples</a>
				{/snippet}

				{#snippet children()}
					<section
						data-scroll-marker-label="Accounts"
						id={`${networkIdKey}:registry-actors`}
					>
						<AtprotoActorsView
							entityFieldReference={{
								entityType: EntityType.AtprotoNetwork,
								entityId,
								fieldName: '$$atprotoActors',
							}}
							href={resolve('/(social)/atproto')}
							id={`${networkIdKey}:actors`}
							open={_open}
						/>
					</section>

					<section
						data-scroll-marker-label="Recent posts"
						id={`${networkIdKey}:registry-posts`}
					>
						<AtprotoPostsView
							entityFieldReference={{
								entityType: EntityType.AtprotoNetwork,
								entityId,
								fieldName: '$$atprotoPosts',
							}}
							fieldOpen={_open}
							href={resolve('/(social)/atproto')}
							id={`${networkIdKey}:posts`}
							open={_open}
							title="Recent posts"
						/>
					</section>

					<section
						data-scroll-marker-label="Example routes"
						id={`${networkIdKey}:examples-list`}
					>
						<ul>
							<li>
								<a href={resolve('/(social)/atproto/actor/[did]', {
									did: encodeURIComponent(exampleDid),
								})}>
									Actor example
								</a>
							</li>
							<li>
								<a href={resolve('/(social)/atproto/post/[uri]', {
									uri: encodeURIComponent(examplePostUri),
								})}>
									Post example
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
	.atproto-network-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
