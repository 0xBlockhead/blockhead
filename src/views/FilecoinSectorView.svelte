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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinSector>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FilecoinSector>>
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
	const filecoinSector = $derived(selection({
		sources: selection.sources,
		fields: {
			sealedCid: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.sectorNumber) ?? '')].filter(Boolean).join(' ') || 'filecoin sector')
	const viewDomId = $derived('filecoin-sector-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinSector}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const sectorNumber0 = pendingEntity.sectorNumber}
					{#if sectorNumber0 !== undefined && sectorNumber0 !== null}
						<NumberValue
							value={sectorNumber0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={filecoinSector}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sectorNumber0 = resolvedEntity.sectorNumber}
					{#if sectorNumber0 !== undefined && sectorNumber0 !== null}
						<NumberValue
							value={sectorNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
						href={
						(selection.entitySelector.$miner.minerAddress !== undefined && selection.entitySelector.$miner.$network !== undefined && selection.entitySelector.$miner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
							minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$miner.$network.caip2) ?? ''),
						}) : selection.entitySelector.$miner.minerAddress !== undefined && selection.entitySelector.$miner.$network !== undefined && selection.entitySelector.$miner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
							minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
							network: String(selection.entitySelector.$miner.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={filecoinSector}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
						href={
						(selection.entitySelector.$miner.minerAddress !== undefined && selection.entitySelector.$miner.$network !== undefined && selection.entitySelector.$miner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
							minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$miner.$network.caip2) ?? ''),
						}) : selection.entitySelector.$miner.minerAddress !== undefined && selection.entitySelector.$miner.$network !== undefined && selection.entitySelector.$miner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
							minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
							network: String(selection.entitySelector.$miner.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const sealedCid0 = pendingEntity.sealedCid}
			{#if sealedCid0 !== undefined && sealedCid0 !== null}
				<span data-text="muted">
					{String((sealedCid0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinSector}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sealedCid0 = resolvedEntity.sealedCid}
					{#if sealedCid0 !== undefined && sealedCid0 !== null}
						<span data-text="muted">
							{String((sealedCid0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Miner</dt>
				<dd>
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner, {})}
						href={
							(selection.entitySelector.$miner.minerAddress !== undefined && selection.entitySelector.$miner.$network !== undefined && selection.entitySelector.$miner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
								minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$miner.$network.caip2) ?? ''),
							}) : selection.entitySelector.$miner.minerAddress !== undefined && selection.entitySelector.$miner.$network !== undefined && selection.entitySelector.$miner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
								minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
								network: String(selection.entitySelector.$miner.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Sector number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									sectorNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sectorNumber = resolvedEntity.sectorNumber}
							{#if sectorNumber !== undefined && sectorNumber !== null}
								<NumberValue
									value={sectorNumber}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sealedCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sealedCid = resolvedEntity.sealedCid}
					{#if sealedCid !== undefined && sealedCid !== null}
						<div>
							<dt>Sealed CID</dt>
							<dd>
								{String((sealedCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationEpoch = resolvedEntity.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue
									value={activationEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							expirationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationEpoch = resolvedEntity.expirationEpoch}
					{#if expirationEpoch !== undefined && expirationEpoch !== null}
						<div>
							<dt>Expiration epoch</dt>
							<dd>
								<NumberValue
									value={expirationEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
