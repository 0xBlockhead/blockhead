<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const calldataKey = $derived(
		stringify(entityId),
	)

	const calldata = useEntity(
		EntityType.EvmCalldata,
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	bind:open
	{entityId}
	{href}
	{title}
	{...entityViewRest}
>
	{#snippet Heading()}
		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Raw calldata</strong>
			is ABI-encoded execution bytes (<code>0x</code>
			prefix; four-byte selector then arguments). Match length and selector to the contract you target before any wallet prompt—human-readable strings are not calldata.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
			<dl data-column-item="center">
			<div>
				<dt>Calldata</dt>
				<dd>
					<TruncatedValue
						value={entityId.hex}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>

			<div>
				<dt>Payload length</dt>
				<dd>
					{String((entityId.hex.length - 2) / 2)}
					bytes
					<span data-text="muted">
						(nibble-prefixed <code>0x</code>
						hex; leading four bytes are the selector when invoking a contract)
					</span>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary
					placeholderText="Loading calldata…"
					resource={calldata}
				>
					{#snippet children(calldata)}
						<div>
							<dt>Hex</dt>
							<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Visual}
									value={entityId.hex}
								/>
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EvmCalldata}
			{entityId}
		/>

		{#if children}
			<div
				class="calldata-carousel-groups"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`${calldataKey}:carousel-extra`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>
								More
							</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Content"
							href={`#${calldataKey}:calldata-extra`}
						>Content</a>
					{/snippet}

					{#snippet children(_childrenContext)}
						<section id={`${calldataKey}:calldata-extra`}>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>


<style>
	.calldata-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
