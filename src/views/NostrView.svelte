<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/nostr',
			entityId,
		),
					open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrNetwork>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.NostrNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					homeUrl: {},
					docsUrl: {},
					topology: {},
					$$nostrProfiles: {
						$: [
							Source.Constants_Internal,
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
					$$nostrNotes: {
						$: [Source.NostrBand_Rest],
					},
					$$nostrRelays: {
						$: [Source.NostrBand_Rest],
					},
					$$nostrReposts: {
						$: [Source.NostrBand_Rest],
					},
					$$nostrArticles: {
						$: [Source.NostrBand_Rest],
					},
				}
			:
				{}),
		},
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNetwork}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Nostr"
>
	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		Nostr
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Relays propagate signed events over WebSocket (<code>wss://</code>). Profiles (kind 0), notes (kind 1), reposts (kind 6), and articles (kind 30023) load here via Constants seeds plus NostrBand and Primal HTTP indexers—not direct relay subscriptions.
		</p>
		<p>
			Reactions (kind 7) resolve on each note’s <code>$$reactions</code> field, not as a standalone network registry slice. Author pubkeys and event ids are 64-character lowercase hex.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
			resource={network}
			placeholderText="Loading Nostr hub directory…"
			>
			{#snippet children(loadedNetwork)}
				{#if loadedNetwork.registryLabel}
					<div>
						<dt>Registry</dt>
						<dd>{loadedNetwork.registryLabel}</dd>
					</div>
					{:else if loadedNetwork.protocolName}
					<div>
						<dt>Protocol</dt>
						<dd>{loadedNetwork.protocolName}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Profiles</dt>
						<dd>{String(network.$$nostrProfiles.length)}</dd>
					</div>
					<div>
						<dt>Notes</dt>
						<dd>{String(network.$$nostrNotes.length)}</dd>
					</div>
					<div>
						<dt>Relays</dt>
						<dd>{String(network.$$nostrRelays.length)}</dd>
					</div>
					<div>
						<dt>Reposts</dt>
						<dd>{String(network.$$nostrReposts.length)}</dd>
					</div>
					<div>
						<dt>Articles</dt>
						<dd>{String(network.$$nostrArticles.length)}</dd>
					</div>

					{#if loadedNetwork.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
							<a href={loadedNetwork.homeUrl}>{loadedNetwork.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if loadedNetwork.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
							<a href={loadedNetwork.docsUrl}>{loadedNetwork.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if loadedNetwork.topology}
						<div>
							<dt>Topology</dt>
							<dd>{loadedNetwork.topology}</dd>
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
		{@const networkIdKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.NostrNetwork}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-feed`}
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
							Feed
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Recent notes"
						href={`#${networkIdKey}:notes`}
					>Notes</a>
					<a
						data-scroll-marker-label="Reposts"
						href={`#${networkIdKey}:reposts`}
					>Reposts</a>
					<a
						data-scroll-marker-label="Articles"
						href={`#${networkIdKey}:articles`}
					>Articles</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Recent notes">
						<NostrNotesView
							href={resolve('/nostr/notes')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNetwork,
								entityId,
								fieldName: '$$nostrNotes',
							}}
							fieldOpen={_sectionOpen}
							id={`${networkIdKey}:notes`}
							limit={25}
							open={_sectionOpen}
							title="Recent notes"
						/>
					</section>

					<section data-scroll-marker-label="Reposts">
						<NostrRepostsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNetwork,
								entityId,
								fieldName: '$$nostrReposts',
							}}
							fieldOpen={_sectionOpen}
							id={`${networkIdKey}:reposts`}
							limit={25}
							open={_sectionOpen}
							title="Recent reposts"
						/>
					</section>

					<section data-scroll-marker-label="Articles">
						<NostrArticlesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNetwork,
								entityId,
								fieldName: '$$nostrArticles',
							}}
							fieldOpen={_sectionOpen}
							id={`${networkIdKey}:articles`}
							limit={25}
							open={_sectionOpen}
							title="Recent articles"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-directory`}
				{...{ 'data-card': '' }}
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Directory
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Profiles"
						href={`#${networkIdKey}:profiles`}
					>Profiles</a>
					<a
						data-scroll-marker-label="Relays"
						href={`#${networkIdKey}:relays`}
					>Relays</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Profiles">
						<NostrProfilesView
							href={resolve('/nostr/profiles')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNetwork,
								entityId,
								fieldName: '$$nostrProfiles',
							}}
							id={`${networkIdKey}:profiles`}
							open={_sectionOpen}
						/>
					</section>

					<section data-scroll-marker-label="Relays">
						<NostrRelaysView
							href={resolve('/nostr/relays')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNetwork,
								entityId,
								fieldName: '$$nostrRelays',
							}}
							id={`${networkIdKey}:relays`}
							open={_sectionOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>

