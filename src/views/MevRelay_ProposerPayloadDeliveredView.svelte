<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

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

	const relay = $derived(selection.entitySelector.$relay)
	const mevRelayProposerPayloadDelivered = $derived(selection({
		fields: {
			value: true,
		},
	}))
	const titleFallback = $derived(['Slot ' + String(selection.entitySelector.slot), String(prefetched.value ?? '') + ' wei'].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/payload/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
				{
					network: (
						relay.$network.caip2 !== undefined ?
							caip2StringFromValue(relay.$network.caip2)
						:
							relay.$network.slug
					),
					host: relay.host,
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
				{['Slot ' + String(selection.entitySelector.slot), String(entity.value) + ' wei'].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.value}
				/>

				<span> wei</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$builder}
		>
			{#snippet children(mevBuilder)}
				<span data-text="muted">
					<MevBuilderView
						selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Relay</dt>
				<dd>
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
						layout={EntityLayout.Value}
					/>
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

			<div>
				<dt>Claimed block number</dt>
				<dd>
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
							<NumberValue
								value={entity.blockNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Value</dt>
				<dd>
					<ResourceBoundary
						resource={mevRelayProposerPayloadDelivered}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.value}
							/>

							<span> wei</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Builder</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$builder}
					>
						{#snippet children(mevBuilder)}
							<MevBuilderView
								selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$executionBlock}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						{@const evmBlockInitial = untrack(() => evmBlock)}
						<div>
							<dt>Execution block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
									prefetched={evmBlock ?? evmBlockInitial}
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
