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
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.QuilibriumFrame>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.QuilibriumFrame>>
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
	const quilibriumFrame = $derived(selection({
		sources: [
			Source.QuilibriumNode_Grpc,
		],
		fields: {
			frameHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.frameNumber) ?? '')].filter(Boolean).join(' ') || 'quilibrium frame')
	const viewDomId = $derived('quilibrium-frame-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={quilibriumFrame}>
			{#snippet Pending()}
				{@const frameNumber0 = pendingEntity.frameNumber}
				{#if frameNumber0 !== undefined && frameNumber0 !== null}
					<NumberValue value={Number(frameNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const frameNumber0 = resolvedEntity.frameNumber}
				{#if frameNumber0 !== undefined && frameNumber0 !== null}
					<NumberValue value={Number(frameNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={quilibriumFrame}>
			{#snippet Pending()}
				{[String((pendingEntity.shardKey) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.frameNumber) ?? '')].filter(Boolean).join(' ') || title || 'quilibrium frame'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.shardKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.frameNumber) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={quilibriumFrame}>
			{#snippet Pending()}
				{@const frameHash0 = pendingEntity.frameHash}
				{#if frameHash0 !== undefined && frameHash0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((frameHash0) ?? '')} />
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
								fields: {
									frameNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const frameNumber = pendingEntity.frameNumber}
							{#if frameNumber !== undefined && frameNumber !== null}
								<NumberValue value={Number(frameNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const frameNumber = resolvedEntity.frameNumber}
							{#if frameNumber !== undefined && frameNumber !== null}
								<NumberValue value={Number(frameNumber)} />
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
								fields: {
									shardKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const shardKey = pendingEntity.shardKey}
							{#if shardKey !== undefined && shardKey !== null}
								{String((shardKey) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							frameHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const frameHash = pendingEntity.frameHash}
					{#if frameHash !== undefined && frameHash !== null}
						<div>
							<dt>frame hash</dt>
							<dd>
								<TruncatedValue value={String((frameHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const difficulty = pendingEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const difficulty = resolvedEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$shard}
			>
				{#snippet Pending()}{/snippet}

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
				{#snippet Pending()}{/snippet}

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
