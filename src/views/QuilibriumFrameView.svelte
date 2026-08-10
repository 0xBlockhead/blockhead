<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.QuilibriumFrame>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.QuilibriumNode_Grpc,
		],
	}))
	const quilibriumFrame = $derived(viewSelection({
		fields: {
			frameHash: true,
		},
	}))


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
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.frameNumber)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/frame/[frameNumber=nonNegativeBigInt]/[shardKey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					frameNumber: String(selection.entitySelector.frameNumber),
					shardKey: selection.entitySelector.shardKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.frameNumber}
		/>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.shardKey || String(selection.entitySelector.frameNumber)}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={quilibriumFrame}>
			{#snippet children(entity)}
				{@const frameHash = entity.frameHash}
				{#if frameHash != null}
					<span data-text="muted">
						<TruncatedValue value={frameHash} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>frame number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.frameNumber}
					/>
				</dd>
			</div>

			<div>
				<dt>shard key</dt>
				<dd>
					{selection.entitySelector.shardKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={quilibriumFrame}
			>
				{#snippet children(entity)}
					{@const frameHash = entity.frameHash}
					{#if frameHash != null}
						<div>
							<dt>frame hash</dt>
							<dd>
								<TruncatedValue value={frameHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const difficulty = entity.difficulty}
					{#if difficulty != null}
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
					{#if quilibriumShard != null}
						{@const quilibriumShardInitial = untrack(() => quilibriumShard)}
						<div>
							<dt>shard</dt>
							<dd>
								<QuilibriumShardView
									selection={select(EntityType.QuilibriumShard, (quilibriumShard ?? quilibriumShardInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
					{#if quilibriumProver != null}
						{@const quilibriumProverInitial = untrack(() => quilibriumProver)}
						<div>
							<dt>prover</dt>
							<dd>
								<QuilibriumProverView
									selection={select(EntityType.QuilibriumProver, (quilibriumProver ?? quilibriumProverInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
