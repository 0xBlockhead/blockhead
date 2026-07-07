<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.QuilibriumFrame>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.QuilibriumFrame>>
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
	const titleFallback = $derived([String((selection.entitySelector.frameNumber ?? prefetched.frameNumber) ?? '')].filter(Boolean).join(' ') || 'quilibrium frame')
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
				{@const frameNumber0 = selection.entitySelector.frameNumber ?? prefetched.frameNumber}
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
				{[String((selection.entitySelector.shardKey ?? prefetched.shardKey) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.frameNumber ?? prefetched.frameNumber) ?? '')].filter(Boolean).join(' ') || title || 'quilibrium frame'}
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
				{@const frameHash0 = prefetched.frameHash}
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
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
							{@const frameNumber = selection.entitySelector.frameNumber ?? prefetched.frameNumber}
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
							{@const shardKey = selection.entitySelector.shardKey ?? prefetched.shardKey}
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
					{@const frameHash = prefetched.frameHash}
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
					{@const timestampMs = prefetched.timestampMs}
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
					{@const difficulty = prefetched.difficulty}
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
				resource={selection[EntityProxyField]<EntityType.QuilibriumShard, false>('$shard')}
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
				resource={selection[EntityProxyField]<EntityType.QuilibriumProver, false>('$prover')}
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
