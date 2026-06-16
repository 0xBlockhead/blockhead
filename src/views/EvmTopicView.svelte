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
			selector: EntitySelector<typeof schema, EntityType.EvmTopic>
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
		hrefProp ?? resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
			hex: selector.hex,
		}),
	)

	const topic = $derived(
		subscribe(EntityType.EvmTopic,
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
	entityType={EntityType.EvmTopic}
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
			resource={topic}
			placeholderText="Loading log topic…"
		>
			{#snippet children(topic)}
				{topic.fields.signatures?.[0] ?? selector.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Receipt logs publish a small ordered evmTopics of 32-byte <strong>topics</strong>; topic 0 often fingerprints an ABI log declaration when one exists.
		</p>
		<p>
			Additional topics carry indexed arguments, while remaining fields encode in the log’s data. This differs from four-byte prefixes used on calldata or revert payloads.
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
						<dt>Topic</dt>
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
						resource={topic}
						placeholderText="Loading topic catalog signatures…"
					>
						{#snippet children(topic)}
							{#if topic.fields.signatures?.length}
								<div>
									<dt>Signatures</dt>
									<dd>
										<ul>
											{#each topic.fields.signatures as sig (sig)}
												<li><code>{sig}</code></li>
											{/each}
										</ul>
									</dd>
								</div>
							{:else}
								<div>
									<dt>Signatures</dt>
									<dd>
										<p data-text="muted">No catalog signatures matched this log topic hash.</p>
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
