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


	// State
	let {
		entityId,
		href = resolve(
			'/swarm',
			entityId,
		),
					open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SwarmProtocol>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const protocol = useEntity(
		EntityType.SwarmProtocol,
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
	import SwarmBrowseView from '$/views/SwarmBrowseView.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmProtocol}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Swarm"
>
	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		Swarm
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Swarm stores content under BZZ references resolved through Bee gateways—not IPFS CIDs.
		</p>
		<p>
			Browse accepts raw hex references, <code>bzz://</code> URIs, or public gateway URLs.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={protocol}
				placeholderText="Loading Swarm protocol…"
			>
				{#snippet children(protocol)}
					{#if protocol.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{protocol.registryLabel}</dd>
						</div>
					{:else if protocol.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{protocol.protocolName}</dd>
						</div>
					{/if}

					{#if (
						open
						&& protocol.homeUrl
					)}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={protocol.homeUrl}>{protocol.homeUrl}</a>
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
								<a href={protocol.docsUrl}>{protocol.docsUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& protocol.topology
					)}
						<div>
							<dt>Topology</dt>
							<dd>{protocol.topology}</dd>
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
		<CollapsibleTabs
				id={`${protocolIdKey}:browse`}
				sectionIdPrefix={protocolIdKey}
				sections={[
					{ id: 'browse', label: 'Browse' },
				]}
				data-card
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Swarm
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBrowse()}
					<SwarmBrowseView />
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
