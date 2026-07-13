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
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAsset_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandAsset_Timestamp>>
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
	const algorandAssetTimestamp = $derived(selection({}))
	const titleFallback = $derived('algorand asset timestamp')
	const viewDomId = $derived('algorand-asset-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandAssetView from '$/views/AlgorandAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandAsset_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandAssetTimestamp}>
			{#snippet Pending()}
				{title || 'algorand asset timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset</dt>
				<dd>
					<AlgorandAssetView
						selection={select(EntityType.AlgorandAsset, selection.entitySelector.$asset, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>round</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									round: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const round = pendingEntity.round}
							{#if round !== undefined && round !== null}
								{String((round) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const round = resolvedEntity.round}
							{#if round !== undefined && round !== null}
								{String((round) ?? '')}
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
							assetName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetName = pendingEntity.assetName}
					{#if assetName !== undefined && assetName !== null}
						<div>
							<dt>asset name</dt>
							<dd>
								{String((assetName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetName = resolvedEntity.assetName}
					{#if assetName !== undefined && assetName !== null}
						<div>
							<dt>asset name</dt>
							<dd>
								{String((assetName) ?? '')}
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
				{#snippet Pending()}
					{@const unitName = pendingEntity.unitName}
					{#if unitName !== undefined && unitName !== null}
						<div>
							<dt>unit name</dt>
							<dd>
								{String((unitName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unitName = resolvedEntity.unitName}
					{#if unitName !== undefined && unitName !== null}
						<div>
							<dt>unit name</dt>
							<dd>
								{String((unitName) ?? '')}
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
						},
					})
				}
			>
				{#snippet Pending()}
					{@const total = pendingEntity.total}
					{#if total !== undefined && total !== null}
						<div>
							<dt>total</dt>
							<dd>
								{String((total) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const total = resolvedEntity.total}
					{#if total !== undefined && total !== null}
						<div>
							<dt>total</dt>
							<dd>
								{String((total) ?? '')}
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
				{#snippet Pending()}
					{@const decimals = pendingEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decimals = resolvedEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
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
				{#snippet Pending()}
					{@const defaultFrozen = pendingEntity.defaultFrozen}
					{#if defaultFrozen !== undefined && defaultFrozen !== null}
						<div>
							<dt>default frozen</dt>
							<dd>
								{defaultFrozen ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const defaultFrozen = resolvedEntity.defaultFrozen}
					{#if defaultFrozen !== undefined && defaultFrozen !== null}
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
				{#snippet Pending()}
					{@const url = pendingEntity.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const url = resolvedEntity.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
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
				{#snippet Pending()}
					{@const metadataHash = pendingEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataHash = resolvedEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
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
				{#snippet Pending()}
					{@const manager = pendingEntity.manager}
					{#if manager !== undefined && manager !== null}
						<div>
							<dt>manager</dt>
							<dd>
								{String((manager) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const manager = resolvedEntity.manager}
					{#if manager !== undefined && manager !== null}
						<div>
							<dt>manager</dt>
							<dd>
								{String((manager) ?? '')}
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
				{#snippet Pending()}
					{@const reserve = pendingEntity.reserve}
					{#if reserve !== undefined && reserve !== null}
						<div>
							<dt>reserve</dt>
							<dd>
								{String((reserve) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reserve = resolvedEntity.reserve}
					{#if reserve !== undefined && reserve !== null}
						<div>
							<dt>reserve</dt>
							<dd>
								{String((reserve) ?? '')}
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
				{#snippet Pending()}
					{@const freeze = pendingEntity.freeze}
					{#if freeze !== undefined && freeze !== null}
						<div>
							<dt>freeze</dt>
							<dd>
								{String((freeze) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeze = resolvedEntity.freeze}
					{#if freeze !== undefined && freeze !== null}
						<div>
							<dt>freeze</dt>
							<dd>
								{String((freeze) ?? '')}
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
				{#snippet Pending()}
					{@const clawback = pendingEntity.clawback}
					{#if clawback !== undefined && clawback !== null}
						<div>
							<dt>clawback</dt>
							<dd>
								{String((clawback) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clawback = resolvedEntity.clawback}
					{#if clawback !== undefined && clawback !== null}
						<div>
							<dt>clawback</dt>
							<dd>
								{String((clawback) ?? '')}
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
				{#snippet Pending()}
					{@const holderCount = pendingEntity.holderCount}
					{#if holderCount !== undefined && holderCount !== null}
						<div>
							<dt>holder count</dt>
							<dd>
								{String((holderCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const holderCount = resolvedEntity.holderCount}
					{#if holderCount !== undefined && holderCount !== null}
						<div>
							<dt>holder count</dt>
							<dd>
								{String((holderCount) ?? '')}
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
				{#snippet Pending()}
					{@const deleted = pendingEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deleted = resolvedEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
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
