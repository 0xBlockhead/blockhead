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
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/swarm'),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.SwarmProtocol>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SwarmBrowseView from '$/views/SwarmBrowseView.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmProtocol}
	entitySelector={selector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Swarm"
>
	{#snippet Value()}
		{selector.scope}
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
				resource={select(EntityType.SwarmProtocol,
						selector,
						({ sources: [Source.Constants_Internal], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true }) : ({  })) } }),
					)}
				placeholderText="Loading Swarm protocol…"
			>
				{#snippet children(protocol)}
					{#if protocol.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{protocol.fields.registryLabel}</dd>
						</div>
					{:else if protocol.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{protocol.fields.protocolName}</dd>
						</div>
					{/if}

					{#if (
						open
						&& protocol.fields.homeUrl
					)}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={protocol.fields.homeUrl}>{protocol.fields.homeUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& protocol.fields.docsUrl
					)}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={protocol.fields.docsUrl}>{protocol.fields.docsUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& protocol.fields.topology
					)}
						<div>
							<dt>Topology</dt>
							<dd>{protocol.fields.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const protocolSelectorKey = stringify(selector)}
		<CollapsibleTabs
			id={`${protocolSelectorKey}:browse`}
			sectionIdPrefix={protocolSelectorKey}
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
