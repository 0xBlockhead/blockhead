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
			selection: RegisteredEntityProxyResource<EntityType.NearReceipt>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NearReceipt>>
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
	const nearReceipt = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.receiptId) ?? '')].filter(Boolean).join(' ') || 'near receipt')
	const viewDomId = $derived('near-receipt-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearReceipt}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const receiptId0 = pendingEntity.receiptId}
					{#if receiptId0 !== undefined && receiptId0 !== null}
						<TruncatedValue value={String((receiptId0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={nearReceipt}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receiptId0 = resolvedEntity.receiptId}
					{#if receiptId0 !== undefined && receiptId0 !== null}
						<TruncatedValue value={String((receiptId0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={
						selection.$receiver({
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
					>
						{#snippet children(nearAccount)}
							{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
								<NearAccountView
									selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
									prefetched={nearAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={nearReceipt}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={
						selection.$receiver({
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
					>
						{#snippet children(nearAccount)}
							{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
								<NearAccountView
									selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
									prefetched={nearAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={
					selection.$predecessor({
						sources: [
							Source.NearRpc_JsonRpc,
						],
					})
				}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<NearAccountView
								selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
								prefetched={nearAccount}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={nearReceipt}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={
							selection.$predecessor({
								sources: [
									Source.NearRpc_JsonRpc,
								],
							})
						}
					>
						{#snippet children(nearAccount)}
							{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<NearAccountView
										selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
										prefetched={nearAccount}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
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
				<dt>Receipt ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									receiptId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const receiptId = resolvedEntity.receiptId}
							{#if receiptId !== undefined && receiptId !== null}
								<TruncatedValue value={String((receiptId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection.$predecessor({
						sources: [
							Source.NearRpc_JsonRpc,
						],
					})
				}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Predecessor</dt>
							<dd>
								<NearAccountView
									selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
									prefetched={nearAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection.$receiver({
						sources: [
							Source.NearRpc_JsonRpc,
						],
					})
				}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Receiver</dt>
							<dd>
								<NearAccountView
									selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
									prefetched={nearAccount}
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
</EntityView>
