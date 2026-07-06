<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const polkadotEvent = $derived(selection({
		fields: {
			eventName: true,
			$pallet: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.eventName) ?? ''), (String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') ? 'Event ' + String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event')
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
		href ?? (pendingEntity.$block !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.caip2 !== undefined && pendingEntity.$block.$network.caip2.namespace !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.caip2 !== undefined && pendingEntity.$block.$network.caip2.reference !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.blockNumber !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.hash !== undefined && pendingEntity.indexInBlock !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/event/[eventIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$block.$network.caip2.namespace) + ':' + String(pendingEntity.$block.$network.caip2.reference))].slug ?? ''),
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
				{[String((prefetched.eventName) ?? ''), (String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') ? 'Event ' + String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
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
				{[String((prefetched.eventName) ?? '')].filter(Boolean).join(' ') || [String((prefetched.eventName) ?? ''), (String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') ? 'Event ' + String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || title || 'Polkadot event'}
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
					resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
				>
					{#snippet children(polkadotPallet)}
						{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									href={
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
											networkSlug: String(networkByCaip2[String(String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
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
					resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
				>
					{#snippet children(polkadotPallet)}
						{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									href={
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
											networkSlug: String(networkByCaip2[String(String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
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
							{@const indexInBlock = selection.entitySelector.indexInBlock ?? prefetched.indexInBlock}
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
							{@const eventName = prefetched.eventName}
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
				resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
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
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
											networkSlug: String(networkByCaip2[String(String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
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
				resource={selection[EntityProxyField]<EntityType.PolkadotExtrinsic, false>('$extrinsic')}
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
										(polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2 !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2.namespace !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2 !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2.reference !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].$block.hash !== undefined && polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
											networkSlug: String(networkByCaip2[String(String(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2.namespace) + ':' + String(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2.reference))].slug ?? ''),
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
						selection={select(EntityType.PolkadotBlock, selection.entitySelector.$block)}
						href={
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
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
