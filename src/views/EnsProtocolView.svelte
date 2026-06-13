<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/ens'),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsProtocol>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const protocol = subscribe(EntityType.EnsProtocol,
		entityId,
		({ sources: [Source.Constants_Internal], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true }) : ({  })) } }),
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
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
			Browse resolves names to EnsName detail pages; this hub does not ensProtocols every registered name.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={protocol}
				placeholderText="Loading ENS protocol…"
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
						ENS
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBrowse({ id, label })}
				<EnsBrowseView />
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>
