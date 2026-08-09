<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.NearChunk>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearChunk = $derived(viewSelection({
		fields: {
			shardId: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearTransactionsView from '$/views/NearTransactionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.NearChunk}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.chunkHash || 'near chunk')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/chunk/[chunkHash=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					chunkHash: selection.entitySelector.chunkHash,
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
		<TruncatedValue value={selection.entitySelector.chunkHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(nearBlock)}
				{#if nearBlock != null}
					<NearBlockView
						selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearChunk}>
			{#snippet children(entity)}
				{@const shardId = entity.shardId}
				{#if shardId != null}
					<span data-text="muted">
						<NumberValue
							value={shardId}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Chunk hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.chunkHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(nearBlock)}
					{#if nearBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<NearBlockView
									selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearChunk}
			>
				{#snippet children(entity)}
					{@const shardId = entity.shardId}
					{#if shardId != null}
						<div>
							<dt>Shard ID</dt>
							<dd>
								<NumberValue
									value={shardId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const transactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={transactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearTransactionsView
						selection={transactionsResource}
						countResource={transactionsResource.count}
						title='Transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
