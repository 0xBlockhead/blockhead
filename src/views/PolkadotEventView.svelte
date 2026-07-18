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
			selection: RegisteredEntityProxyResource<EntityType.PolkadotEvent>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.PolkadotEvent>>
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
	const polkadotEvent = $derived(selection({
		sources: selection.sources,
		fields: {
			eventName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.eventName) ?? ''), (String((pendingEntity.indexInBlock) ?? '') ? 'Event ' + String((pendingEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event')
	const viewDomId = $derived('polkadot-event-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotEvent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.indexInBlock !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.blockNumber !== undefined && pendingEntity.$block.hash !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
			eventIndex: String(pendingEntity.indexInBlock ?? ''),
			blockNumber: String(pendingEntity.$block.blockNumber ?? ''),
			hash: String(pendingEntity.$block.hash ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$block.$network.caip2) ?? ''),
		}) : pendingEntity.indexInBlock !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.blockNumber !== undefined && pendingEntity.$block.hash !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
			eventIndex: String(pendingEntity.indexInBlock ?? ''),
			blockNumber: String(pendingEntity.$block.blockNumber ?? ''),
			hash: String(pendingEntity.$block.hash ?? ''),
			network: String(pendingEntity.$block.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.eventName) ?? ''), (String((pendingEntity.indexInBlock) ?? '') ? 'Event ' + String((pendingEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotEvent}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.eventName) ?? ''), (String((resolvedEntity.indexInBlock) ?? '') ? 'Event ' + String((resolvedEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.eventName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eventName) ?? ''), (String((pendingEntity.indexInBlock) ?? '') ? 'Event ' + String((pendingEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotEvent}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.eventName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.eventName) ?? ''), (String((resolvedEntity.indexInBlock) ?? '') ? 'Event ' + String((resolvedEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$pallet}
			>
				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<PolkadotPalletView
								selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
								prefetched={polkadotPallet}
								href={
									(polkadotPallet[EntityMetaKey.Selector].palletName !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
										palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
										network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : polkadotPallet[EntityMetaKey.Selector].palletName !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
										palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
										network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={polkadotEvent}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$pallet}
					>
						{#snippet children(polkadotPallet)}
							{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<PolkadotPalletView
										selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
										prefetched={polkadotPallet}
										href={
											(polkadotPallet[EntityMetaKey.Selector].palletName !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
												palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
												network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
											}) : polkadotPallet[EntityMetaKey.Selector].palletName !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
												palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
												network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in block</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInBlock: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInBlock = resolvedEntity.indexInBlock}
							{#if indexInBlock !== undefined && indexInBlock !== null}
								{String((indexInBlock) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									eventName: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventName = resolvedEntity.eventName}
							{#if eventName !== undefined && eventName !== null}
								{String((eventName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$pallet}
			>
				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>Pallet</dt>
							<dd>
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									href={
										(polkadotPallet[EntityMetaKey.Selector].palletName !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
											palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
											network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : polkadotPallet[EntityMetaKey.Selector].palletName !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
											palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
											network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$extrinsic}
			>
				{#snippet children(polkadotExtrinsic)}
					{#if polkadotExtrinsic != null && polkadotExtrinsic[EntityMetaKey.Selector] != null}
						<div>
							<dt>Extrinsic</dt>
							<dd>
								<PolkadotExtrinsicView
									selection={select(EntityType.PolkadotExtrinsic, polkadotExtrinsic[EntityMetaKey.Selector])}
									prefetched={polkadotExtrinsic}
									href={
										(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.hash !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
											extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
											blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
											hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
											network: String(caip2StringFromValue(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2) ?? ''),
										}) : polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.hash !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
											extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
											blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
											hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
											network: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Block</dt>
				<dd>
					<PolkadotBlockView
						selection={select(EntityType.PolkadotBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
							}) : selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
							}) : selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
							}) : selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
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
