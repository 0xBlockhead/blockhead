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
			selection: RegisteredEntityProxyResource<EntityType.BittensorBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BittensorBlock>>
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
	const bittensorBlock = $derived(selection({
		sources: selection.sources,
		fields: {
			extrinsicCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.blockNumber) ?? '')].filter(Boolean).join(' ') || 'Bittensor block')
	const viewDomId = $derived('bittensor-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorBlock}
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
					{@const blockNumber0 = pendingEntity.blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue
							value={blockNumber0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={bittensorBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber0 = resolvedEntity.blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue
							value={blockNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const hash0 = pendingEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String((hash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={bittensorBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash0 = resolvedEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String((hash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const extrinsicCount0 = pendingEntity.extrinsicCount}
			{#if extrinsicCount0 !== undefined && extrinsicCount0 !== null}
				<span data-text="muted">
					<NumberValue
						value={extrinsicCount0}
					/>

					<span> extrinsics</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={bittensorBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extrinsicCount0 = resolvedEntity.extrinsicCount}
					{#if extrinsicCount0 !== undefined && extrinsicCount0 !== null}
						<span data-text="muted">
							<NumberValue
								value={extrinsicCount0}
							/>

							<span> extrinsics</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue
									value={blockNumber}
								/>
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
								sources: selection.sources,
								fields: {
									hash: true,
								},
							})
						}
					>
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
				resource={selection.$parent}
			>
				{#snippet children(bittensorBlock)}
					{#if bittensorBlock != null && bittensorBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<BittensorBlockView
									selection={select(EntityType.BittensorBlock, bittensorBlock[EntityMetaKey.Selector])}
									prefetched={bittensorBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							stateRoot: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							extrinsicsRoot: true,
						},
					})
				}
			>
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							extrinsicCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extrinsicCount = resolvedEntity.extrinsicCount}
					{#if extrinsicCount !== undefined && extrinsicCount !== null}
						<div>
							<dt>Extrinsics</dt>
							<dd>
								<NumberValue
									value={extrinsicCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
