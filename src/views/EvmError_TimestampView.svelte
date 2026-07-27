<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmError_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Openchain_Rest,
		],
	}))
	const evmErrorTimestamp = $derived(viewSelection({
		fields: {
			signatures: true,
		},
	}))
	const titleFallback = $derived(pendingEntity.signatures.values.join(', ') || 'EVM error observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				hex: String(selection.entitySelector.$error.hex),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmErrorTimestamp}>
			{#snippet children(entity)}
				{entity.signatures.values.join(', ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Error</dt>
				<dd>
					<EvmErrorView
						selection={select(EntityType.EvmError, selection.entitySelector.$error)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
								<p data-text="muted">No catalog matches for this revert/error selector.</p>
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
