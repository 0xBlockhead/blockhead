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
			selection: RegisteredEntityProxyResource<EntityType.ZeroGServiceRequest>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ZeroGServiceRequest>>
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
	const zeroGServiceRequest = $derived(selection({
		sources: [
			Source.ZeroGChain_JsonRpc,
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.requestId) ?? '')].filter(Boolean).join(' ') || 'zero g service request')
	const viewDomId = $derived('zero-gservice-request-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGServiceProviderView from '$/views/ZeroGServiceProviderView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGSettlementTraceView from '$/views/ZeroGSettlementTraceView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceRequest}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zeroGServiceRequest}>
			{#snippet Pending()}
				{[String((pendingEntity.requestId) ?? '')].filter(Boolean).join(' ') || title || 'zero g service request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.requestId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zeroGServiceRequest}>
			{#snippet Pending()}
				<ZeroGServiceProviderView
					selection={select(EntityType.ZeroGServiceProvider, selection.entitySelector.$serviceProvider)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ZeroGServiceProviderView
					selection={select(EntityType.ZeroGServiceProvider, selection.entitySelector.$serviceProvider)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGServiceRequest}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$requester}
				>
					{#snippet children(evmAccount)}
						{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$requester}
				>
					{#snippet children(evmAccount)}
						{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>service provider</dt>
				<dd>
					<ZeroGServiceProviderView
						selection={select(EntityType.ZeroGServiceProvider, selection.entitySelector.$serviceProvider, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>request ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestId = pendingEntity.requestId}
							{#if requestId !== undefined && requestId !== null}
								{String((requestId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestId = resolvedEntity.requestId}
							{#if requestId !== undefined && requestId !== null}
								{String((requestId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$requester}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>requester</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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
				resource={
					selection({
						fields: {
							requestHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestHash = pendingEntity.requestHash}
					{#if requestHash !== undefined && requestHash !== null}
						<div>
							<dt>request hash</dt>
							<dd>
								<TruncatedValue value={String((requestHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestHash = resolvedEntity.requestHash}
					{#if requestHash !== undefined && requestHash !== null}
						<div>
							<dt>request hash</dt>
							<dd>
								<TruncatedValue value={String((requestHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							responseHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseHash = pendingEntity.responseHash}
					{#if responseHash !== undefined && responseHash !== null}
						<div>
							<dt>response hash</dt>
							<dd>
								<TruncatedValue value={String((responseHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseHash = resolvedEntity.responseHash}
					{#if responseHash !== undefined && responseHash !== null}
						<div>
							<dt>response hash</dt>
							<dd>
								<TruncatedValue value={String((responseHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$settlementTrace}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(zeroGSettlementTrace)}
					{#if zeroGSettlementTrace != null && zeroGSettlementTrace[EntityMetaKey.Selector] != null}
						<div>
							<dt>settlement trace</dt>
							<dd>
								<ZeroGSettlementTraceView
									selection={select(EntityType.ZeroGSettlementTrace, zeroGSettlementTrace[EntityMetaKey.Selector])}
									prefetched={zeroGSettlementTrace}
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
