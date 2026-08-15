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
	}: EntitySelectionViewProps<EntityType.MevRelay_BuilderBlockReceived> = $props()

	const relay = $derived(selection.entitySelector.$relay)
	const mevRelayBuilderBlockReceived = $derived(selection({
		fields: {
			valueWei: true,
		},
	}))
	const titleFallback = $derived(['Slot ' + String(selection.entitySelector.slot), String(prefetched.valueWei ?? '') + ' wei'].filter(Boolean).join(' ') || 'MEV relay builder block received')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_BuilderBlockReceived}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/received-bid/[slot=nonNegativeInteger]/[blockHash=zeroExHex]/[builderPubkey=stringSegment]/[receivedAtMs=nonNegativeInteger]',
				{
					network: (
						'caip2' in relay.$network ?
							caip2StringFromValue(relay.$network.caip2)
						:
							relay.$network.slug
					),
					host: relay.host,
					slot: String(selection.entitySelector.slot),
					blockHash: selection.entitySelector.blockHash,
					builderPubkey: selection.entitySelector.$builder.builderPubkey,
					receivedAtMs: String(selection.entitySelector.receivedAtMs),
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
		<ResourceBoundary resource={mevRelayBuilderBlockReceived}>
			{#snippet children(entity)}
				{['Slot ' + String(selection.entitySelector.slot), String(entity.valueWei) + ' wei'].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayBuilderBlockReceived}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.valueWei}
				/>

				<span> wei</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<MevBuilderView
				selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
				layout={EntityLayout.Title}
			/>
		</span>
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
				<dt>Parent hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									parentHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.parentHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Builder</dt>
				<dd>
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Proposer public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proposerPubkey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.proposerPubkey} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Proposer fee recipient</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proposerFeeRecipient: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.proposerFeeRecipient} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Bid value</dt>
				<dd>
					<ResourceBoundary
						resource={mevRelayBuilderBlockReceived}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.valueWei}
							/>

							<span> wei</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gas limit</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									gasLimit: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.gasLimit}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gas used</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									gasUsed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.gasUsed}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transaction count</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.transactionCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
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

			<div>
				<dt>Received at</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.receivedAtMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							optimisticSubmission: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const optimisticSubmission = entity.optimisticSubmission}
					{#if optimisticSubmission != null}
						<div>
							<dt>Optimistic submission</dt>
							<dd>
								{optimisticSubmission ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
