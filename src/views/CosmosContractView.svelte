<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.CosmosContract>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CosmosContract>
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
	const cosmosContract = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			codeId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			codeId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos contract')
	const viewDomId = $derived('cosmos-contract-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'codeId')}
			{@const address0 = pendingEntity.address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String((address0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosContract}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address0 = resolvedEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'codeId')}
			{@const address0 = pendingEntity.address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String((address0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosContract}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address0 = resolvedEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'codeId')}
			{@const codeId0 = pendingEntity.codeId}
			{#if codeId0 !== undefined && codeId0 !== null}
				<span data-text="muted">
					{String((codeId0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosContract}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							codeId: true,
						},
					})
				}
			>
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
				resource={selection.$creator}
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
										(
											cosmosAccount[EntityMetaKey.Selector] != null && 'address' in cosmosAccount[EntityMetaKey.Selector]
											&& cosmosAccount[EntityMetaKey.Selector].address != null
											&& cosmosAccount[EntityMetaKey.Selector] != null && '$network' in cosmosAccount[EntityMetaKey.Selector] ?
												cosmosAccount[EntityMetaKey.Selector].$network != null && 'caip2' in cosmosAccount[EntityMetaKey.Selector].$network
												&& cosmosAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(cosmosAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cosmosAccount[EntityMetaKey.Selector].$network != null && 'slug' in cosmosAccount[EntityMetaKey.Selector].$network
													&& cosmosAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
													network: String(cosmosAccount[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
				resource={selection.$admin}
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
										(
											cosmosAccount[EntityMetaKey.Selector] != null && 'address' in cosmosAccount[EntityMetaKey.Selector]
											&& cosmosAccount[EntityMetaKey.Selector].address != null
											&& cosmosAccount[EntityMetaKey.Selector] != null && '$network' in cosmosAccount[EntityMetaKey.Selector] ?
												cosmosAccount[EntityMetaKey.Selector].$network != null && 'caip2' in cosmosAccount[EntityMetaKey.Selector].$network
												&& cosmosAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(cosmosAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cosmosAccount[EntityMetaKey.Selector].$network != null && 'slug' in cosmosAccount[EntityMetaKey.Selector].$network
													&& cosmosAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(cosmosAccount[EntityMetaKey.Selector].address ?? ''),
													network: String(cosmosAccount[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
