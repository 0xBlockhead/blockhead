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
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerSlashingEvent>, 'prefetched'> = $props()

	const operator = $derived(selection.entitySelector.$operator)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
		],
	}))
	const eigenLayerSlashingEvent = $derived(viewSelection({
		fields: {
			slashedShares: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerSlashingEvent}
	entitySelector={selection.entitySelector}
	title={title ?? 'eigen layer slashing event'}
	href={
		href === undefined ?
			(
				'source' in selection.entitySelector
				&& 'slashId' in selection.entitySelector
				&& '$avs' in selection.entitySelector
				&& '$operator' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/avs/[avsAddress=evmAddress]/slashing/[source=stringSegment]/[slashId=stringSegment]',
						{
							network: (
								'caip2' in operator.$network ?
									caip2StringFromValue(operator.$network.caip2)
								:
									operator.$network.slug
							),
							operatorAddress: operator.operatorAddress,
							avsAddress: selection.entitySelector.$avs.avsAddress,
							source: selection.entitySelector.source,
							slashId: selection.entitySelector.slashId,
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
		<ResourceBoundary
			resource={selection.$operator}
		>
			{#snippet children(eigenLayerOperator)}
				{#if eigenLayerOperator != null}
					{@const eigenLayerOperatorInitial = untrack(() => eigenLayerOperator)}
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, (eigenLayerOperator ?? eigenLayerOperatorInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Title}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$avs}
		>
			{#snippet children(eigenLayerAvs)}
				{#if eigenLayerAvs != null}
					{@const eigenLayerAvsInitial = untrack(() => eigenLayerAvs)}
					<EigenLayerAvsView
						selection={select(EntityType.EigenLayerAvs, (eigenLayerAvs ?? eigenLayerAvsInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerSlashingEvent}>
			{#snippet children(entity)}
				{@const slashedShares = entity.slashedShares}
				{#if slashedShares != null}
					<span data-text="muted">
						<NumberValue
							value={slashedShares}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$operator}
			>
				{#snippet children(eigenLayerOperator)}
					{#if eigenLayerOperator != null}
						{@const eigenLayerOperatorInitial = untrack(() => eigenLayerOperator)}
						<div>
							<dt>operator</dt>
							<dd>
								<EigenLayerOperatorView
									selection={select(EntityType.EigenLayerOperator, (eigenLayerOperator ?? eigenLayerOperatorInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$avs}
			>
				{#snippet children(eigenLayerAvs)}
					{#if eigenLayerAvs != null}
						{@const eigenLayerAvsInitial = untrack(() => eigenLayerAvs)}
						<div>
							<dt>AVS</dt>
							<dd>
								<EigenLayerAvsView
									selection={select(EntityType.EigenLayerAvs, (eigenLayerAvs ?? eigenLayerAvsInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$strategy}
			>
				{#snippet children(eigenLayerStrategy)}
					{#if eigenLayerStrategy != null}
						{@const eigenLayerStrategyInitial = untrack(() => eigenLayerStrategy)}
						<div>
							<dt>strategy</dt>
							<dd>
								<EigenLayerStrategyView
									selection={select(EntityType.EigenLayerStrategy, (eigenLayerStrategy ?? eigenLayerStrategyInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							slashId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slashId = entity.slashId}
					{#if slashId != null}
						<div>
							<dt>slash ID</dt>
							<dd>
								{slashId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={eigenLayerSlashingEvent}
			>
				{#snippet children(entity)}
					{@const slashedShares = entity.slashedShares}
					{#if slashedShares != null}
						<div>
							<dt>slashed shares</dt>
							<dd>
								<NumberValue
									value={slashedShares}
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
							slashedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slashedAmount = entity.slashedAmount}
					{#if slashedAmount != null}
						<div>
							<dt>slashed amount</dt>
							<dd>
								<NumberValue
									value={slashedAmount}
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
							reason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reason = entity.reason}
					{#if reason != null}
						<div>
							<dt>reason</dt>
							<dd>
								{reason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logIndex = entity.logIndex}
					{#if logIndex != null}
						<div>
							<dt>log index</dt>
							<dd>
								<NumberValue
									value={logIndex}
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
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
				resource={
					viewSelection({
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
