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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidTransaction>>
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
	const hyperliquidTransaction = $derived(selection({}))
	const titleFallback = $derived('hyperliquid transaction')
	const viewDomId = $derived('hyperliquid-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidBlockView from '$/views/HyperliquidBlockView.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidTransaction}>
			{#snippet Pending()}
				{title || 'hyperliquid transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
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
				<dt>Transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txHash = pendingEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txHash = resolvedEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(hyperliquidBlock)}
					{#if hyperliquidBlock != null && hyperliquidBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<HyperliquidBlockView
									selection={select(EntityType.HyperliquidBlock, hyperliquidBlock[EntityMetaKey.Selector])}
									prefetched={hyperliquidBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null && hyperliquidAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount[EntityMetaKey.Selector])}
									prefetched={hyperliquidAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							actionType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const actionType = pendingEntity.actionType}
					{#if actionType !== undefined && actionType !== null}
						<div>
							<dt>action type</dt>
							<dd>
								{String((actionType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const actionType = resolvedEntity.actionType}
					{#if actionType !== undefined && actionType !== null}
						<div>
							<dt>action type</dt>
							<dd>
								{String((actionType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
