<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetContract>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StarknetContract>>
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
	const starknetContract = $derived(selection({
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.address ?? prefetched.address) ?? '')].filter(Boolean).join(' ') || 'starknet contract')
	const viewDomId = $derived('starknet-contract-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetAccount_TimestampsView from '$/views/StarknetAccount_TimestampsView.svelte'
	import StarknetStorageEntriesView from '$/views/StarknetStorageEntriesView.svelte'
	import StarknetEventsView from '$/views/StarknetEventsView.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetContract}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={starknetContract}>
			{#snippet Pending()}
				{[String((selection.entitySelector.address ?? prefetched.address) ?? '')].filter(Boolean).join(' ') || title || 'starknet contract'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetContract}>
			{#snippet Pending()}
				<StarknetNetworkView
					selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<StarknetNetworkView
					selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = selection.entitySelector.address ?? prefetched.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<StarknetAccount_TimestampsView
				selection={selection[EntityProxyField]<EntityType.StarknetAccount_Timestamp>('$$accountStates')}
				title='account states'
				emptyText='No Starknet account observations.'
				id='StarknetAccount_TimestampsView-$$accountStates'
			/>

			<StarknetStorageEntriesView
				selection={selection[EntityProxyField]<EntityType.StarknetStorageEntry>('$$storage')}
				title='storage'
				emptyText='No Starknet storage entries.'
				id='StarknetStorageEntriesView-$$storage'
			/>

			<StarknetEventsView
				selection={selection[EntityProxyField]<EntityType.StarknetEvent>('$$events')}
				title='events'
				emptyText='No Starknet events.'
				id='StarknetEventsView-$$events'
			/>

			<StarknetTransactionsView
				selection={selection[EntityProxyField]<EntityType.StarknetTransaction>('$$transactions')}
				title='transactions'
				emptyText='No Starknet transactions.'
				id='StarknetTransactionsView-$$transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
