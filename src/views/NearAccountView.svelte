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
			selection: RegisteredEntityProxyResource<EntityType.NearAccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NearAccount>>
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
	const nearAccount = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
		fields: {
			amountYoctoNear: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.accountId) ?? '')].filter(Boolean).join(' ') || 'near account')
	const viewDomId = $derived('near-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearAccessKeysView from '$/views/NearAccessKeysView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearAccount}>
			{#snippet Pending()}
				{[String((pendingEntity.accountId) ?? '')].filter(Boolean).join(' ') || title || 'near account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.accountId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAccount}>
			{#snippet Pending()}
				{@const amountYoctoNear0 = pendingEntity.amountYoctoNear}
				{#if amountYoctoNear0 !== undefined && amountYoctoNear0 !== null}
					<NumberValue value={Number(amountYoctoNear0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amountYoctoNear0 = resolvedEntity.amountYoctoNear}
				{#if amountYoctoNear0 !== undefined && amountYoctoNear0 !== null}
					<NumberValue value={Number(amountYoctoNear0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearAccount}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Account ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountId = pendingEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountId = resolvedEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
							Source.NearBlocks_Rest,
						],
						fields: {
							amountYoctoNear: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountYoctoNear = pendingEntity.amountYoctoNear}
					{#if amountYoctoNear !== undefined && amountYoctoNear !== null}
						<div>
							<dt>Amount yocto near</dt>
							<dd>
								<NumberValue value={Number(amountYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountYoctoNear = resolvedEntity.amountYoctoNear}
					{#if amountYoctoNear !== undefined && amountYoctoNear !== null}
						<div>
							<dt>Amount yocto near</dt>
							<dd>
								<NumberValue value={Number(amountYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							storageUsageBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageUsageBytes = pendingEntity.storageUsageBytes}
					{#if storageUsageBytes !== undefined && storageUsageBytes !== null}
						<div>
							<dt>Storage usage bytes</dt>
							<dd>
								<NumberValue value={Number(storageUsageBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageUsageBytes = resolvedEntity.storageUsageBytes}
					{#if storageUsageBytes !== undefined && storageUsageBytes !== null}
						<div>
							<dt>Storage usage bytes</dt>
							<dd>
								<NumberValue value={Number(storageUsageBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection.$contract({
						sources: [
							Source.NearRpc_JsonRpc,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(nearContract)}
					{#if nearContract != null && nearContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<NearContractView
									selection={select(EntityType.NearContract, nearContract[EntityMetaKey.Selector])}
									prefetched={nearContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NearAccessKeysView
				selection={
						selection.$$accessKeys({
							sources: [
								Source.NearRpc_JsonRpc,
							],
							count: true,
						})
					}
				title='Access keys'
				id='NearAccessKeysView-access-keys'
			/>
		{/if}
	{/snippet}
</EntityView>
