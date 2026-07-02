<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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

	const erc4337AccountFactoryTimestamp = $derived(selection({
		fields: {
			userOperationsCount: true,
			smartAccountsCount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory timestamp')
	const viewDomId = $derived('erc4337account-factory-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337AccountFactory_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$factory.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$factory.$network.caip2.reference)}`,
			address: String(({ ...selection.entitySelector, ...prefetched }).$factory.address),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const userOperationsCount0 = ({ ...selection.entitySelector, ...prefetched }).userOperationsCount}
			{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
				<NumberValue value={Number(userOperationsCount0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
				{#snippet Pending()}
					{@const userOperationsCount0 = ({ ...selection.entitySelector, ...prefetched }).userOperationsCount}
					{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
						<NumberValue value={Number(userOperationsCount0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const userOperationsCount0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).userOperationsCount}
					{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
						<NumberValue value={Number(userOperationsCount0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
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
		{:else}
			<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
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
					{@const source0 = entity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const smartAccountsCount1 = entity.smartAccountsCount}
					{#if smartAccountsCount1 !== undefined && smartAccountsCount1 !== null}
						<span data-text="muted">
							<NumberValue value={Number(smartAccountsCount1)} />

							<span> smart accounts</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Factory</dt>
				<dd>
					<Erc4337AccountFactoryView
						selection={select(EntityType.Erc4337AccountFactory, selection.entitySelector.$factory)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$factory.caip2.namespace)}:${String(selection.entitySelector.$factory.caip2.reference)}`,
								address: String(selection.entitySelector.$factory.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
