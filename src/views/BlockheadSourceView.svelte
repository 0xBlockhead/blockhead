<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		children,
		sourceId,
		title = 'Resolver source',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			sourceId: string
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityId = (
		{ id: sourceId } satisfies EntityId<typeof schema, EntityType.BlockheadSource>
	)

	const sourceIdKey = $derived(
		stringify(entityId),
	)

	const sourceRow = useEntity(
		EntityType.BlockheadSource,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	{entityId}
	{title}
	bind:open
	{href}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={sourceRow}
			placeholderText="Loading source…"
		>
			{#snippet children()}
				{@render Id()}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Configured HTTP or GraphQL transport for chain or market APIs: base URL plus stable id for repeat requests.
				</p>
				<p>
					This is an application-layer data endpoint, not a browser wallet identity or an ephemeral debug session.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Source id</dt>
				<dd data-text="mono">{entityId.id}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadSource}
			{entityId}
		/>

		<div
			class="blockhead-source-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${sourceIdKey}:carousel-about`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4 align-center">
						<HeadingComponent>
							Data source
						</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Endpoint metadata labels the provider family—full nodes, indexers, or market REST/GraphQL roots—for repeatable HTTP routing.
								</p>
								<p>
									That sort of credential is unrelated to wallet signing sessions, offline simulators, or social inbox state.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Data source section"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Overview"
						href={`#${sourceIdKey}:source-overview`}
					>Overview</a>
				{/snippet}

				{#snippet children(_childrenContext)}
					<section id={`${sourceIdKey}:source-overview`}>
						{#if children}
							{@render children()}
						{/if}
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.blockhead-source-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
