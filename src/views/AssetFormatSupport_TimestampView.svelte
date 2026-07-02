<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const assetFormatSupportTimestamp = $derived(selection({
		fields: {
			confidence: true,
			evidenceKind: true,
			ledgerCoordinateKind: true,
			ledgerCoordinateValue: true,
			interfaceId: true,
			programId: true,
			moduleId: true,
			contractAddress: true,
			tokenProgram: true,
			notes: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || 'asset format support timestamp')
	const viewDomId = $derived('asset-format-support-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetFormatSupport_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/formats/[formatId]/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.$network.caip2.reference)}`,
			kind: String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.kind),
			assetKey: String(({ ...selection.entitySelector, ...prefetched }).$assetInstance.assetKey),
			formatId: String(({ ...selection.entitySelector, ...prefetched }).formatId),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || title || 'asset format support timestamp'}
		{:else}
			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || title || 'asset format support timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.formatId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || title || 'asset format support timestamp'}
		{:else}
			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).formatId) ?? '')].filter(Boolean).join(' ') || title || 'asset format support timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.formatId) ?? '')].filter(Boolean).join(' ') || [String((entity.formatId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const confidence0 = prefetched.confidence}
			{#if confidence0 !== undefined && confidence0 !== null}
				<span data-text="muted">
					{String((confidence0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const confidence0 = prefetched.confidence}
					{#if confidence0 !== undefined && confidence0 !== null}
						<span data-text="muted">
							{String((confidence0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const confidence0 = entity.confidence}
					{#if confidence0 !== undefined && confidence0 !== null}
						<span data-text="muted">
							{String((confidence0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={assetFormatSupportTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={assetFormatSupportTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const evidenceKind = prefetched.evidenceKind ?? selection.entitySelector.evidenceKind}
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
					{@const evidenceKind = entity.evidenceKind ?? selection.entitySelector.evidenceKind ?? prefetched.evidenceKind}
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

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const ledgerCoordinateKind = prefetched.ledgerCoordinateKind ?? selection.entitySelector.ledgerCoordinateKind}
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
					{@const ledgerCoordinateKind = entity.ledgerCoordinateKind ?? selection.entitySelector.ledgerCoordinateKind ?? prefetched.ledgerCoordinateKind}
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

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const ledgerCoordinateValue = prefetched.ledgerCoordinateValue ?? selection.entitySelector.ledgerCoordinateValue}
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
					{@const ledgerCoordinateValue = entity.ledgerCoordinateValue ?? selection.entitySelector.ledgerCoordinateValue ?? prefetched.ledgerCoordinateValue}
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
			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const interfaceId = prefetched.interfaceId ?? selection.entitySelector.interfaceId}
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
					{@const interfaceId = entity.interfaceId ?? selection.entitySelector.interfaceId ?? prefetched.interfaceId}
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

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const programId = prefetched.programId ?? selection.entitySelector.programId}
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
					{@const programId = entity.programId ?? selection.entitySelector.programId ?? prefetched.programId}
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

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const moduleId = prefetched.moduleId ?? selection.entitySelector.moduleId}
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
					{@const moduleId = entity.moduleId ?? selection.entitySelector.moduleId ?? prefetched.moduleId}
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

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const contractAddress = prefetched.contractAddress ?? selection.entitySelector.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								{String((contractAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress ?? selection.entitySelector.contractAddress ?? prefetched.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>Contract address</dt>
							<dd>
								{String((contractAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const tokenProgram = prefetched.tokenProgram ?? selection.entitySelector.tokenProgram}
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
					{@const tokenProgram = entity.tokenProgram ?? selection.entitySelector.tokenProgram ?? prefetched.tokenProgram}
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

			<ResourceBoundary resource={assetFormatSupportTimestamp}>
				{#snippet Pending()}
					{@const notes = prefetched.notes ?? selection.entitySelector.notes}
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
					{@const notes = entity.notes ?? selection.entitySelector.notes ?? prefetched.notes}
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
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace)}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference)}`,
								kind: String(selection.entitySelector.$assetInstance.kind),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
