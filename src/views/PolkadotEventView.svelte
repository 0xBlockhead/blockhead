<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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

	const polkadotEvent = $derived(selection({
		fields: {
			eventName: true,
			$pallet: true,
			$extrinsic: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? ''), 'Event ' + String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '')].filter(Boolean).join(' ') || 'Polkadot event')
	const viewDomId = $derived('polkadot-event-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotEvent}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/event/[eventIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$block.$network.caip2)].slug),
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).$block.blockNumber),
			hash: String(({ ...selection.entitySelector, ...prefetched }).$block.hash),
			eventIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInBlock),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? ''), 'Event ' + String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
		{:else}
			<ResourceBoundary resource={polkadotEvent}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? ''), 'Event ' + String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.eventName) ?? ''), 'Event ' + String((entity.indexInBlock) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? ''), 'Event ' + String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
		{:else}
			<ResourceBoundary resource={polkadotEvent}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).eventName) ?? ''), 'Event ' + String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.eventName) ?? '')].filter(Boolean).join(' ') || [String((entity.eventName) ?? ''), 'Event ' + String((entity.indexInBlock) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
			>
				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null}
						<span data-text="muted">
							<PolkadotPalletView
								selection={select(EntityType.PolkadotPallet, polkadotPallet.entitySelector)}
								prefetched={polkadotPallet}
								href={
									resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
										networkSlug: String(polkadotPallet.entitySelector.$network.slug),
										palletName: String(polkadotPallet.entitySelector.palletName),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={polkadotEvent}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
					>
						{#snippet children(polkadotPallet)}
							{#if polkadotPallet != null}
								<span data-text="muted">
									<PolkadotPalletView
										selection={select(EntityType.PolkadotPallet, polkadotPallet.entitySelector)}
										prefetched={polkadotPallet}
										href={
											resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
												networkSlug: String(polkadotPallet.entitySelector.$network.slug),
												palletName: String(polkadotPallet.entitySelector.palletName),
											})
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
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
					>
						{#snippet children(polkadotPallet)}
							{#if polkadotPallet != null}
								<span data-text="muted">
									<PolkadotPalletView
										selection={select(EntityType.PolkadotPallet, polkadotPallet.entitySelector)}
										prefetched={polkadotPallet}
										href={
											resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
												networkSlug: String(polkadotPallet.entitySelector.$network.slug),
												palletName: String(polkadotPallet.entitySelector.palletName),
											})
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PolkadotExtrinsic, false>('$extrinsic')}
			>
				{#snippet children(polkadotExtrinsic)}
					{#if polkadotExtrinsic != null}
						<div>
							<dt>Extrinsic</dt>
							<dd>
								<PolkadotExtrinsicView
									selection={select(EntityType.PolkadotExtrinsic, polkadotExtrinsic.entitySelector)}
									prefetched={polkadotExtrinsic}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
											networkSlug: String(networkByCaip2[String(polkadotExtrinsic.entitySelector.$block.$network.caip2)].slug),
											blockNumber: String(polkadotExtrinsic.entitySelector.$block.blockNumber),
											hash: String(polkadotExtrinsic.entitySelector.$block.hash),
											extrinsicIndex: String(polkadotExtrinsic.entitySelector.indexInBlock),
										})
									}
									layout={EntityLayout.Title}
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
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
								networkSlug: String(selection.entitySelector.$block.$network.slug),
								blockNumber: String(selection.entitySelector.$block.blockNumber),
								hash: String(selection.entitySelector.$block.hash),
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
