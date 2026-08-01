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
	}: EntitySelectionViewProps<EntityType.BlockheadFedimintClientState_Timestamp> = $props()

	const blockheadFedimintClientStateTimestamp = $derived(selection({
		fields: {
			balanceMsat: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadFedimintClientStateView from '$/views/BlockheadFedimintClientStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFedimintClientState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadFedimintClientStateTimestamp}>
			{#snippet children(entity)}
				{@const balanceMsat = entity.balanceMsat}
				{#if balanceMsat != null}
					<NumberValue
						value={balanceMsat}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client state</dt>
				<dd>
					<BlockheadFedimintClientStateView
						selection={select(EntityType.BlockheadFedimintClientState, selection.entitySelector.$clientState)}
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
					selection({
						fields: {
							recoveryState: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const recoveryState = entity.recoveryState}
					{#if recoveryState != null}
						<div>
							<dt>recovery state</dt>
							<dd>
								{recoveryState}
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
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadFedimintClientStateTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceMsat = entity.balanceMsat}
					{#if balanceMsat != null}
						<div>
							<dt>balance msat</dt>
							<dd>
								<NumberValue
									value={balanceMsat}
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
							ecashBalanceMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ecashBalanceMsat = entity.ecashBalanceMsat}
					{#if ecashBalanceMsat != null}
						<div>
							<dt>ecash balance msat</dt>
							<dd>
								<NumberValue
									value={ecashBalanceMsat}
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
							lightningBalanceMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lightningBalanceMsat = entity.lightningBalanceMsat}
					{#if lightningBalanceMsat != null}
						<div>
							<dt>Lightning balance msat</dt>
							<dd>
								<NumberValue
									value={lightningBalanceMsat}
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
							onchainBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onchainBalanceSats = entity.onchainBalanceSats}
					{#if onchainBalanceSats != null}
						<div>
							<dt>onchain balance sats</dt>
							<dd>
								<NumberValue
									value={onchainBalanceSats}
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
							ecashNoteCountsJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ecashNoteCountsJson = entity.ecashNoteCountsJson}
					{#if ecashNoteCountsJson != null}
						<div>
							<dt>ecash note counts JSON</dt>
							<dd>
								{ecashNoteCountsJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							oobNotesJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oobNotesJson = entity.oobNotesJson}
					{#if oobNotesJson != null}
						<div>
							<dt>oob notes JSON</dt>
							<dd>
								{oobNotesJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationSummaryJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const operationSummaryJson = entity.operationSummaryJson}
					{#if operationSummaryJson != null}
						<div>
							<dt>operation summary JSON</dt>
							<dd>
								{operationSummaryJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
