<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLogosBlockchainWalletKeyState>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadLogosBlockchainWalletKeyState>
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
	const blockheadLogosBlockchainWalletKeyState = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.publicKey) ?? '')].filter(Boolean).join(' ') || 'blockhead Logos blockchain wallet key state')
	const viewDomId = $derived('blockhead-logos-blockchain-wallet-key-state-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLogosBlockchainWalletKeyState_TimestampsView from '$/views/BlockheadLogosBlockchainWalletKeyState_TimestampsView.svelte'
	import BlockheadLogosBlockchainNodeStateView from '$/views/BlockheadLogosBlockchainNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, 'endpoint')}
			{[String((pendingEntity.publicKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadLogosBlockchainWalletKeyState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.publicKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, 'endpoint')}
			{@const blockheadLogosBlockchainNodeState0 = pendingEntity.$nodeState}
			{#if blockheadLogosBlockchainNodeState0 != null && selection.entitySelector.$nodeState != null}
				<BlockheadLogosBlockchainNodeStateView
					selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState, { sources: selection.sources })}
					prefetched={blockheadLogosBlockchainNodeState0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLogosBlockchainWalletKeyState}>
				{#snippet children(entity)}
					<BlockheadLogosBlockchainNodeStateView
						selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadLogosBlockchainNodeStateView
						selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									publicKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const publicKey = resolvedEntity.publicKey}
							{#if publicKey !== undefined && publicKey !== null}
								{String((publicKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadLogosBlockchainWalletKeyState_TimestampsView
					selection={blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource}
					countResource={blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadLogosBlockchainWalletKeyState_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
