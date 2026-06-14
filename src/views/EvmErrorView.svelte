<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	let {
		selector,
		href = getEvmErrorPath(selector.hex),
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmError>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	import { getEvmErrorPath } from '$/lib/signature-paths.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const evmError = subscribe(EntityType.EvmError,
		selector,
		({ sources: [
				Source.Openchain_Rest,
			], fields: { ...(open && ({ signatures: true })) } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selector.hex}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={evmError}
			placeholderText="Loading error…"
		>
			{#snippet children(evmError)}
				{evmError.fields.signatures?.[0] ?? selector.hex}
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
							<dt>Selector</dt>
						<dd>
							<TruncatedValue
								value={selector.hex}
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
							{#if evmError.fields.signatures?.length}
								<div>
										<dt>Signatures</dt>
									<dd>
										<ul>
											{#each evmError.fields.signatures as sig (sig)}
												<li><code>{sig}</code></li>
											{/each}
										</ul>
									</dd>
								</div>
							{:else}
								<div>
										<dt>Signatures</dt>
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
</EntityView>
