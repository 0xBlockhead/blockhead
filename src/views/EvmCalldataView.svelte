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
		title = 'Calldata',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmCalldata>
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

	const calldataIdKey = $derived(
		stringify(entityId),
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const calldata = useEntity(
		EntityType.EvmCalldata,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
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
	entityType={EntityType.EvmCalldata}
	{entityId}
	{title}
	{href}
	idDragPlainText={stringify(entityId)}
	bind:open
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Calldata is the opaque byte blob included with a call: its opening bytes pick the function schema, followed by ABI-packed arguments.
		</p>
		<p>
			Revert data and indexed events reuse similar hashing ideas but with different widths and meanings.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading calldata…"
			resource={calldata}
		>
			{#snippet children(calldata)}
				<div data-column="gap-1">
				<dl data-column-item="center">
					<div>
						<dt>Contract call data length</dt>
						<dd>{String((entityId.hex.length - 2) / 2)} bytes</dd>
					</div>
					{#if open}
						<div>
							<dt>Call/input data (<code>msg.data</code>)</dt>
							<dd>
								<TruncatedValue
									value={entityId.hex}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
				</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmCalldata}
			{entityId}
		/>

		{#if children}
			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`${calldataIdKey}:carousel-more`}
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
							href={`#${calldataIdKey}:page-content`}
						>Route</a>
					{/snippet}

					{#snippet children(_ctx)}
						<section
							id={`${calldataIdKey}:page-content`}
						>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>
