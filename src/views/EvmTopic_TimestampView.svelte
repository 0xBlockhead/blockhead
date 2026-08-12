<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmTopic_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Openchain_Rest,
			Source.FourByteDirectory_Rest,
		],
	}))
	const titleFallback = $derived((prefetched.signatures?.values.join(', ') ?? '') || 'EVM topic observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						signatures: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{entity.signatures.values.join(', ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Topic</dt>
				<dd>
					<EvmTopicView
						selection={select(EntityType.EvmTopic, selection.entitySelector.$topic)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatures: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					<div>
						<dt>Signatures</dt>
						<dd>
							{#if entity.signatures.values.length}
								<ul>
									{#each entity.signatures.values as signature (signature)}
										<li><code>{signature}</code></li>
									{/each}
								</ul>
							{:else}
								<p data-text="muted">No catalog signatures matched this log topic hash.</p>
							{/if}
						</dd>
					</div>
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								filteredSignatureCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const filteredSignatureCount = entity.filteredSignatureCount}
						{#if filteredSignatureCount != null}
							<div>
								<dt>Filtered signature count</dt>
								<dd>
									<NumberValue
										value={filteredSignatureCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								verifiedCandidateCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const verifiedCandidateCount = entity.verifiedCandidateCount}
						{#if verifiedCandidateCount != null}
							<div>
								<dt>Verified candidate count</dt>
								<dd>
									<NumberValue
										value={verifiedCandidateCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								reachable: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const reachable = entity.reachable}
						{#if reachable != null}
							<div>
								<dt>Reachable</dt>
								<dd>
									{reachable ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
