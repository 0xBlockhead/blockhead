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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BnbBeaconNetwork>>
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
	const bnbBeaconNetwork = $derived(selection({
		fields: {
			decommissionedAtMs: true,
		},
	}))
	const titleFallback = $derived('bnb beacon network')
	const viewDomId = $derived('bnb-beacon-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BnbBeaconNetwork_TimestampsView from '$/views/BnbBeaconNetwork_TimestampsView.svelte'
	import BnbBeaconBlocksView from '$/views/BnbBeaconBlocksView.svelte'
	import BnbBeaconTransactionsView from '$/views/BnbBeaconTransactionsView.svelte'
	import BnbValidatorsView from '$/views/BnbValidatorsView.svelte'
	import BnbBeaconTokensView from '$/views/BnbBeaconTokensView.svelte'
	import BnbBeaconTokenMigrationsView from '$/views/BnbBeaconTokenMigrationsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconNetwork}>
			{#snippet Pending()}
				{@const decommissionedAtMs0 = prefetched.decommissionedAtMs}
				{#if decommissionedAtMs0 !== undefined && decommissionedAtMs0 !== null}
					<Timestamp timestamp={Number(decommissionedAtMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const decommissionedAtMs0 = resolvedEntity.decommissionedAtMs}
				{#if decommissionedAtMs0 !== undefined && decommissionedAtMs0 !== null}
					<Timestamp timestamp={Number(decommissionedAtMs0)} />
				{/if}
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
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decommissionedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const decommissionedAtMs = prefetched.decommissionedAtMs}
					{#if decommissionedAtMs !== undefined && decommissionedAtMs !== null}
						<div>
							<dt>decommissioned AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(decommissionedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decommissionedAtMs = resolvedEntity.decommissionedAtMs}
					{#if decommissionedAtMs !== undefined && decommissionedAtMs !== null}
						<div>
							<dt>decommissioned AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(decommissionedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fusionDeadlineMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fusionDeadlineMs = prefetched.fusionDeadlineMs}
					{#if fusionDeadlineMs !== undefined && fusionDeadlineMs !== null}
						<div>
							<dt>fusion deadline ms</dt>
							<dd>
								<Timestamp timestamp={Number(fusionDeadlineMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fusionDeadlineMs = resolvedEntity.fusionDeadlineMs}
					{#if fusionDeadlineMs !== undefined && fusionDeadlineMs !== null}
						<div>
							<dt>fusion deadline ms</dt>
							<dd>
								<Timestamp timestamp={Number(fusionDeadlineMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BnbBeaconNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconNetwork_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='BnbBeaconNetwork_TimestampsView-$$timestamps'
			/>

			<BnbBeaconBlocksView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconBlock>('$$blocks')}
				title='blocks'
				emptyText='No blocks found.'
				id='BnbBeaconBlocksView-$$blocks'
			/>

			<BnbBeaconTransactionsView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconTransaction>('$$transactions')}
				title='transactions'
				emptyText='No transactions found.'
				id='BnbBeaconTransactionsView-$$transactions'
			/>

			<BnbValidatorsView
				selection={selection[EntityProxyField]<EntityType.BnbValidator>('$$validators')}
				title='validators'
				emptyText='No validators found.'
				id='BnbValidatorsView-$$validators'
			/>

			<BnbBeaconTokensView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconToken>('$$tokens')}
				title='tokens'
				emptyText='No tokens found.'
				id='BnbBeaconTokensView-$$tokens'
			/>

			<BnbBeaconTokenMigrationsView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconTokenMigration>('$$migrationRecords')}
				title='migration records'
				emptyText='No migration records found.'
				id='BnbBeaconTokenMigrationsView-$$migrationRecords'
			/>
		{/if}
	{/snippet}
</EntityView>
