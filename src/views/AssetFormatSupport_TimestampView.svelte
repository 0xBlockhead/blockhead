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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AssetFormatSupport_Timestamp>, 'prefetched'> = $props()

	const assetInstance = $derived(selection.entitySelector.$assetInstance)
	const assetFormatSupportTimestamp = $derived(selection({
		fields: {
			confidence: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.formatId || 'asset format support timestamp')


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/format/[formatId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in assetInstance.$network ?
							caip2StringFromValue(assetInstance.$network.caip2)
						:
							assetInstance.$network.slug
					),
					kind: assetInstance.kind,
					assetKey: assetInstance.assetKey,
					formatId: selection.entitySelector.formatId,
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
	{#snippet Value()}
		{selection.entitySelector.formatId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetFormatSupportTimestamp}>
			{#snippet children(entity)}
				{@const confidence = entity.confidence}
				{#if confidence != null}
					<span data-text="muted">
						{confidence}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Format ID</dt>
				<dd>
					{selection.entitySelector.formatId}
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
								{ledgerCoordinateValue}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
