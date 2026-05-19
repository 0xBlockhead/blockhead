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
			entityId: EntityId<typeof schema, EntityType.EvmError>
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

	const errorIdKey = $derived(
		stringify(entityId),
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const evmError = useEntity(
		EntityType.EvmError,
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
	entityType={EntityType.EvmError}
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
			resource={evmError}
			placeholderText="Loading error…"
		>
			{#snippet children(e)}
				{e.signatures?.[0] ?? entityId.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Failing execution returns revert bytes prefixed by four bytes naming the ABI error variant, followed by encoded fields (often including human-readable envelopes).
				</p>
				<p>
					Catalog lookups interpret those prefixes like contract call selectors—still separate from thirty-two-byte fingerprint headers on event logs.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
		<dl data-column-item="center">
			<div>
				<dt>Revert selector (4-byte)</dt>
				<dd>
					<TruncatedValue
						value={entityId.hex}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary
					resource={evmError}
					placeholderText="Loading catalog matches…"
				>
					{#snippet children(e)}
						{#if e.signatures?.length}
							<div>
								<dt>
									Decoded revert / custom error selectors
								</dt>
								<dd>
									<ul>
										{#each e.signatures as sig (sig)}
											<li><code>{sig}</code></li>
										{/each}
									</ul>
								</dd>
							</div>
						{:else}
							<div>
								<dt>
									Decoded revert / custom error selectors
								</dt>
								<dd>
									<p data-text="muted">No catalog matches for this revert/error selector.</p>
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
			entityType={EntityType.EvmError}
			{entityId}
		/>

		{#if children}
			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`${errorIdKey}:carousel-more`}
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
							href={`#${errorIdKey}:page-content`}
						>Route</a>
					{/snippet}

					{#snippet children(_ctx)}
						<section
							id={`${errorIdKey}:page-content`}
						>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>
