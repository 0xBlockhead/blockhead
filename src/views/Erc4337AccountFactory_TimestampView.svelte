<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Erc4337AccountFactory_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Erc4337AccountFactory_Timestamp>>
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
		sources: selection.sources,
		fields: {
			userOperationsCount: true,
			smartAccountsCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory timestamp')
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
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$factory !== undefined && pendingEntity.$factory.address !== undefined && pendingEntity.$factory.$network !== undefined && pendingEntity.$factory.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			address: String(pendingEntity.$factory.address ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$factory.$network.caip2) ?? ''),
		}) : pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$factory !== undefined && pendingEntity.$factory.address !== undefined && pendingEntity.$factory.$network !== undefined && pendingEntity.$factory.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			address: String(pendingEntity.$factory.address ?? ''),
			network: String(pendingEntity.$factory.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const userOperationsCount0 = pendingEntity.userOperationsCount}
					{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
						<NumberValue
							value={userOperationsCount0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userOperationsCount0 = resolvedEntity.userOperationsCount}
					{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
						<NumberValue
							value={userOperationsCount0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
			{@const smartAccountsCount1 = pendingEntity.smartAccountsCount}
			{#if smartAccountsCount1 !== undefined && smartAccountsCount1 !== null}
				<span data-text="muted">
					<NumberValue
						value={smartAccountsCount1}
					/>

					<span> smart accounts</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
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
							<NumberValue
								value={smartAccountsCount1}
							/>

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
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							userOperationsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userOperationsCount = resolvedEntity.userOperationsCount}
					{#if userOperationsCount !== undefined && userOperationsCount !== null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue
									value={userOperationsCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							smartAccountsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const smartAccountsCount = resolvedEntity.smartAccountsCount}
					{#if smartAccountsCount !== undefined && smartAccountsCount !== null}
						<div>
							<dt>Smart accounts</dt>
							<dd>
								<NumberValue
									value={smartAccountsCount}
								/>
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
						selection={select(EntityType.Erc4337AccountFactory, selection.entitySelector.$factory, {})}
						href={
							(selection.entitySelector.$factory.address !== undefined && selection.entitySelector.$factory.$network !== undefined && selection.entitySelector.$factory.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
								address: String(selection.entitySelector.$factory.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$factory.$network.caip2) ?? ''),
							}) : selection.entitySelector.$factory.address !== undefined && selection.entitySelector.$factory.$network !== undefined && selection.entitySelector.$factory.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
								address: String(selection.entitySelector.$factory.address ?? ''),
								network: String(selection.entitySelector.$factory.$network.slug ?? ''),
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
