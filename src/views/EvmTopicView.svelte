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
			entityId: EntityId<typeof schema, EntityType.EvmTopic>
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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic}
	{entityId}
	{href}
	{layout}
	{summaryUsesHeading}
	bind:open
	{collapsible}
	{...entityViewRest}
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
			{#snippet children(topic)}
				{#if topic.signatures?.[0]}
					{topic.signatures[0]}
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
			{#snippet children(topic)}
				{topic.signatures?.[0] ?? entityId.hex}
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
					{#snippet children(topic)}
						{#if topic.signatures?.length}
							<div>
								<dt>Catalog signatures</dt>
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

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmTopic}
			{entityId}
		/>

		{#if _children}
			<section id={`${topicIdKey}:page-content`}>
				{@render _children()}
			</section>
		{/if}
	{/snippet}
</EntityView>
