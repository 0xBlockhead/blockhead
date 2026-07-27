<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.AlgorandAsset_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'algorand asset timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandAssetView from '$/views/AlgorandAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAsset_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		algorand asset timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset</dt>
				<dd>
					<AlgorandAssetView
						selection={select(EntityType.AlgorandAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>round</dt>
				<dd>
					{String(pendingEntity.round)}
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
							assetName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetName = entity.assetName}
					{#if assetName != null}
						<div>
							<dt>asset name</dt>
							<dd>
								{assetName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unitName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unitName = entity.unitName}
					{#if unitName != null}
						<div>
							<dt>unit name</dt>
							<dd>
								{unitName}
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
							total: true,
							decimals: true,
							unitName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const total = entity.total}
					{#if total != null}
						<div>
							<dt>total</dt>
							<dd>
								<NumberValue
									value={total}
									decimalPlaces={entity.decimals}
								/>

								<span>{entity.unitName == null ? '' : ` ${String(entity.unitName)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String(decimals)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							defaultFrozen: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const defaultFrozen = entity.defaultFrozen}
					{#if defaultFrozen != null}
						<div>
							<dt>default frozen</dt>
							<dd>
								{defaultFrozen ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							url: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const url = entity.url}
					{#if url != null}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataHash = entity.metadataHash}
					{#if metadataHash != null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={String(metadataHash)} />
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
							manager: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const manager = entity.manager}
					{#if manager != null}
						<div>
							<dt>manager</dt>
							<dd>
								{manager}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reserve: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reserve = entity.reserve}
					{#if reserve != null}
						<div>
							<dt>reserve</dt>
							<dd>
								{reserve}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freeze: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freeze = entity.freeze}
					{#if freeze != null}
						<div>
							<dt>freeze</dt>
							<dd>
								{freeze}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clawback: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clawback = entity.clawback}
					{#if clawback != null}
						<div>
							<dt>clawback</dt>
							<dd>
								{clawback}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							holderCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const holderCount = entity.holderCount}
					{#if holderCount != null}
						<div>
							<dt>holder count</dt>
							<dd>
								{String(holderCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
