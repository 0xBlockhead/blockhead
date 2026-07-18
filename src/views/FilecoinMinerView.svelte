<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinMiner>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FilecoinMiner>>
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
	const filecoinMiner = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.minerAddress) ?? '')].filter(Boolean).join(' ') || 'filecoin miner')
	const viewDomId = $derived('filecoin-miner-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMiner_TimestampsView from '$/views/FilecoinMiner_TimestampsView.svelte'
	import FilecoinSectorsView from '$/views/FilecoinSectorsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinMiner_TimestampView from '$/views/FilecoinMiner_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMiner}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.minerAddress !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
			minerAddress: String(pendingEntity.minerAddress ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.minerAddress !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
			minerAddress: String(pendingEntity.minerAddress ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.minerAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={filecoinMiner}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.minerAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest observation</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$$timestamps({
								sources: [
									Source.Lotus_JsonRpc,
								],
								fields: {
									height: true,
									timestampMs: true,
									qualityAdjustedPower: true,
									liveSectorCount: true,
									source: true,
								},
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].height ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							})
						}
					>
						{#snippet children(filecoinMinerTimestamps)}
							{@const filecoinMinerTimestamp = filecoinMinerTimestamps.values[0]}
							{#if filecoinMinerTimestamp != null}
								{@const filecoinMinerTimestampSelector = filecoinMinerTimestamp[EntityMetaKey.Selector]}
								<FilecoinMiner_TimestampView
									selection={
										select(EntityType.FilecoinMiner_Timestamp, filecoinMinerTimestampSelector, {
											sources: [
												Source.Lotus_JsonRpc,
											],
										})
									}
									href={
										(filecoinMinerTimestamp[EntityMetaKey.Selector].height !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].source !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
											height: String(filecoinMinerTimestamp[EntityMetaKey.Selector].height ?? ''),
											tipsetKey: String(filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
											source: String(filecoinMinerTimestamp[EntityMetaKey.Selector].source ?? ''),
											minerAddress: String(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress ?? ''),
											network: String(caip2StringFromValue(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.caip2) ?? ''),
										}) : filecoinMinerTimestamp[EntityMetaKey.Selector].height !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].source !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network !== undefined && filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
											height: String(filecoinMinerTimestamp[EntityMetaKey.Selector].height ?? ''),
											tipsetKey: String(filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
											source: String(filecoinMinerTimestamp[EntityMetaKey.Selector].source ?? ''),
											minerAddress: String(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress ?? ''),
											network: String(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.slug ?? ''),
										}) : undefined)
									}
									prefetched={{ ...filecoinMinerTimestampSelector, ...filecoinMinerTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest observation available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Miner address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									minerAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const minerAddress = resolvedEntity.minerAddress}
							{#if minerAddress !== undefined && minerAddress !== null}
								<TruncatedValue value={String((minerAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<FilecoinMiner_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Lotus_JsonRpc,
							],
							count: true,
						})
					}
				title='Observations'
				id='FilecoinMiner_TimestampsView-timestamps'
			/>

			<FilecoinSectorsView
				selection={
						selection.$$sectors({
							sources: [
								Source.Lotus_JsonRpc,
							],
							count: true,
						})
					}
				title='Sectors'
				id='FilecoinSectorsView-sectors'
			/>
		{/if}
	{/snippet}
</EntityView>
