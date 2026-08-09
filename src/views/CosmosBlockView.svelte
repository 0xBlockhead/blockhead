<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.CosmosBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const network = $derived(selection.entitySelector.$network)
	const cosmosBlock = $derived(selection({
		fields: {
			height: true,
			hash: true,
			transactionCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosBlock}
	entitySelector={selection.entitySelector}
	title={title ?? `Block #${pendingEntity.height}`}
	idDragPlainText={String(pendingEntity.height ?? '')}
	href={
		href === undefined ?
			(
				'hash' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: selection.entitySelector.hash,
						}
					)
				:
					'height' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								blockNumber: String(selection.entitySelector.height),
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosBlock}>
			{#snippet children(entity)}
				<span data-row="inline align-center gap-2 wrap">
					<span>Block </span>
					<span data-badge="small">
						#{entity.height}
					</span>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosBlock}>
			{#snippet children(entity)}
				<span data-badge="small">
					#{entity.height}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosBlock}>
			{#snippet children(entity)}
				{@const transactionCount = entity.transactionCount}
				{#if transactionCount != null}
					<span data-text="muted">
						{transactionCount}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={cosmosBlock}
					>
						{#snippet children(entity)}
							{entity.height}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={cosmosBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proposerConsensusAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposerConsensusAddress = entity.proposerConsensusAddress}
					{#if proposerConsensusAddress != null}
						<div>
							<dt>Proposer consensus address</dt>
							<dd>
								<TruncatedValue value={proposerConsensusAddress} />
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

			<ResourceBoundary
				resource={cosmosBlock}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{transactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
