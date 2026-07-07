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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroWalletState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadMoneroWalletState_Timestamp>>
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
	const blockheadMoneroWalletStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			balanceAtomicUnits: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead monero wallet state timestamp')
	const viewDomId = $derived('blockhead-monero-wallet-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadMoneroWalletStateView from '$/views/BlockheadMoneroWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroWalletStateTimestamp}>
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
		<ResourceBoundary resource={blockheadMoneroWalletStateTimestamp}>
			{#snippet Pending()}
				{@const balanceAtomicUnits0 = prefetched.balanceAtomicUnits}
				{#if balanceAtomicUnits0 !== undefined && balanceAtomicUnits0 !== null}
					<NumberValue value={Number(balanceAtomicUnits0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balanceAtomicUnits0 = resolvedEntity.balanceAtomicUnits}
				{#if balanceAtomicUnits0 !== undefined && balanceAtomicUnits0 !== null}
					<NumberValue value={Number(balanceAtomicUnits0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroWalletStateTimestamp}>
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
				<dt>wallet state</dt>
				<dd>
					<BlockheadMoneroWalletStateView
						selection={select(EntityType.BlockheadMoneroWalletState, selection.entitySelector.$walletState, {})}
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
							height: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const height = prefetched.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
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
							balanceAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceAtomicUnits = prefetched.balanceAtomicUnits}
					{#if balanceAtomicUnits !== undefined && balanceAtomicUnits !== null}
						<div>
							<dt>balance atomic units</dt>
							<dd>
								<NumberValue value={Number(balanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceAtomicUnits = resolvedEntity.balanceAtomicUnits}
					{#if balanceAtomicUnits !== undefined && balanceAtomicUnits !== null}
						<div>
							<dt>balance atomic units</dt>
							<dd>
								<NumberValue value={Number(balanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unlockedBalanceAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unlockedBalanceAtomicUnits = prefetched.unlockedBalanceAtomicUnits}
					{#if unlockedBalanceAtomicUnits !== undefined && unlockedBalanceAtomicUnits !== null}
						<div>
							<dt>unlocked balance atomic units</dt>
							<dd>
								<NumberValue value={Number(unlockedBalanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unlockedBalanceAtomicUnits = resolvedEntity.unlockedBalanceAtomicUnits}
					{#if unlockedBalanceAtomicUnits !== undefined && unlockedBalanceAtomicUnits !== null}
						<div>
							<dt>unlocked balance atomic units</dt>
							<dd>
								<NumberValue value={Number(unlockedBalanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							multisigImportNeeded: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const multisigImportNeeded = prefetched.multisigImportNeeded}
					{#if multisigImportNeeded !== undefined && multisigImportNeeded !== null}
						<div>
							<dt>multisig import needed</dt>
							<dd>
								{multisigImportNeeded ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const multisigImportNeeded = resolvedEntity.multisigImportNeeded}
					{#if multisigImportNeeded !== undefined && multisigImportNeeded !== null}
						<div>
							<dt>multisig import needed</dt>
							<dd>
								{multisigImportNeeded ? 'Yes' : 'No'}
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
							outputsExportedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputsExportedAt = prefetched.outputsExportedAt}
					{#if outputsExportedAt !== undefined && outputsExportedAt !== null}
						<div>
							<dt>outputs exported AT</dt>
							<dd>
								<Timestamp timestamp={Number(outputsExportedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputsExportedAt = resolvedEntity.outputsExportedAt}
					{#if outputsExportedAt !== undefined && outputsExportedAt !== null}
						<div>
							<dt>outputs exported AT</dt>
							<dd>
								<Timestamp timestamp={Number(outputsExportedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							keyImagesExportedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyImagesExportedAt = prefetched.keyImagesExportedAt}
					{#if keyImagesExportedAt !== undefined && keyImagesExportedAt !== null}
						<div>
							<dt>key images exported AT</dt>
							<dd>
								<Timestamp timestamp={Number(keyImagesExportedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyImagesExportedAt = resolvedEntity.keyImagesExportedAt}
					{#if keyImagesExportedAt !== undefined && keyImagesExportedAt !== null}
						<div>
							<dt>key images exported AT</dt>
							<dd>
								<Timestamp timestamp={Number(keyImagesExportedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = prefetched.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
