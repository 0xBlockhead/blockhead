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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotReferendum_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const polkadotReferendumTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.status ?? '') || 'Polkadot referendum timestamp')


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
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Referendum</dt>
				<dd>
					<PolkadotReferendumView
						selection={select(EntityType.PolkadotReferendum, selection.entitySelector.$referendum)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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

			<ResourceBoundary
				resource={
					selection({
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
					selection({
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
					selection({
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
					selection({
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
					selection({
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
					selection({
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
					selection({
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
					selection({
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
