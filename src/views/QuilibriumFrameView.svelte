<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.QuilibriumFrame>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.QuilibriumFrame>
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
	const quilibriumFrame = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			frameHash: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			frameHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.frameNumber) ?? '')].filter(Boolean).join(' ') || 'quilibrium frame')
	const viewDomId = $derived('quilibrium-frame-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import QuilibriumShardView from '$/views/QuilibriumShardView.svelte'
	import QuilibriumProverView from '$/views/QuilibriumProverView.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumFrame}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'frameHash')}
			{@const frameNumber0 = pendingEntity.frameNumber}
			{#if frameNumber0 !== undefined && frameNumber0 !== null}
				<NumberValue
					value={frameNumber0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={quilibriumFrame}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const frameNumber0 = resolvedEntity.frameNumber}
					{#if frameNumber0 !== undefined && frameNumber0 !== null}
						<NumberValue
							value={frameNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'frameHash')}
			{[String((pendingEntity.shardKey) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.frameNumber) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={quilibriumFrame}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.shardKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.frameNumber) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'frameHash')}
			{@const frameHash0 = pendingEntity.frameHash}
			{#if frameHash0 !== undefined && frameHash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((frameHash0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={quilibriumFrame}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const frameHash0 = resolvedEntity.frameHash}
					{#if frameHash0 !== undefined && frameHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((frameHash0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>frame number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									frameNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const frameNumber = resolvedEntity.frameNumber}
							{#if frameNumber !== undefined && frameNumber !== null}
								<NumberValue
									value={frameNumber}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>shard key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									shardKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const shardKey = resolvedEntity.shardKey}
							{#if shardKey !== undefined && shardKey !== null}
								{String((shardKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							frameHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const frameHash = resolvedEntity.frameHash}
					{#if frameHash !== undefined && frameHash !== null}
						<div>
							<dt>frame hash</dt>
							<dd>
								<TruncatedValue value={String((frameHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const difficulty = resolvedEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue
									value={difficulty}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$shard}
			>
				{#snippet children(quilibriumShard)}
					{#if quilibriumShard != null && quilibriumShard[EntityMetaKey.Selector] != null}
						<div>
							<dt>shard</dt>
							<dd>
								<QuilibriumShardView
									selection={select(EntityType.QuilibriumShard, quilibriumShard[EntityMetaKey.Selector])}
									prefetched={quilibriumShard}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$prover}
			>
				{#snippet children(quilibriumProver)}
					{#if quilibriumProver != null && quilibriumProver[EntityMetaKey.Selector] != null}
						<div>
							<dt>prover</dt>
							<dd>
								<QuilibriumProverView
									selection={select(EntityType.QuilibriumProver, quilibriumProver[EntityMetaKey.Selector])}
									prefetched={quilibriumProver}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
