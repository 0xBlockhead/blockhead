<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmError_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmError_Timestamp>>
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
	const evmErrorTimestamp = $derived(selection({
		sources: [
			Source.Openchain_Rest,
		],
		fields: {
			signatures: true,
		},
	}))
	const titleFallback = $derived('EVM error observation')
	const viewDomId = $derived('evm-error-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$error !== undefined && pendingEntity.$error.hex !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(evm)/evm/(errors)/error/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			hex: String(pendingEntity.$error.hex ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmErrorTimestamp}>
			{#snippet Pending()}
				{(prefetched.signatures ?? []).map((signature) => String(signature ?? "")).filter(Boolean).join(", ") || title || "EVM error observation"}
			{/snippet}

			{#snippet children(entity)}
				{entity.signatures.values.map((signature) => String(signature ?? "")).filter(Boolean).join(", ") || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmErrorTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmErrorTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Error</dt>
				<dd>
					<EvmErrorView
						selection={select(EntityType.EvmError, selection.entitySelector.$error, {})}
						href={
							(selection.entitySelector.$error.hex !== undefined ? resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
								hex: String(selection.entitySelector.$error.hex ?? ''),
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
								<p data-text="muted">No catalog matches for this revert/error selector.</p>
							{/if}
						</dd>
					</div>
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								filteredSignatureCount: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const filteredSignatureCount = prefetched.filteredSignatureCount}
						{#if filteredSignatureCount !== undefined && filteredSignatureCount !== null}
							<div>
								<dt>Filtered signature count</dt>
								<dd>
									<NumberValue value={Number(filteredSignatureCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const filteredSignatureCount = resolvedEntity.filteredSignatureCount}
						{#if filteredSignatureCount !== undefined && filteredSignatureCount !== null}
							<div>
								<dt>Filtered signature count</dt>
								<dd>
									<NumberValue value={Number(filteredSignatureCount)} />
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
							fields: {
								verifiedCandidateCount: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const verifiedCandidateCount = prefetched.verifiedCandidateCount}
						{#if verifiedCandidateCount !== undefined && verifiedCandidateCount !== null}
							<div>
								<dt>Verified candidate count</dt>
								<dd>
									<NumberValue value={Number(verifiedCandidateCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const verifiedCandidateCount = resolvedEntity.verifiedCandidateCount}
						{#if verifiedCandidateCount !== undefined && verifiedCandidateCount !== null}
							<div>
								<dt>Verified candidate count</dt>
								<dd>
									<NumberValue value={Number(verifiedCandidateCount)} />
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
							fields: {
								reachable: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const reachable = prefetched.reachable}
						{#if reachable !== undefined && reachable !== null}
							<div>
								<dt>Reachable</dt>
								<dd>
									{reachable ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}

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
