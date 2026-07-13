<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAssetBalance_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotAssetBalance_Timestamp>>
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
	const polkadotAssetBalanceTimestamp = $derived(selection({
		fields: {
			freeBalancePlancks: true,
			status: true,
		},
	}))
	const titleFallback = $derived('Polkadot asset balance timestamp')
	const viewDomId = $derived('polkadot-asset-balance-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import PolkadotAssetView from '$/views/PolkadotAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAssetBalance_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotAssetBalanceTimestamp}>
			{#snippet Pending()}
				<PolkadotAssetView
					selection={select(EntityType.PolkadotAsset, selection.entitySelector.$asset)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<PolkadotAssetView
					selection={select(EntityType.PolkadotAsset, selection.entitySelector.$asset)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotAssetBalanceTimestamp}>
			{#snippet Pending()}
				{@const freeBalancePlancks0 = pendingEntity.freeBalancePlancks}
				{#if freeBalancePlancks0 !== undefined && freeBalancePlancks0 !== null}
					<NumberValue value={Number(freeBalancePlancks0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const freeBalancePlancks0 = resolvedEntity.freeBalancePlancks}
				{#if freeBalancePlancks0 !== undefined && freeBalancePlancks0 !== null}
					<NumberValue value={Number(freeBalancePlancks0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotAssetBalanceTimestamp}>
			{#snippet Pending()}
				{@const status0 = pendingEntity.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const status0 = resolvedEntity.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<PolkadotAccountView
						selection={select(EntityType.PolkadotAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined && selection.entitySelector.$account.accountId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
								network: String(selection.entitySelector.$account.$network.slug ?? ''),
								accountId: String(selection.entitySelector.$account.accountId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Asset</dt>
				<dd>
					<PolkadotAssetView
						selection={select(EntityType.PolkadotAsset, selection.entitySelector.$asset, {})}
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
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
					{@const blockNumber = pendingEntity.blockNumber}
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
					{@const blockHash = pendingEntity.blockHash}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							freeBalancePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freeBalancePlancks = pendingEntity.freeBalancePlancks}
					{#if freeBalancePlancks !== undefined && freeBalancePlancks !== null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								<NumberValue value={Number(freeBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeBalancePlancks = resolvedEntity.freeBalancePlancks}
					{#if freeBalancePlancks !== undefined && freeBalancePlancks !== null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								<NumberValue value={Number(freeBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reservedBalancePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reservedBalancePlancks = pendingEntity.reservedBalancePlancks}
					{#if reservedBalancePlancks !== undefined && reservedBalancePlancks !== null}
						<div>
							<dt>Reserved balance plancks</dt>
							<dd>
								<NumberValue value={Number(reservedBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reservedBalancePlancks = resolvedEntity.reservedBalancePlancks}
					{#if reservedBalancePlancks !== undefined && reservedBalancePlancks !== null}
						<div>
							<dt>Reserved balance plancks</dt>
							<dd>
								<NumberValue value={Number(reservedBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							frozenBalancePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const frozenBalancePlancks = pendingEntity.frozenBalancePlancks}
					{#if frozenBalancePlancks !== undefined && frozenBalancePlancks !== null}
						<div>
							<dt>Frozen balance plancks</dt>
							<dd>
								<NumberValue value={Number(frozenBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const frozenBalancePlancks = resolvedEntity.frozenBalancePlancks}
					{#if frozenBalancePlancks !== undefined && frozenBalancePlancks !== null}
						<div>
							<dt>Frozen balance plancks</dt>
							<dd>
								<NumberValue value={Number(frozenBalancePlancks)} />
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
							transferableBalancePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transferableBalancePlancks = pendingEntity.transferableBalancePlancks}
					{#if transferableBalancePlancks !== undefined && transferableBalancePlancks !== null}
						<div>
							<dt>Transferable balance plancks</dt>
							<dd>
								<NumberValue value={Number(transferableBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transferableBalancePlancks = resolvedEntity.transferableBalancePlancks}
					{#if transferableBalancePlancks !== undefined && transferableBalancePlancks !== null}
						<div>
							<dt>Transferable balance plancks</dt>
							<dd>
								<NumberValue value={Number(transferableBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lockedBalancePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lockedBalancePlancks = pendingEntity.lockedBalancePlancks}
					{#if lockedBalancePlancks !== undefined && lockedBalancePlancks !== null}
						<div>
							<dt>Locked balance plancks</dt>
							<dd>
								<NumberValue value={Number(lockedBalancePlancks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lockedBalancePlancks = resolvedEntity.lockedBalancePlancks}
					{#if lockedBalancePlancks !== undefined && lockedBalancePlancks !== null}
						<div>
							<dt>Locked balance plancks</dt>
							<dd>
								<NumberValue value={Number(lockedBalancePlancks)} />
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
					{@const status = pendingEntity.status}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reason: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reason = pendingEntity.reason}
					{#if reason !== undefined && reason !== null}
						<div>
							<dt>Reason</dt>
							<dd>
								{String((reason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reason = resolvedEntity.reason}
					{#if reason !== undefined && reason !== null}
						<div>
							<dt>Reason</dt>
							<dd>
								{String((reason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
