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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandNetwork>>
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
	const algorandNetwork = $derived(selection({}))
	const titleFallback = $derived('algorand network')
	const viewDomId = $derived('algorand-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandRoundsView from '$/views/AlgorandRoundsView.svelte'
	import AlgorandAccountsView from '$/views/AlgorandAccountsView.svelte'
	import AlgorandApplicationsView from '$/views/AlgorandApplicationsView.svelte'
	import AlgorandAssetsView from '$/views/AlgorandAssetsView.svelte'
	import AlgorandTealProgramsView from '$/views/AlgorandTealProgramsView.svelte'
	import AlgorandTransactionsView from '$/views/AlgorandTransactionsView.svelte'
	import AlgorandNetwork_TimestampsView from '$/views/AlgorandNetwork_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandNetwork}>
			{#snippet Pending()}
				{title || 'algorand network'}
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
			<AlgorandRoundsView
				selection={selection[EntityProxyField]<EntityType.AlgorandRound>('$$rounds')}
				title='rounds'
				emptyText='No Algorand rounds.'
				id='AlgorandRoundsView-$$rounds'
			/>

			<AlgorandAccountsView
				selection={selection[EntityProxyField]<EntityType.AlgorandAccount>('$$accounts')}
				title='accounts'
				emptyText='No Algorand accounts.'
				id='AlgorandAccountsView-$$accounts'
			/>

			<AlgorandApplicationsView
				selection={selection[EntityProxyField]<EntityType.AlgorandApplication>('$$applications')}
				title='applications'
				emptyText='No Algorand applications.'
				id='AlgorandApplicationsView-$$applications'
			/>

			<AlgorandAssetsView
				selection={selection[EntityProxyField]<EntityType.AlgorandAsset>('$$assets')}
				title='assets'
				emptyText='No Algorand assets.'
				id='AlgorandAssetsView-$$assets'
			/>

			<AlgorandTealProgramsView
				selection={selection[EntityProxyField]<EntityType.AlgorandTealProgram>('$$tealPrograms')}
				title='TEAL programs'
				emptyText='No Algorand TEAL programs.'
				id='AlgorandTealProgramsView-$$tealPrograms'
			/>

			<AlgorandTransactionsView
				selection={selection[EntityProxyField]<EntityType.AlgorandTransaction>('$$transactions')}
				title='transactions'
				emptyText='No Algorand transactions.'
				id='AlgorandTransactionsView-$$transactions'
			/>

			<AlgorandNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AlgorandNetwork_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Algorand network observations.'
				id='AlgorandNetwork_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
