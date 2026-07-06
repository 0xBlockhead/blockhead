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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotBlock>>
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
	const polkadotBlock = $derived(selection({}))
	const titleFallback = $derived((String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') ? 'Block #' + String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') : '') || [String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block')
	const viewDomId = $derived('polkadot-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotExtrinsicsView from '$/views/PolkadotExtrinsicsView.svelte'
	import PolkadotEventsView from '$/views/PolkadotEventsView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.blockNumber ?? prefetched.blockNumber ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.blockNumber !== undefined && pendingEntity.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			hash: String(pendingEntity.hash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((prefetched.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((prefetched.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotBlock}>
			{#snippet Pending()}
				{@const hash0 = prefetched.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((hash0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const hash0 = resolvedEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((hash0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockNumber = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = prefetched.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateRoot = prefetched.stateRoot}
					{#if stateRoot !== undefined && stateRoot !== null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue value={String((stateRoot) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateRoot = resolvedEntity.stateRoot}
					{#if stateRoot !== undefined && stateRoot !== null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue value={String((stateRoot) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							extrinsicsRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const extrinsicsRoot = prefetched.extrinsicsRoot}
					{#if extrinsicsRoot !== undefined && extrinsicsRoot !== null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue value={String((extrinsicsRoot) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extrinsicsRoot = resolvedEntity.extrinsicsRoot}
					{#if extrinsicsRoot !== undefined && extrinsicsRoot !== null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue value={String((extrinsicsRoot) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PolkadotBlock, false>('$parent')}
			>
				{#snippet children(polkadotBlock)}
					{#if polkadotBlock != null && polkadotBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<PolkadotBlockView
									selection={select(EntityType.PolkadotBlock, polkadotBlock[EntityMetaKey.Selector])}
									prefetched={polkadotBlock}
									href={
										(polkadotBlock[EntityMetaKey.Selector].$network !== undefined && polkadotBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotBlock[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && polkadotBlock[EntityMetaKey.Selector].$network !== undefined && polkadotBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotBlock[EntityMetaKey.Selector].$network.caip2.reference !== undefined && polkadotBlock[EntityMetaKey.Selector].blockNumber !== undefined && polkadotBlock[EntityMetaKey.Selector].hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
											networkSlug: String(networkByCaip2[String(String(polkadotBlock[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(polkadotBlock[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
											hash: String(polkadotBlock[EntityMetaKey.Selector].hash ?? ''),
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<PolkadotExtrinsicsView
				selection={selection[EntityProxyField]<EntityType.PolkadotExtrinsic>('$$extrinsics')}
				title='Extrinsics'
				emptyText='No Polkadot extrinsics.'
				id='PolkadotExtrinsicsView-$$extrinsics'
			/>

			<PolkadotEventsView
				selection={selection[EntityProxyField]<EntityType.PolkadotEvent>('$$events')}
				title='Events'
				emptyText='No Polkadot events.'
				id='PolkadotEventsView-$$events'
			/>
		{/if}
	{/snippet}
</EntityView>
