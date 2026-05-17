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
	import Collapsible from '$/components/Collapsible.svelte'
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

	const networkIdKey = stringify(entityId)


	// State
	let {
		open = $bindable(true),
	}: {
		open: boolean
	} = $props()

	const atprotoNetwork = useEntity(
		EntityType.AtprotoNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
			$$atprotoActors: {},
			$$atprotoPosts: {},
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

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={atprotoNetwork}>
			{#snippet children(n)}
				<dl>
					<div>
						<dt>Scope</dt>
						<dd>{entityId.scope}</dd>
					</div>
					<div>
						<dt>Actors</dt>
						<dd>{String(n.$$atprotoActors.length)}</dd>
					</div>
					<div>
						<dt>Posts</dt>
						<dd>{String(n.$$atprotoPosts.length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{n.protocolName ?? 'AT Protocol'}</dd>
						</div>
						{#if n.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={n.homeUrl}>{n.homeUrl}</a>
								</dd>
							</div>
						{/if}
						{#if n.docsUrl != null}
							{#if n.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={n.docsUrl}>
											{n.docsUrl}
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
			entityType={EntityType.AtprotoNetwork}
			{entityId}
		/>

		<div data-column="gap-3">
			<CollapsibleTabs
				id={`${networkIdKey}:registry`}
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
							Registry
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children({ open: _open })}
					<section data-scroll-marker-label="Actors">
						<AtprotoActorsView
							entityFieldReference={{
								entityType: EntityType.AtprotoNetwork,
								entityId,
								fieldName: '$$atprotoActors',
							}}
							href={resolve('/(social)/atproto')}
							id={`${networkIdKey}:actors`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Recent posts">
						<AtprotoPostsView
							entityFieldReference={{
								entityType: EntityType.AtprotoNetwork,
								entityId,
								fieldName: '$$atprotoPosts',
							}}
							href={resolve('/(social)/atproto')}
							id={`${networkIdKey}:posts`}
							open={false}
							title="Recent posts"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<Collapsible
				id={`${networkIdKey}:examples`}
				open={true}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Examples
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children({ open: _open })}
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
				{/snippet}
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
