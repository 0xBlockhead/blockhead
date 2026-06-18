<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/nostr'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NostrNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	}


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
	entitySelector={selector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Nostr"
>
	{#snippet Value()}
		Nostr
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

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={select(EntityType.NostrNetwork, selector, ({ sources: [
						Source.Constants_Internal,
					], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true, $$nostrProfiles: ({ sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								] }), $$nostrNotes: ({ sources: [Source.NostrBand_Rest] }), $$nostrRelays: ({ sources: [Source.NostrBand_Rest] }), $$nostrReposts: ({ sources: [Source.NostrBand_Rest] }), $$nostrArticles: ({ sources: [Source.NostrBand_Rest] }) }) : ({  })) } }))}
				placeholderText="Loading Nostr hub directory…"
			>
			{#snippet children(network)}
				{#if network.fields.registryLabel}
					<div>
						<dt>Registry</dt>
						<dd>{network.fields.registryLabel}</dd>
					</div>
				{:else if network.fields.protocolName}
					<div>
						<dt>Protocol</dt>
						<dd>{network.fields.protocolName}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Profiles</dt>
						<dd>{String(network.fields.$$nostrProfiles.values.length)}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Notes</dt>
						<dd>{String(network.fields.$$nostrNotes.values.length)}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Relays</dt>
						<dd>{String(network.fields.$$nostrRelays.values.length)}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Reposts</dt>
						<dd>{String(network.fields.$$nostrReposts.values.length)}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Articles</dt>
						<dd>{String(network.fields.$$nostrArticles.values.length)}</dd>
					</div>
				{/if}

				{#if open && network.fields.homeUrl}
					<div>
						<dt>Home</dt>
						<dd>
							<a href={network.fields.homeUrl}>{network.fields.homeUrl}</a>
						</dd>
					</div>
				{/if}

				{#if open && network.fields.docsUrl}
					<div>
						<dt>Docs</dt>
						<dd>
							<a href={network.fields.docsUrl}>{network.fields.docsUrl}</a>
						</dd>
					</div>
				{/if}

				{#if open && network.fields.topology}
					<div>
						<dt>Topology</dt>
						<dd>{network.fields.topology}</dd>
					</div>
				{/if}
			{/snippet}
		</ResourceBoundary>
	</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const networkSelectorKey = stringify(selector)}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-feed`}
			sectionIdPrefix={networkSelectorKey}
			sections={collapsibleTabsSections([
				{ id: 'notes', label: 'Recent notes' },
				{ id: 'reposts', label: 'Reposts' },
				{ id: 'articles', label: 'Articles' },
			])}
			data-card
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

			{#snippet SectionNotes()}
				<NostrNotesView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/nostr/notes')}
					selection={select(
			EntityType.NostrNetwork,
			selector
		).$$nostrNotes}
					fieldOpen={_open}
					id={`${networkSelectorKey}:notes`}
					limit={25}
					open={_open}
					title="Recent notes"
				/>
			{/snippet}

			{#snippet SectionReposts()}
				<NostrRepostsView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.NostrNetwork,
			selector
		).$$nostrReposts}
					fieldOpen={_open}
					id={`${networkSelectorKey}:reposts`}
					limit={25}
					open={_open}
					title="Recent reposts"
				/>
			{/snippet}

			{#snippet SectionArticles()}
				<NostrArticlesView
					CollapsibleProps={{ canToggle: false }}
					selection={select(
			EntityType.NostrNetwork,
			selector
		).$$nostrArticles}
					fieldOpen={_open}
					id={`${networkSelectorKey}:articles`}
					limit={25}
					open={_open}
					title="Recent articles"
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-directory`}
			sectionIdPrefix={networkSelectorKey}
			sections={collapsibleTabsSections([
				{ id: 'profiles', label: 'Profiles' },
				{ id: 'relays', label: 'Relays' },
			])}
			data-card
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

			{#snippet SectionProfiles()}
				<NostrProfilesView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/nostr/profiles')}
					selection={select(
			EntityType.NostrNetwork,
			selector
		).$$nostrProfiles}
					id={`${networkSelectorKey}:profiles`}
					open={true}
				/>
			{/snippet}

			{#snippet SectionRelays()}
				<NostrRelaysView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/nostr/relays')}
					selection={select(
			EntityType.NostrNetwork,
			selector
		).$$nostrRelays}
					id={`${networkSelectorKey}:relays`}
					open={true}
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
