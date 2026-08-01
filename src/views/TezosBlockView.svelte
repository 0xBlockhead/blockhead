<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosBlock> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBlock}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>level</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									level: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.level}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
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
					selection({
						fields: {
							protocolHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolHash = entity.protocolHash}
					{#if protocolHash != null}
						<div>
							<dt>protocol hash</dt>
							<dd>
								<TruncatedValue value={protocolHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							predecessorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const predecessorHash = entity.predecessorHash}
					{#if predecessorHash != null}
						<div>
							<dt>predecessor hash</dt>
							<dd>
								<TruncatedValue value={predecessorHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bakerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bakerAddress = entity.bakerAddress}
					{#if bakerAddress != null}
						<div>
							<dt>baker address</dt>
							<dd>
								<TruncatedValue value={bakerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							round: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const round = entity.round}
					{#if round != null}
						<div>
							<dt>round</dt>
							<dd>
								{round}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cycle: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cycle = entity.cycle}
					{#if cycle != null}
						<div>
							<dt>cycle</dt>
							<dd>
								{cycle}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadHash = entity.payloadHash}
					{#if payloadHash != null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={payloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationsHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const operationsHash = entity.operationsHash}
					{#if operationsHash != null}
						<div>
							<dt>operations hash</dt>
							<dd>
								<TruncatedValue value={operationsHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
