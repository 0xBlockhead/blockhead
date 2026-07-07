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
			selection: EntityProxyResource<typeof schema, EntityType.AptosNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosNetwork_Timestamp>>
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
	const aptosNetworkTimestamp = $derived(selection({
		fields: {
			ledgerVersion: true,
			blockHeight: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'aptos network timestamp')
	const viewDomId = $derived('aptos-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosNetworkTimestamp}>
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

	{#snippet Value()}
		<ResourceBoundary resource={aptosNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.ledgerVersion) ?? ''), String((prefetched.blockHeight) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'aptos network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.ledgerVersion) ?? ''), String((resolvedEntity.blockHeight) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosNetworkTimestamp}>
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
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network, {})}
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
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = prefetched.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainId = resolvedEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
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
							ledgerVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerVersion = prefetched.ledgerVersion}
					{#if ledgerVersion !== undefined && ledgerVersion !== null}
						<div>
							<dt>ledger version</dt>
							<dd>
								<NumberValue value={Number(ledgerVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerVersion = resolvedEntity.ledgerVersion}
					{#if ledgerVersion !== undefined && ledgerVersion !== null}
						<div>
							<dt>ledger version</dt>
							<dd>
								<NumberValue value={Number(ledgerVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockHeight = prefetched.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue value={Number(blockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHeight = resolvedEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue value={Number(blockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epoch = prefetched.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>epoch</dt>
							<dd>
								<NumberValue value={Number(epoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epoch = resolvedEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>epoch</dt>
							<dd>
								<NumberValue value={Number(epoch)} />
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
							oldestLedgerVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const oldestLedgerVersion = prefetched.oldestLedgerVersion}
					{#if oldestLedgerVersion !== undefined && oldestLedgerVersion !== null}
						<div>
							<dt>oldest ledger version</dt>
							<dd>
								<NumberValue value={Number(oldestLedgerVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const oldestLedgerVersion = resolvedEntity.oldestLedgerVersion}
					{#if oldestLedgerVersion !== undefined && oldestLedgerVersion !== null}
						<div>
							<dt>oldest ledger version</dt>
							<dd>
								<NumberValue value={Number(oldestLedgerVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							oldestBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const oldestBlockHeight = prefetched.oldestBlockHeight}
					{#if oldestBlockHeight !== undefined && oldestBlockHeight !== null}
						<div>
							<dt>oldest block height</dt>
							<dd>
								<NumberValue value={Number(oldestBlockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const oldestBlockHeight = resolvedEntity.oldestBlockHeight}
					{#if oldestBlockHeight !== undefined && oldestBlockHeight !== null}
						<div>
							<dt>oldest block height</dt>
							<dd>
								<NumberValue value={Number(oldestBlockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeRole: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeRole = prefetched.nodeRole}
					{#if nodeRole !== undefined && nodeRole !== null}
						<div>
							<dt>node role</dt>
							<dd>
								{String((nodeRole) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeRole = resolvedEntity.nodeRole}
					{#if nodeRole !== undefined && nodeRole !== null}
						<div>
							<dt>node role</dt>
							<dd>
								{String((nodeRole) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
