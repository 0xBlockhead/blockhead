<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href: hrefProp,
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
			selector: EntitySelector<typeof schema, EntityType.EvmSelector>
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

	import { subscribe } from '$/routes/+layout.svelte'

	const href = $derived(
		hrefProp ?? resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
			hex: selector.hex,
		}),
	)

	const decodedSelector = $derived(
		subscribe(EntityType.EvmSelector,
			selector,
			({ sources: [
					Source.Openchain_Rest,
				], fields: { ...(open && ({ signatures: true })) } }),
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmSelector}
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
			resource={decodedSelector}
			placeholderText="Loading decoded function selector…"
		>
			{#snippet children(selector)}
				{selector.fields.signatures?.[0] ?? selector.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			The first four bytes of a contract call identify which function ABI follows; the rest carries encoded arguments.
		</p>
		<p>
			Revert payloads use another four-byte family of codes, still different from full-width log topic hashes on receipt logs.
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
					<div>
						<dt>Signatures</dt>
						<dd>
							<ResourceBoundary
								resource={selector}
								placeholderText="Loading decoded calldata prefixes…"
							>
								{#snippet children(selector)}
									{#if selector.fields.signatures?.length}
										<ul>
											{#each selector.fields.signatures as sig (sig)}
												<li><code>{sig}</code></li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">No ABI signatures matched this function selector.fields.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			</dl>
		</div>
	{/snippet}
</EntityView>
