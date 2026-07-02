<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const evmErrorTimestamp = $derived(selection({
		sources: [
			Source.Openchain_Rest,
		],
		fields: {
			signatures: true,
			...(open && {
				filteredSignatureCount: true,
				verifiedCandidateCount: true,
				reachable: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).signatures) ?? '')].filter(Boolean).join(' ') || 'EVM error observation')
	const viewDomId = $derived('evm-error-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).signatures) ?? '')].filter(Boolean).join(' ') || title || 'EVM error observation'}
		{:else}
			<ResourceBoundary resource={evmErrorTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).signatures) ?? '')].filter(Boolean).join(' ') || title || 'EVM error observation'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.signatures) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmErrorTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmErrorTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
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
				<dt>Error</dt>
				<dd>
					<EvmErrorView
						selection={select(EntityType.EvmError, selection.entitySelector.$error)}
						href={
							resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
								hex: String(selection.entitySelector.$error.hex),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={evmErrorTimestamp}>
					{#snippet Pending()}
						{@const filteredSignatureCount = prefetched.filteredSignatureCount ?? selection.entitySelector.filteredSignatureCount}
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
						{@const filteredSignatureCount = entity.filteredSignatureCount ?? selection.entitySelector.filteredSignatureCount ?? prefetched.filteredSignatureCount}
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
				<ResourceBoundary resource={evmErrorTimestamp}>
					{#snippet Pending()}
						{@const verifiedCandidateCount = prefetched.verifiedCandidateCount ?? selection.entitySelector.verifiedCandidateCount}
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
						{@const verifiedCandidateCount = entity.verifiedCandidateCount ?? selection.entitySelector.verifiedCandidateCount ?? prefetched.verifiedCandidateCount}
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
				<ResourceBoundary resource={evmErrorTimestamp}>
					{#snippet Pending()}
						{@const reachable = prefetched.reachable ?? selection.entitySelector.reachable}
						{#if reachable !== undefined && reachable !== null}
							<div>
								<dt>Reachable</dt>
								<dd>
									{String((reachable) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const reachable = entity.reachable ?? selection.entitySelector.reachable ?? prefetched.reachable}
						{#if reachable !== undefined && reachable !== null}
							<div>
								<dt>Reachable</dt>
								<dd>
									{String((reachable) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
