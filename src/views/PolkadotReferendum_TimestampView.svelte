<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: EntitySelectionViewProps<EntityType.PolkadotReferendum_Timestamp> = $props()

	const referendum = $derived(selection.entitySelector.$referendum)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Subscan_Rest,
		],
	}))
	const polkadotReferendumTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((prefetched.status ?? '') || 'Polkadot referendum timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotReferendumView from '$/views/PolkadotReferendumView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotReferendum_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/referendum/[referendumId=stringSegment]/(polkadotReferendum)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in referendum.$network ?
							caip2StringFromValue(referendum.$network.caip2)
						:
							referendum.$network.slug
					),
					referendumId: referendum.referendumId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<ResourceBoundary resource={polkadotReferendumTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Referendum</dt>
				<dd>
					<PolkadotReferendumView
						selection={select(EntityType.PolkadotReferendum, selection.entitySelector.$referendum)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

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
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={polkadotReferendumTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
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
							decidedAtBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decidedAtBlockNumber = entity.decidedAtBlockNumber}
					{#if decidedAtBlockNumber != null}
						<div>
							<dt>Decided at block number</dt>
							<dd>
								<NumberValue
									value={decidedAtBlockNumber}
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
							confirmationStartedAtBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const confirmationStartedAtBlockNumber = entity.confirmationStartedAtBlockNumber}
					{#if confirmationStartedAtBlockNumber != null}
						<div>
							<dt>Confirmation started at block number</dt>
							<dd>
								<NumberValue
									value={confirmationStartedAtBlockNumber}
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
							enactmentAtBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enactmentAtBlockNumber = entity.enactmentAtBlockNumber}
					{#if enactmentAtBlockNumber != null}
						<div>
							<dt>Enactment at block number</dt>
							<dd>
								<NumberValue
									value={enactmentAtBlockNumber}
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
					viewSelection({
						fields: {
							ayeVotes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ayeVotes = entity.ayeVotes}
					{#if ayeVotes != null}
						<div>
							<dt>Aye votes</dt>
							<dd>
								<NumberValue
									value={ayeVotes}
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
							nayVotes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nayVotes = entity.nayVotes}
					{#if nayVotes != null}
						<div>
							<dt>Nay votes</dt>
							<dd>
								<NumberValue
									value={nayVotes}
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
							support: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const support = entity.support}
					{#if support != null}
						<div>
							<dt>Support</dt>
							<dd>
								<NumberValue
									value={support}
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
							approval: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const approval = entity.approval}
					{#if approval != null}
						<div>
							<dt>Approval</dt>
							<dd>
								<NumberValue
									value={approval}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
