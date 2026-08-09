<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadZcashViewingKey_Timestamp>, 'prefetched'> = $props()

	const viewingKey = $derived(selection.entitySelector.$viewingKey)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))
	const blockheadZcashViewingKeyTimestamp = $derived(viewSelection({
		fields: {
			lastScannedHeight: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashViewingKeyView from '$/views/BlockheadZcashViewingKeyView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/zcash/wallet/[walletId=stringSegment]/viewing-key/[keyFingerprint=stringSegment]/(blockheadZcashViewingKey)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					walletId: viewingKey.walletId,
					keyFingerprint: viewingKey.keyFingerprint,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashViewingKeyTimestamp}>
			{#snippet children(entity)}
				{@const lastScannedHeight = entity.lastScannedHeight}
				{#if lastScannedHeight != null}
					<NumberValue
						value={lastScannedHeight}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>viewing key</dt>
				<dd>
					<BlockheadZcashViewingKeyView
						selection={select(EntityType.BlockheadZcashViewingKey, selection.entitySelector.$viewingKey)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadZcashViewingKeyTimestamp}
			>
				{#snippet children(entity)}
					{@const lastScannedHeight = entity.lastScannedHeight}
					{#if lastScannedHeight != null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue
									value={lastScannedHeight}
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
							lastScannedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastScannedAt = entity.lastScannedAt}
					{#if lastScannedAt != null}
						<div>
							<dt>last scanned AT</dt>
							<dd>
								<Timestamp timestamp={lastScannedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							notesDiscovered: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const notesDiscovered = entity.notesDiscovered}
					{#if notesDiscovered != null}
						<div>
							<dt>notes discovered</dt>
							<dd>
								<NumberValue
									value={notesDiscovered}
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
							nullifiersMatched: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nullifiersMatched = entity.nullifiersMatched}
					{#if nullifiersMatched != null}
						<div>
							<dt>nullifiers matched</dt>
							<dd>
								<NumberValue
									value={nullifiersMatched}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
