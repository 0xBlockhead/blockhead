<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const cosmosContract = $derived(selection({
		fields: {
			codeId: true,
			$creator: true,
			$admin: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).address) ?? '')].filter(Boolean).join(' ') || 'Cosmos contract')
	const viewDomId = $derived('cosmos-contract-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosContract}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/contract/[address]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			address: String(({ ...selection.entitySelector, ...prefetched }).address),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String(address0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosContract}>
				{#snippet Pending()}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String(address0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosContract}>
				{#snippet Pending()}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const codeId0 = prefetched.codeId}
			{#if codeId0 !== undefined && codeId0 !== null}
				<span data-text="muted">
					{String((codeId0) ?? '')}
				</span>
			{/if}
		{:else}
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
					{@const codeId0 = entity.codeId}
					{#if codeId0 !== undefined && codeId0 !== null}
						<span data-text="muted">
							{String((codeId0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosAccount, false>('$creator')}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						<div>
							<dt>Creator</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount.entitySelector)}
									prefetched={cosmosAccount}
									href={
										resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
											caip2: `${String(cosmosAccount.entitySelector.$network.caip2.namespace)}:${String(cosmosAccount.entitySelector.$network.caip2.reference)}`,
											address: String(cosmosAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
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
					{#if cosmosAccount != null}
						<div>
							<dt>Admin</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount.entitySelector)}
									prefetched={cosmosAccount}
									href={
										resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
											caip2: `${String(cosmosAccount.entitySelector.$network.caip2.namespace)}:${String(cosmosAccount.entitySelector.$network.caip2.reference)}`,
											address: String(cosmosAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
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
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
