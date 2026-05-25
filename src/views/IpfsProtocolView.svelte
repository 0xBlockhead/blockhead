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
			'/ipfs',
			entityId,
		),
					open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.IpfsProtocol>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const protocol = useEntity(
		EntityType.IpfsProtocol,
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
	import IpfsBrowseView from '$/views/IpfsBrowseView.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsProtocol}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="IPFS"
>
	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		IPFS
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			IPFS content is addressed by CIDs and IPNS names; public gateways resolve bytes for browse and detail pages.
		</p>
		<p>
			This is not Swarm BZZ storage—use the Swarm hub for <code>bzz://</code> references.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={protocol}
				placeholderText="Loading IPFS protocol…"
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
			entityType={EntityType.IpfsProtocol}
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
							IPFS
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
							<IpfsBrowseView />
						{/if}
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>
