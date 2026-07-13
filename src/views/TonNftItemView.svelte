<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftItem>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonNftItem>>
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
	const tonNftItem = $derived(selection({}))
	const titleFallback = $derived('TON NFT item')
	const viewDomId = $derived('ton-nft-item-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonNftCollectionView from '$/views/TonNftCollectionView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNftItem}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonNftItem}>
			{#snippet Pending()}
				{title || 'TON NFT item'}
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
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(tonNetwork)}
							{#if tonNetwork != null && tonNetwork[EntityMetaKey.Selector] != null}
								<TonNetworkView
									selection={select(EntityType.TonNetwork, tonNetwork[EntityMetaKey.Selector])}
									prefetched={tonNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							itemAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const itemAddress = pendingEntity.itemAddress}
					{#if itemAddress !== undefined && itemAddress !== null}
						<div>
							<dt>item address</dt>
							<dd>
								<TruncatedValue value={String((itemAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const itemAddress = resolvedEntity.itemAddress}
					{#if itemAddress !== undefined && itemAddress !== null}
						<div>
							<dt>item address</dt>
							<dd>
								<TruncatedValue value={String((itemAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$collection}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tonNftCollection)}
					{#if tonNftCollection != null && tonNftCollection[EntityMetaKey.Selector] != null}
						<div>
							<dt>collection</dt>
							<dd>
								<TonNftCollectionView
									selection={select(EntityType.TonNftCollection, tonNftCollection[EntityMetaKey.Selector])}
									prefetched={tonNftCollection}
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
							itemIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const itemIndex = pendingEntity.itemIndex}
					{#if itemIndex !== undefined && itemIndex !== null}
						<div>
							<dt>item index</dt>
							<dd>
								{String((itemIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const itemIndex = resolvedEntity.itemIndex}
					{#if itemIndex !== undefined && itemIndex !== null}
						<div>
							<dt>item index</dt>
							<dd>
								{String((itemIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
