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
		children: _children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmError>
			href: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError}
	{entityId}
	{href}
	{layout}
	{summaryUsesHeading}
	bind:open
	{collapsible}
	{...entityViewRest}
>
	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={evmError}
			placeholderText="Loading error…"
		>
			{#snippet children(evmError)}
				{evmError.signatures?.[0] ?? entityId.hex}
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

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				{#if !summaryUsesHeading}
					<div>
						<dt>Revert selector (4-byte)</dt>
						<dd>
							<TruncatedValue
								value={entityId.hex}
								format={TruncatedValueFormat.Visual}
							/>
						</dd>
					</div>
				{/if}
				{#if contentOpen}
					<ResourceBoundary
						resource={evmError}
						placeholderText="Loading catalog matches…"
					>
						{#snippet children(evmError)}
							{#if evmError.signatures?.length}
								<div>
									<dt>
										Decoded revert / custom error selectors
									</dt>
									<dd>
										<ul>
											{#each evmError.signatures as sig (sig)}
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

		{#if _children}
			<section id={`${errorIdKey}:page-content`}>
				{@render _children()}
			</section>
		{/if}
	{/snippet}
</EntityView>
