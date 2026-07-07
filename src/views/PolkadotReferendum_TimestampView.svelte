<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotReferendum_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotReferendum_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const polkadotReferendumTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.status) ?? '')].filter(Boolean).join(' ') || 'Polkadot referendum timestamp')
	const viewDomId = $derived('polkadot-referendum-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotReferendumView from '$/views/PolkadotReferendumView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotReferendum_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotReferendumTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot referendum timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotReferendumTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotReferendumTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Referendum</dt>
				<dd>
					<PolkadotReferendumView
						selection={select(EntityType.PolkadotReferendum, selection.entitySelector.$referendum, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const blockNumber = prefetched.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
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
				{#snippet Pending()}
					{@const blockHash = prefetched.blockHash}
					{#if blockHash !== undefined && blockHash !== null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={String((blockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHash = resolvedEntity.blockHash}
					{#if blockHash !== undefined && blockHash !== null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={String((blockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
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
				{#snippet Pending()}
					{@const decidedAtBlockNumber = prefetched.decidedAtBlockNumber}
					{#if decidedAtBlockNumber !== undefined && decidedAtBlockNumber !== null}
						<div>
							<dt>Decided at block number</dt>
							<dd>
								<NumberValue value={Number(decidedAtBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decidedAtBlockNumber = resolvedEntity.decidedAtBlockNumber}
					{#if decidedAtBlockNumber !== undefined && decidedAtBlockNumber !== null}
						<div>
							<dt>Decided at block number</dt>
							<dd>
								<NumberValue value={Number(decidedAtBlockNumber)} />
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
				{#snippet Pending()}
					{@const confirmationStartedAtBlockNumber = prefetched.confirmationStartedAtBlockNumber}
					{#if confirmationStartedAtBlockNumber !== undefined && confirmationStartedAtBlockNumber !== null}
						<div>
							<dt>Confirmation started at block number</dt>
							<dd>
								<NumberValue value={Number(confirmationStartedAtBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confirmationStartedAtBlockNumber = resolvedEntity.confirmationStartedAtBlockNumber}
					{#if confirmationStartedAtBlockNumber !== undefined && confirmationStartedAtBlockNumber !== null}
						<div>
							<dt>Confirmation started at block number</dt>
							<dd>
								<NumberValue value={Number(confirmationStartedAtBlockNumber)} />
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
				{#snippet Pending()}
					{@const enactmentAtBlockNumber = prefetched.enactmentAtBlockNumber}
					{#if enactmentAtBlockNumber !== undefined && enactmentAtBlockNumber !== null}
						<div>
							<dt>Enactment at block number</dt>
							<dd>
								<NumberValue value={Number(enactmentAtBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enactmentAtBlockNumber = resolvedEntity.enactmentAtBlockNumber}
					{#if enactmentAtBlockNumber !== undefined && enactmentAtBlockNumber !== null}
						<div>
							<dt>Enactment at block number</dt>
							<dd>
								<NumberValue value={Number(enactmentAtBlockNumber)} />
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
				{#snippet Pending()}
					{@const ayeVotes = prefetched.ayeVotes}
					{#if ayeVotes !== undefined && ayeVotes !== null}
						<div>
							<dt>Aye votes</dt>
							<dd>
								<NumberValue value={Number(ayeVotes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ayeVotes = resolvedEntity.ayeVotes}
					{#if ayeVotes !== undefined && ayeVotes !== null}
						<div>
							<dt>Aye votes</dt>
							<dd>
								<NumberValue value={Number(ayeVotes)} />
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
				{#snippet Pending()}
					{@const nayVotes = prefetched.nayVotes}
					{#if nayVotes !== undefined && nayVotes !== null}
						<div>
							<dt>Nay votes</dt>
							<dd>
								<NumberValue value={Number(nayVotes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nayVotes = resolvedEntity.nayVotes}
					{#if nayVotes !== undefined && nayVotes !== null}
						<div>
							<dt>Nay votes</dt>
							<dd>
								<NumberValue value={Number(nayVotes)} />
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
				{#snippet Pending()}
					{@const support = prefetched.support}
					{#if support !== undefined && support !== null}
						<div>
							<dt>Support</dt>
							<dd>
								<NumberValue value={Number(support)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const support = resolvedEntity.support}
					{#if support !== undefined && support !== null}
						<div>
							<dt>Support</dt>
							<dd>
								<NumberValue value={Number(support)} />
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
				{#snippet Pending()}
					{@const approval = prefetched.approval}
					{#if approval !== undefined && approval !== null}
						<div>
							<dt>Approval</dt>
							<dd>
								<NumberValue value={Number(approval)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const approval = resolvedEntity.approval}
					{#if approval !== undefined && approval !== null}
						<div>
							<dt>Approval</dt>
							<dd>
								<NumberValue value={Number(approval)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
