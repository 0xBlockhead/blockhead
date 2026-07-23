<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.PolkadotEvent>
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
	const polkadotEvent = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			eventName: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			eventName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.eventName) ?? ''), (String((pendingEntity.indexInBlock) ?? '') ? 'Event ' + String((pendingEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event')
	const viewDomId = $derived('polkadot-event-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'indexInBlock' in selection.entitySelector
			&& selection.entitySelector.indexInBlock != null
			&& selection.entitySelector != null && '$block' in selection.entitySelector
			&& selection.entitySelector.$block != null && 'blockNumber' in selection.entitySelector.$block
			&& selection.entitySelector.$block.blockNumber != null
			&& selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
			&& selection.entitySelector.$block.hash != null
			&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block ?
				selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
				&& selection.entitySelector.$block.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
				eventIndex: String(selection.entitySelector.indexInBlock ?? ''),
				blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
				hash: String(selection.entitySelector.$block.hash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
					&& selection.entitySelector.$block.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
					eventIndex: String(selection.entitySelector.indexInBlock ?? ''),
					blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
					hash: String(selection.entitySelector.$block.hash ?? ''),
					network: String(selection.entitySelector.$block.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eventName) ?? ''), (String((resolvedEntity.indexInBlock) ?? '') ? 'Event ' + String((resolvedEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotEvent}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eventName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.eventName) ?? ''), (String((resolvedEntity.indexInBlock) ?? '') ? 'Event ' + String((resolvedEntity.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
										(
											polkadotPallet[EntityMetaKey.Selector] != null && 'palletName' in polkadotPallet[EntityMetaKey.Selector]
											&& polkadotPallet[EntityMetaKey.Selector].palletName != null
											&& polkadotPallet[EntityMetaKey.Selector] != null && '$network' in polkadotPallet[EntityMetaKey.Selector] ?
												polkadotPallet[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotPallet[EntityMetaKey.Selector].$network
												&& polkadotPallet[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
												palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
												network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													polkadotPallet[EntityMetaKey.Selector].$network != null && 'slug' in polkadotPallet[EntityMetaKey.Selector].$network
													&& polkadotPallet[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
													palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
													network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
										(
											polkadotPallet[EntityMetaKey.Selector] != null && 'palletName' in polkadotPallet[EntityMetaKey.Selector]
											&& polkadotPallet[EntityMetaKey.Selector].palletName != null
											&& polkadotPallet[EntityMetaKey.Selector] != null && '$network' in polkadotPallet[EntityMetaKey.Selector] ?
												polkadotPallet[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotPallet[EntityMetaKey.Selector].$network
												&& polkadotPallet[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
												palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
												network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													polkadotPallet[EntityMetaKey.Selector].$network != null && 'slug' in polkadotPallet[EntityMetaKey.Selector].$network
													&& polkadotPallet[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
													palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
													network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
										(
											polkadotExtrinsic[EntityMetaKey.Selector] != null && 'indexInBlock' in polkadotExtrinsic[EntityMetaKey.Selector]
											&& polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock != null
											&& polkadotExtrinsic[EntityMetaKey.Selector] != null && '$block' in polkadotExtrinsic[EntityMetaKey.Selector]
											&& polkadotExtrinsic[EntityMetaKey.Selector].$block != null && 'blockNumber' in polkadotExtrinsic[EntityMetaKey.Selector].$block
											&& polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber != null
											&& polkadotExtrinsic[EntityMetaKey.Selector].$block != null && 'hash' in polkadotExtrinsic[EntityMetaKey.Selector].$block
											&& polkadotExtrinsic[EntityMetaKey.Selector].$block.hash != null
											&& polkadotExtrinsic[EntityMetaKey.Selector].$block != null && '$network' in polkadotExtrinsic[EntityMetaKey.Selector].$block ?
												polkadotExtrinsic[EntityMetaKey.Selector].$block.$network != null && 'caip2' in polkadotExtrinsic[EntityMetaKey.Selector].$block.$network
												&& polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
												extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
												blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
												hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
												network: String(caip2StringFromValue(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2) ?? ''),
											})
											:
													polkadotExtrinsic[EntityMetaKey.Selector].$block.$network != null && 'slug' in polkadotExtrinsic[EntityMetaKey.Selector].$block.$network
													&& polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
													extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
													blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
													hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
													network: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
						selection={select(EntityType.PolkadotBlock, selection.entitySelector.$block)}
						href={
							(
								selection.entitySelector.$block != null && 'blockNumber' in selection.entitySelector.$block
								&& selection.entitySelector.$block.blockNumber != null ?
									selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
									&& selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
									&& selection.entitySelector.$block.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
									blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
										&& selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
										&& selection.entitySelector.$block.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
										blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
										network: String(selection.entitySelector.$block.$network.slug ?? ''),
									})
									:
											selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
											&& selection.entitySelector.$block.hash != null
											&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
											&& selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
											&& selection.entitySelector.$block.$network.caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
											blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
											hash: String(selection.entitySelector.$block.hash ?? ''),
											network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
										})
										:
												selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
												&& selection.entitySelector.$block.hash != null
												&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
												&& selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
												&& selection.entitySelector.$block.$network.slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
												blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
												hash: String(selection.entitySelector.$block.hash ?? ''),
												network: String(selection.entitySelector.$block.$network.slug ?? ''),
											})
											:
												undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
