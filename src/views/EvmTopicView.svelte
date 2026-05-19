<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmTopic>
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
			| 'Heading'
		>
	> = $props()

	const topicIdKey = $derived(
		stringify(entityId),
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const topic = useEntity(
		EntityType.EvmTopic,
		entityId,
		{
			$: [
				Source.Openchain_Rest,
			],
			...(open && {
				signatures: {},
			}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={topic}
			placeholderText="Loading event topic…"
		>
			{#snippet children(topic)}
				{topic.signatures?.[0] ?? entityId.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Receipt logs publish a small ordered list of 32-byte <strong>topics</strong>; the first is usually the fingerprint of the event declaration.
		</p>
		<p>
			Additional topics carry indexed arguments, while remaining fields encode in the log’s data. This differs from four-byte prefixes used on calldata or revert payloads.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
		<dl data-column-item="center">
			<div>
				<dt>Indexed log topic (topic N)</dt>
				<dd>
					<TruncatedValue
						value={entityId.hex}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary
					resource={topic}
					placeholderText="Loading event ABI fragments…"
				>
					{#snippet children(topic)}
						{#if topic.signatures?.length}
							<div>
								<dt>Decoded logs (indexed args / event defs)</dt>
								<dd>
									<ul>
										{#each topic.signatures as sig (sig)}
											<li><code>{sig}</code></li>
										{/each}
									</ul>
								</dd>
							</div>
						{:else}
							<div>
								<dt>Decoded logs (indexed args / event defs)</dt>
								<dd>
									<p data-text="muted">No ABI fragments matched this indexed log topic.</p>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
		</div>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmTopic}
			{entityId}
		/>

		{#if children}
			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`${topicIdKey}:carousel-more`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<Heading>Page</Heading>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Route"
							href={`#${topicIdKey}:page-content`}
						>Route</a>
					{/snippet}

					{#snippet children(_ctx)}
						<section id={`${topicIdKey}:page-content`}>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>
