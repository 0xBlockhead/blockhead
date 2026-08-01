<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.MevRelay_ProposerPayloadDelivered> = $props()

	const network = $derived(selection.entitySelector.$network)
	const mevRelayProposerPayloadDelivered = $derived(selection({
		fields: {
			value: true,
		},
	}))
	const titleFallback = $derived(['Slot ' + String(selection.entitySelector.slot), (prefetched.value != null ? String(prefetched.value) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					relayHost: selection.entitySelector.relayHost,
					slot: String(selection.entitySelector.slot),
					blockHash: selection.entitySelector.blockHash,
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
		<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
			{#snippet children(entity)}
				{['Slot ' + String(selection.entitySelector.slot), (entity.value != null ? String(entity.value) + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
			{#snippet children(entity)}
				{@const value = entity.value}
				{#if value != null}
					<NumberValue
						value={value}
					/>

					<span> wei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$builder}
		>
			{#snippet children(mevBuilder)}
				{#if mevBuilder != null}
					<span data-text="muted">
						<MevBuilderView
							selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
							prefetched={mevBuilder}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Relay host</dt>
				<dd>
					{selection.entitySelector.relayHost}
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.slot}
					/>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.blockHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							builderPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const builderPubkey = entity.builderPubkey}
					{#if builderPubkey != null}
						<div>
							<dt>Builder public key</dt>
							<dd>
								<TruncatedValue value={builderPubkey} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mevRelayProposerPayloadDelivered}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue
									value={value}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$builder}
			>
				{#snippet children(mevBuilder)}
					{#if mevBuilder != null}
						<div>
							<dt>Builder</dt>
							<dd>
								<MevBuilderView
									selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
									prefetched={mevBuilder}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$executionBlock}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						<div>
							<dt>Execution block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

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
		</dl>
	{/snippet}
</EntityView>
