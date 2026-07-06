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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337AccountFactory_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Erc4337AccountFactory_Timestamp>>
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
	const erc4337AccountFactoryTimestamp = $derived(selection({
		fields: {
			userOperationsCount: true,
			smartAccountsCount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory timestamp')
	const viewDomId = $derived('erc4337account-factory-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337AccountFactory_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$factory !== undefined && pendingEntity.$factory.$network !== undefined && pendingEntity.$factory.$network.caip2 !== undefined && pendingEntity.$factory.$network.caip2.namespace !== undefined && pendingEntity.$factory !== undefined && pendingEntity.$factory.$network !== undefined && pendingEntity.$factory.$network.caip2 !== undefined && pendingEntity.$factory.$network.caip2.reference !== undefined && pendingEntity.$factory !== undefined && pendingEntity.$factory.address !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$factory.$network.caip2.namespace ?? '')}:${String(pendingEntity.$factory.$network.caip2.reference ?? '')}`,
			address: String(pendingEntity.$factory.address ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
			{#snippet Pending()}
				{@const userOperationsCount0 = prefetched.userOperationsCount}
				{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
					<NumberValue value={Number(userOperationsCount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const userOperationsCount0 = resolvedEntity.userOperationsCount}
				{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
					<NumberValue value={Number(userOperationsCount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const smartAccountsCount1 = prefetched.smartAccountsCount}
				{#if smartAccountsCount1 !== undefined && smartAccountsCount1 !== null}
					<span data-text="muted">
						<NumberValue value={Number(smartAccountsCount1)} />

						<span> smart accounts</span>
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const smartAccountsCount1 = resolvedEntity.smartAccountsCount}
				{#if smartAccountsCount1 !== undefined && smartAccountsCount1 !== null}
					<span data-text="muted">
						<NumberValue value={Number(smartAccountsCount1)} />

						<span> smart accounts</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							userOperationsCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const userOperationsCount = prefetched.userOperationsCount}
					{#if userOperationsCount !== undefined && userOperationsCount !== null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue value={Number(userOperationsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userOperationsCount = resolvedEntity.userOperationsCount}
					{#if userOperationsCount !== undefined && userOperationsCount !== null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue value={Number(userOperationsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							smartAccountsCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const smartAccountsCount = prefetched.smartAccountsCount}
					{#if smartAccountsCount !== undefined && smartAccountsCount !== null}
						<div>
							<dt>Smart accounts</dt>
							<dd>
								<NumberValue value={Number(smartAccountsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const smartAccountsCount = resolvedEntity.smartAccountsCount}
					{#if smartAccountsCount !== undefined && smartAccountsCount !== null}
						<div>
							<dt>Smart accounts</dt>
							<dd>
								<NumberValue value={Number(smartAccountsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Factory</dt>
				<dd>
					<Erc4337AccountFactoryView
						selection={select(EntityType.Erc4337AccountFactory, selection.entitySelector.$factory)}
						href={
							(selection.entitySelector.$factory.$network !== undefined && selection.entitySelector.$factory.$network.caip2 !== undefined && selection.entitySelector.$factory.$network.caip2.namespace !== undefined && selection.entitySelector.$factory.$network !== undefined && selection.entitySelector.$factory.$network.caip2 !== undefined && selection.entitySelector.$factory.$network.caip2.reference !== undefined && selection.entitySelector.$factory.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$factory.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$factory.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$factory.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
