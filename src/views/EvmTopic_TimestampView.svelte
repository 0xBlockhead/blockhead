<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.EvmTopic_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmTopic_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmTopicTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			signatures: true,
		},
	}))
	const titleFallback = $derived('EVM topic observation')
	const viewDomId = $derived('evm-topic-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$topic !== undefined && pendingEntity.$topic.hex !== undefined ? resolve('/evm/topic/[hex=evmTopicHash]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			hex: String(pendingEntity.$topic.hex ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmTopicTimestamp}>
			{#snippet Pending()}
				{(prefetched.signatures ?? []).map((signature) => String(signature ?? "")).filter(Boolean).join(", ") || title || "EVM topic observation"}
			{/snippet}

			{#snippet children(entity)}
				{entity.signatures.values.map((signature) => String(signature ?? "")).filter(Boolean).join(", ") || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={evmTopicTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmTopicTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Topic</dt>
				<dd>
					<EvmTopicView
						selection={select(EntityType.EvmTopic, selection.entitySelector.$topic, {})}
						href={
							(selection.entitySelector.$topic.hex !== undefined ? resolve('/evm/topic/[hex=evmTopicHash]', {
								hex: String(selection.entitySelector.$topic.hex ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
						selection({
							sources: selection.sources,
							fields: {
								filteredSignatureCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const filteredSignatureCount = resolvedEntity.filteredSignatureCount}
						{#if filteredSignatureCount !== undefined && filteredSignatureCount !== null}
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
						selection({
							sources: selection.sources,
							fields: {
								verifiedCandidateCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const verifiedCandidateCount = resolvedEntity.verifiedCandidateCount}
						{#if verifiedCandidateCount !== undefined && verifiedCandidateCount !== null}
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
						selection({
							sources: selection.sources,
							fields: {
								reachable: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const reachable = resolvedEntity.reachable}
						{#if reachable !== undefined && reachable !== null}
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
