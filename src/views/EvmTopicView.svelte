<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		href = getEvmTopicPath(entityId.hex),
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmTopic>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { getEvmTopicPath } from '$/lib/signature-paths.ts'
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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={topic}
			placeholderText="Loading log topic…"
		>
			{#snippet children(loadedTopic)}
				{#if loadedTopic.signatures?.[0]}
					{loadedTopic.signatures[0]}
				{:else}
					{@render Value()}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={topic}
			placeholderText="Loading log topic…"
		>
			{#snippet children(loadedTopic)}
				{loadedTopic.signatures?.[0] ?? entityId.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Receipt logs publish a small ordered list of 32-byte <strong>topics</strong>; topic 0 often fingerprints an ABI log declaration when one exists.
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
						<dt>Indexed log topic (topic N)</dt>
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
					resource={topic}
					placeholderText="Loading topic catalog signatures…"
				>
					{#snippet children(loadedTopic)}
						{#if loadedTopic.signatures?.length}
							<div>
								<dt>Catalog signatures</dt>
								<dd>
									<ul>
										{#each loadedTopic.signatures as sig (sig)}
											<li><code>{sig}</code></li>
										{/each}
									</ul>
								</dd>
							</div>
						{:else}
							<div>
								<dt>Catalog signatures</dt>
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

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.EvmTopic}
			{entityId}
		/>
	{/snippet}
</EntityView>
