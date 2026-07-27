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
	}: EntitySelectionViewProps<EntityType.AssetFormatSupport_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const assetFormatSupportTimestamp = $derived(selection({
		fields: {
			confidence: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.formatId ?? '') || 'asset format support timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetFormatSupport_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.formatId ?? '') || 'asset format support timestamp'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.formatId ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetFormatSupportTimestamp}>
			{#snippet children(entity)}
				{@const confidence0 = entity.confidence}
				{#if confidence0 != null}
					<span data-text="muted">
						{confidence0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Format ID</dt>
				<dd>
					{pendingEntity.formatId}
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
				resource={assetFormatSupportTimestamp}
			>
				{#snippet children(entity)}
					{@const confidence = entity.confidence}
					{#if confidence != null}
						<div>
							<dt>Confidence</dt>
							<dd>
								{confidence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evidenceKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceKind = entity.evidenceKind}
					{#if evidenceKind != null}
						<div>
							<dt>Evidence kind</dt>
							<dd>
								{evidenceKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCoordinateKind = entity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind != null}
						<div>
							<dt>Ledger coordinate kind</dt>
							<dd>
								{ledgerCoordinateKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCoordinateValue = entity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue != null}
						<div>
							<dt>Ledger coordinate value</dt>
							<dd>
								{String(ledgerCoordinateValue)}
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
							interfaceId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const interfaceId = entity.interfaceId}
					{#if interfaceId != null}
						<div>
							<dt>Interface ID</dt>
							<dd>
								{interfaceId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							programId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const programId = entity.programId}
					{#if programId != null}
						<div>
							<dt>Program ID</dt>
							<dd>
								{programId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleId = entity.moduleId}
					{#if moduleId != null}
						<div>
							<dt>Module ID</dt>
							<dd>
								{moduleId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress}
					{#if contractAddress != null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenProgram: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenProgram = entity.tokenProgram}
					{#if tokenProgram != null}
						<div>
							<dt>Token program</dt>
							<dd>
								{tokenProgram}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							notes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const notes = entity.notes}
					{#if notes != null}
						<div>
							<dt>Notes</dt>
							<dd>
								{notes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
