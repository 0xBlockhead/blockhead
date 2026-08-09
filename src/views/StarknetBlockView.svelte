<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.StarknetBlock> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))
	const starknetBlock = $derived(viewSelection({
		fields: {
			blockNumber: true,
			blockHash: true,
			status: true,
		},
	}))
	const titleFallback = $derived(String(prefetched.blockNumber ?? '') || 'starknet block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'blockHash' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/hash/starknet/[blockHash=stringSegment]',
						{
							network: (
								'caip2' in selection.entitySelector.$network.$network ?
									caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
								:
									selection.entitySelector.$network.$network.slug
							),
							blockHash: selection.entitySelector.blockHash,
						}
					)
				:
					'blockNumber' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/number/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in selection.entitySelector.$network.$network ?
										caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
									:
										selection.entitySelector.$network.$network.slug
								),
								blockNumber: String(selection.entitySelector.blockNumber),
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
		<ResourceBoundary resource={starknetBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.blockNumber}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetBlock}>
			{#snippet children(entity)}
				{entity.blockHash || String(entity.blockNumber) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetBlock}>
			{#snippet children(entity)}
				{@const status = entity.status}
				{#if status != null}
					<span data-text="muted">
						{status}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={starknetBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.blockNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary
						resource={starknetBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.blockHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentHash = entity.parentHash}
					{#if parentHash != null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={parentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							newRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const newRoot = entity.newRoot}
					{#if newRoot != null}
						<div>
							<dt>new root</dt>
							<dd>
								{newRoot}
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
							sequencerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequencerAddress = entity.sequencerAddress}
					{#if sequencerAddress != null}
						<div>
							<dt>sequencer address</dt>
							<dd>
								<TruncatedValue value={sequencerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={starknetBlock}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
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
					<StarknetTransactionsView
						selection={transactionsResource}
						countResource={transactionsResource.count}
						title='transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
