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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosContract>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosContract>>
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
	const cosmosContract = $derived(selection({
		fields: {
			codeId: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.address ?? prefetched.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos contract')
	const viewDomId = $derived('cosmos-contract-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosContract}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/contract/[address]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			address: String(pendingEntity.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosContract}>
			{#snippet Pending()}
				{@const address0 = selection.entitySelector.address ?? prefetched.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const address0 = resolvedEntity.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosContract}>
			{#snippet Pending()}
				{@const address0 = selection.entitySelector.address ?? prefetched.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const address0 = resolvedEntity.address}
				{#if address0 !== undefined && address0 !== null}
					<TruncatedValue value={String((address0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosContract}>
			{#snippet Pending()}
				{@const codeId0 = prefetched.codeId}
				{#if codeId0 !== undefined && codeId0 !== null}
					<span data-text="muted">
						{String((codeId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const codeId0 = resolvedEntity.codeId}
				{#if codeId0 !== undefined && codeId0 !== null}
					<span data-text="muted">
						{String((codeId0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codeId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const codeId = prefetched.codeId}
					{#if codeId !== undefined && codeId !== null}
						<div>
							<dt>Code ID</dt>
							<dd>
								{String((codeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codeId = resolvedEntity.codeId}
					{#if codeId !== undefined && codeId !== null}
						<div>
							<dt>Code ID</dt>
							<dd>
								{String((codeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosAccount, false>('$creator')}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null && cosmosAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Creator</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector])}
									prefetched={cosmosAccount}
									href={
										(cosmosAccount[EntityMetaKey.Selector].$network !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && cosmosAccount[EntityMetaKey.Selector].$network !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && cosmosAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
											caip2: `${String(cosmosAccount[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(cosmosAccount[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
											address: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosAccount, false>('$admin')}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null && cosmosAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Admin</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector])}
									prefetched={cosmosAccount}
									href={
										(cosmosAccount[EntityMetaKey.Selector].$network !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && cosmosAccount[EntityMetaKey.Selector].$network !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && cosmosAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && cosmosAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
											caip2: `${String(cosmosAccount[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(cosmosAccount[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
											address: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
</EntityView>
