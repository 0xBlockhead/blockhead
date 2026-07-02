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

	const polkadotBlock = $derived(selection({
		fields: {
			stateRoot: true,
			extrinsicsRoot: true,
			$parent: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? '') ? 'Block #' + String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? '') : '') || [String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block')
	const viewDomId = $derived('polkadot-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).blockNumber ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).blockNumber),
			hash: String(({ ...selection.entitySelector, ...prefetched }).hash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const hash0 = prefetched.hash}
			{#if hash0 !== undefined && hash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String(hash0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotBlock}>
				{#snippet Pending()}
					{@const hash0 = prefetched.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String(hash0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hash0 = entity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String(hash0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary resource={polkadotBlock}>
						{#snippet Pending()}
							{@const blockNumber = prefetched.blockNumber ?? selection.entitySelector.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const blockNumber = entity.blockNumber ?? selection.entitySelector.blockNumber ?? prefetched.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={polkadotBlock}>
				{#snippet Pending()}
					{@const stateRoot = prefetched.stateRoot ?? selection.entitySelector.stateRoot}
					{#if stateRoot !== undefined && stateRoot !== null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue value={String(stateRoot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const stateRoot = entity.stateRoot ?? selection.entitySelector.stateRoot ?? prefetched.stateRoot}
					{#if stateRoot !== undefined && stateRoot !== null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue value={String(stateRoot)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={polkadotBlock}>
				{#snippet Pending()}
					{@const extrinsicsRoot = prefetched.extrinsicsRoot ?? selection.entitySelector.extrinsicsRoot}
					{#if extrinsicsRoot !== undefined && extrinsicsRoot !== null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue value={String(extrinsicsRoot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const extrinsicsRoot = entity.extrinsicsRoot ?? selection.entitySelector.extrinsicsRoot ?? prefetched.extrinsicsRoot}
					{#if extrinsicsRoot !== undefined && extrinsicsRoot !== null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue value={String(extrinsicsRoot)} />
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
					{#if polkadotBlock != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<PolkadotBlockView
									selection={select(EntityType.PolkadotBlock, polkadotBlock.entitySelector)}
									prefetched={polkadotBlock}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
											networkSlug: String(polkadotBlock.entitySelector.$network.slug),
											blockNumber: String(polkadotBlock.entitySelector.blockNumber),
											hash: String(polkadotBlock.entitySelector.hash),
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
