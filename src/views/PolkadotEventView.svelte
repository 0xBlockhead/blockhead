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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotEvent>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotEvent>>
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
		href ?? (pendingEntity.$block !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.slug !== undefined && pendingEntity.$block.blockNumber !== undefined && pendingEntity.$block.hash !== undefined && pendingEntity.indexInBlock !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
			network: String(pendingEntity.$block.$network.slug ?? ''),
			blockNumber: String(pendingEntity.$block.blockNumber ?? ''),
			hash: String(pendingEntity.$block.hash ?? ''),
			eventIndex: String(pendingEntity.indexInBlock ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet Pending()}
				{[String((pendingEntity.eventName) ?? ''), (String((pendingEntity.indexInBlock) ?? '') ? 'Event ' + String((pendingEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eventName) ?? ''), (String((resolvedEntity.indexInBlock) ?? '') ? 'Event ' + String((resolvedEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet Pending()}
				{[String((pendingEntity.eventName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eventName) ?? ''), (String((pendingEntity.indexInBlock) ?? '') ? 'Event ' + String((pendingEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eventName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.eventName) ?? ''), (String((resolvedEntity.indexInBlock) ?? '') ? 'Event ' + String((resolvedEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet Pending()}
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
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
											network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
											palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
											network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
											palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in block</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInBlock: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInBlock = pendingEntity.indexInBlock}
							{#if indexInBlock !== undefined && indexInBlock !== null}
								{String((indexInBlock) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									eventName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventName = pendingEntity.eventName}
							{#if eventName !== undefined && eventName !== null}
								{String((eventName) ?? '')}
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>Pallet</dt>
							<dd>
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									href={
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
											network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
											palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
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
				{#snippet Pending()}{/snippet}

				{#snippet children(polkadotExtrinsic)}
					{#if polkadotExtrinsic != null && polkadotExtrinsic[EntityMetaKey.Selector] != null}
						<div>
							<dt>Extrinsic</dt>
							<dd>
								<PolkadotExtrinsicView
									selection={select(EntityType.PolkadotExtrinsic, polkadotExtrinsic[EntityMetaKey.Selector])}
									prefetched={polkadotExtrinsic}
									href={
										(polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.hash !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
											network: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug ?? ''),
											blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
											hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
											extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
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
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined && selection.entitySelector.$block.blockNumber !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
							}) : selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined && selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
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
