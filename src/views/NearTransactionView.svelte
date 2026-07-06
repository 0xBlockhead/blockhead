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
			selection: EntityProxyResource<typeof schema, EntityType.NearTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearTransaction>>
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
	const nearTransaction = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
		fields: {
			$signer: true,
			$receiver: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.hash ?? prefetched.hash) ?? '')].filter(Boolean).join(' ') || 'near transaction')
	const viewDomId = $derived('near-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearActionsView from '$/views/NearActionsView.svelte'
	import NearExecutionOutcomesView from '$/views/NearExecutionOutcomesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearTransaction}>
			{#snippet Pending()}
				{@const hash0 = selection.entitySelector.hash ?? prefetched.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const hash0 = resolvedEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearTransaction}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.NearAccount, false>('$signer', {
							sources: [
								Source.NearRpc_JsonRpc,
								Source.NearBlocks_Rest,
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
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const signerAccountId1 = prefetched.signerAccountId}
				{#if signerAccountId1 !== undefined && signerAccountId1 !== null}
					<TruncatedValue value={String((signerAccountId1) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.NearAccount, false>('$signer', {
							sources: [
								Source.NearRpc_JsonRpc,
								Source.NearBlocks_Rest,
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
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const signerAccountId1 = resolvedEntity.signerAccountId}
				{#if signerAccountId1 !== undefined && signerAccountId1 !== null}
					<TruncatedValue value={String((signerAccountId1) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearTransaction}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.NearAccount, false>('$receiver', {
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
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.NearAccount, false>('$receiver', {
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
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = selection.entitySelector.hash ?? prefetched.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Signer account ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signerAccountId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signerAccountId = prefetched.signerAccountId}
							{#if signerAccountId !== undefined && signerAccountId !== null}
								<TruncatedValue value={String((signerAccountId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signerAccountId = resolvedEntity.signerAccountId}
							{#if signerAccountId !== undefined && signerAccountId !== null}
								<TruncatedValue value={String((signerAccountId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.NearAccount, false>('$signer', {
						sources: [
							Source.NearRpc_JsonRpc,
							Source.NearBlocks_Rest,
						],
					})
				}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null && nearAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Signer</dt>
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
					selection[EntityProxyField]<EntityType.NearAccount, false>('$receiver', {
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = prefetched.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NearActionsView
				selection={
						selection[EntityProxyField]<EntityType.NearAction>('$$actions', {
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Actions'
				id='NearActionsView-$$actions'
			/>

			<NearExecutionOutcomesView
				selection={
						selection[EntityProxyField]<EntityType.NearExecutionOutcome>('$$executionOutcomes', {
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Execution outcomes'
				id='NearExecutionOutcomesView-$$executionOutcomes'
			/>
		{/if}
	{/snippet}
</EntityView>
