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
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.LensAccountManager>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LensAccountManager>
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
	const lensAccountManager = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			isLensManager: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			isLensManager: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.manager) ?? '')].filter(Boolean).join(' ') || 'Lens account manager')
	const viewDomId = $derived('lens-account-manager-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccountManager}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'isLensManager')}
			{@const manager0 = pendingEntity.manager}
			{#if manager0 !== undefined && manager0 !== null}
				<TruncatedValue value={String((manager0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={lensAccountManager}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const manager0 = resolvedEntity.manager}
					{#if manager0 !== undefined && manager0 !== null}
						<TruncatedValue value={String((manager0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'isLensManager')}
			{@const manager0 = pendingEntity.manager}
			{#if manager0 !== undefined && manager0 !== null}
				<TruncatedValue value={String((manager0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={lensAccountManager}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const manager0 = resolvedEntity.manager}
					{#if manager0 !== undefined && manager0 !== null}
						<TruncatedValue value={String((manager0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'isLensManager')}
			{@const isLensManager0 = pendingEntity.isLensManager}
			{#if isLensManager0 !== undefined && isLensManager0 !== null}
				<span data-text="muted">
					{isLensManager0 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={lensAccountManager}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isLensManager0 = resolvedEntity.isLensManager}
					{#if isLensManager0 !== undefined && isLensManager0 !== null}
						<span data-text="muted">
							{isLensManager0 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Manager</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									manager: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const manager = resolvedEntity.manager}
							{#if manager !== undefined && manager !== null}
								<TruncatedValue value={String((manager) ?? '')} />
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
							addedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const addedAt = resolvedEntity.addedAt}
					{#if addedAt !== undefined && addedAt !== null}
						<div>
							<dt>Added at</dt>
							<dd>
								<Timestamp timestamp={Number(addedAt)} />
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
							isLensManager: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isLensManager = resolvedEntity.isLensManager}
					{#if isLensManager !== undefined && isLensManager !== null}
						<div>
							<dt>Is Lens manager</dt>
							<dd>
								{isLensManager ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							canExecuteTransactions: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canExecuteTransactions = resolvedEntity.canExecuteTransactions}
					{#if canExecuteTransactions !== undefined && canExecuteTransactions !== null}
						<div>
							<dt>Can execute transactions</dt>
							<dd>
								{canExecuteTransactions ? 'Yes' : 'No'}
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
							canSetMetadataUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canSetMetadataUri = resolvedEntity.canSetMetadataUri}
					{#if canSetMetadataUri !== undefined && canSetMetadataUri !== null}
						<div>
							<dt>Can set metadata URI</dt>
							<dd>
								{canSetMetadataUri ? 'Yes' : 'No'}
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
							canTransferNative: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canTransferNative = resolvedEntity.canTransferNative}
					{#if canTransferNative !== undefined && canTransferNative !== null}
						<div>
							<dt>Can transfer native</dt>
							<dd>
								{canTransferNative ? 'Yes' : 'No'}
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
							canTransferTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canTransferTokens = resolvedEntity.canTransferTokens}
					{#if canTransferTokens !== undefined && canTransferTokens !== null}
						<div>
							<dt>Can transfer tokens</dt>
							<dd>
								{canTransferTokens ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<LensAccountView
						selection={select(EntityType.LensAccount, selection.entitySelector.$account)}
						href={
							(
								selection.entitySelector.$account != null && 'address' in selection.entitySelector.$account
								&& selection.entitySelector.$account.address != null ?
									resolve('/lens/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$account.address ?? ''),
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
