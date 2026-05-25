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
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/ens',
			entityId,
		),
					open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsProtocol>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const protocol = useEntity(
		EntityType.EnsProtocol,
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
				}
			:
				{}),
		},
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EnsBrowseView from '$/views/EnsBrowseView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsProtocol}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="ENS"
>
	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		ENS
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Ethereum Name Service maps human-readable names to resolver records on Ethereum mainnet.
		</p>
		<p>
			Browse resolves names to EnsName detail pages; this hub does not list every registered name.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={protocol}
				placeholderText="Loading ENS protocol…"
			>
				{#snippet children(loadedProtocol)}
					{#if loadedProtocol.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{loadedProtocol.registryLabel}</dd>
						</div>
					{:else if loadedProtocol.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{loadedProtocol.protocolName}</dd>
						</div>
					{/if}

					{#if (
						open
						&& protocol.homeUrl
					)}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={loadedProtocol.homeUrl}>{loadedProtocol.homeUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& protocol.docsUrl
					)}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={loadedProtocol.docsUrl}>{loadedProtocol.docsUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& protocol.topology
					)}
						<div>
							<dt>Topology</dt>
							<dd>{loadedProtocol.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const protocolIdKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.EnsProtocol}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${protocolIdKey}:browse`}
				{...{ 'data-card': '' }}
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							ENS
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Browse"
						href={`#${protocolIdKey}:browse`}
					>Browse</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section
						id={`${protocolIdKey}:browse`}
						data-scroll-marker-label="Browse"
					>
						{#if _sectionOpen}
							<EnsBrowseView />
						{/if}
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>
