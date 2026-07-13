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
			selection: EntityProxyResource<typeof schema, EntityType.AssetFormatSupport_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AssetFormatSupport_Timestamp>>
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
	const assetFormatSupportTimestamp = $derived(selection({
		fields: {
			confidence: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.formatId) ?? '')].filter(Boolean).join(' ') || 'asset format support timestamp')
	const viewDomId = $derived('asset-format-support-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetFormatSupport_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={assetFormatSupportTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.formatId) ?? '')].filter(Boolean).join(' ') || title || 'asset format support timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.formatId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={assetFormatSupportTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.formatId) ?? '')].filter(Boolean).join(' ') || title || 'asset format support timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.formatId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={assetFormatSupportTimestamp}>
			{#snippet Pending()}
				{@const confidence0 = pendingEntity.confidence}
				{#if confidence0 !== undefined && confidence0 !== null}
					<span data-text="muted">
						{String((confidence0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const confidence0 = resolvedEntity.confidence}
				{#if confidence0 !== undefined && confidence0 !== null}
					<span data-text="muted">
						{String((confidence0) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									formatId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const formatId = pendingEntity.formatId}
							{#if formatId !== undefined && formatId !== null}
								{String((formatId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const formatId = resolvedEntity.formatId}
							{#if formatId !== undefined && formatId !== null}
								{String((formatId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
							confidence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const confidence = pendingEntity.confidence}
					{#if confidence !== undefined && confidence !== null}
						<div>
							<dt>Confidence</dt>
							<dd>
								{String((confidence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confidence = resolvedEntity.confidence}
					{#if confidence !== undefined && confidence !== null}
						<div>
							<dt>Confidence</dt>
							<dd>
								{String((confidence) ?? '')}
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
				{#snippet Pending()}
					{@const evidenceKind = pendingEntity.evidenceKind}
					{#if evidenceKind !== undefined && evidenceKind !== null}
						<div>
							<dt>Evidence kind</dt>
							<dd>
								{String((evidenceKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceKind = resolvedEntity.evidenceKind}
					{#if evidenceKind !== undefined && evidenceKind !== null}
						<div>
							<dt>Evidence kind</dt>
							<dd>
								{String((evidenceKind) ?? '')}
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
				{#snippet Pending()}
					{@const ledgerCoordinateKind = pendingEntity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
						<div>
							<dt>Ledger coordinate kind</dt>
							<dd>
								{String((ledgerCoordinateKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCoordinateKind = resolvedEntity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
						<div>
							<dt>Ledger coordinate kind</dt>
							<dd>
								{String((ledgerCoordinateKind) ?? '')}
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
				{#snippet Pending()}
					{@const ledgerCoordinateValue = pendingEntity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
						<div>
							<dt>Ledger coordinate value</dt>
							<dd>
								{String((ledgerCoordinateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCoordinateValue = resolvedEntity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
						<div>
							<dt>Ledger coordinate value</dt>
							<dd>
								{String((ledgerCoordinateValue) ?? '')}
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
				{#snippet Pending()}
					{@const interfaceId = pendingEntity.interfaceId}
					{#if interfaceId !== undefined && interfaceId !== null}
						<div>
							<dt>Interface ID</dt>
							<dd>
								{String((interfaceId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const interfaceId = resolvedEntity.interfaceId}
					{#if interfaceId !== undefined && interfaceId !== null}
						<div>
							<dt>Interface ID</dt>
							<dd>
								{String((interfaceId) ?? '')}
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
				{#snippet Pending()}
					{@const programId = pendingEntity.programId}
					{#if programId !== undefined && programId !== null}
						<div>
							<dt>Program ID</dt>
							<dd>
								{String((programId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const programId = resolvedEntity.programId}
					{#if programId !== undefined && programId !== null}
						<div>
							<dt>Program ID</dt>
							<dd>
								{String((programId) ?? '')}
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
				{#snippet Pending()}
					{@const moduleId = pendingEntity.moduleId}
					{#if moduleId !== undefined && moduleId !== null}
						<div>
							<dt>Module ID</dt>
							<dd>
								{String((moduleId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleId = resolvedEntity.moduleId}
					{#if moduleId !== undefined && moduleId !== null}
						<div>
							<dt>Module ID</dt>
							<dd>
								{String((moduleId) ?? '')}
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
				{#snippet Pending()}
					{@const contractAddress = pendingEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractAddress = resolvedEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
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
				{#snippet Pending()}
					{@const tokenProgram = pendingEntity.tokenProgram}
					{#if tokenProgram !== undefined && tokenProgram !== null}
						<div>
							<dt>Token program</dt>
							<dd>
								{String((tokenProgram) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenProgram = resolvedEntity.tokenProgram}
					{#if tokenProgram !== undefined && tokenProgram !== null}
						<div>
							<dt>Token program</dt>
							<dd>
								{String((tokenProgram) ?? '')}
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
				{#snippet Pending()}
					{@const notes = pendingEntity.notes}
					{#if notes !== undefined && notes !== null}
						<div>
							<dt>Notes</dt>
							<dd>
								{String((notes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const notes = resolvedEntity.notes}
					{#if notes !== undefined && notes !== null}
						<div>
							<dt>Notes</dt>
							<dd>
								{String((notes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
