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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalArweaveNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalArweaveNetwork>>
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
	const globalArweaveNetwork = $derived(selection({
		sources: [
			Source.Arweave_Graphql,
			Source.Arweave_Rest,
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived('global Arweave network')
	const viewDomId = $derived('-global-arweave-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ArweaveNetworksView from '$/views/ArweaveNetworksView.svelte'
	import ArweaveBlocksView from '$/views/ArweaveBlocksView.svelte'
	import ArweaveTransactionsView from '$/views/ArweaveTransactionsView.svelte'
	import ArweaveResourcesView from '$/views/ArweaveResourcesView.svelte'
	import GlobalArweaveNetwork_TimestampsView from '$/views/_GlobalArweaveNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalArweaveNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalArweaveNetwork}>
			{#snippet Pending()}
				{title || 'global Arweave network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalArweaveNetwork}>
			{#snippet Pending()}
				{[String((selection.entitySelector.scope ?? prefetched.scope) ?? '')].filter(Boolean).join(' ') || title || 'global Arweave network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.scope) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = selection.entitySelector.scope ?? prefetched.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ArweaveNetworksView
				selection={selection[EntityProxyField]<EntityType.ArweaveNetwork>('$$sourceWindowNetworks')}
				title='Source-window networks'
				emptyText='No Arweave networks in this source window.'
				id='ArweaveNetworksView-$$sourceWindowNetworks'
			/>

			<ArweaveBlocksView
				selection={selection[EntityProxyField]<EntityType.ArweaveBlock>('$$sourceWindowBlocks')}
				title='Source-window blocks'
				emptyText='No Arweave blocks in this source window.'
				id='ArweaveBlocksView-$$sourceWindowBlocks'
			/>

			<ArweaveTransactionsView
				selection={selection[EntityProxyField]<EntityType.ArweaveTransaction>('$$sourceWindowTransactions')}
				title='Source-window transactions'
				emptyText='No Arweave transactions in this source window.'
				id='ArweaveTransactionsView-$$sourceWindowTransactions'
			/>

			<ArweaveResourcesView
				selection={selection[EntityProxyField]<EntityType.ArweaveResource>('$$sourceWindowResources')}
				title='Source-window resources'
				emptyText='No Arweave resources in this source window.'
				id='ArweaveResourcesView-$$sourceWindowResources'
			/>

			<GlobalArweaveNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalArweaveNetwork_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No Arweave hub observations yet.'
				id='_GlobalArweaveNetwork_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
