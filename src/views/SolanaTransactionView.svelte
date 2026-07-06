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
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaTransaction>>
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
	const solanaTransaction = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.signature ?? prefetched.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction')
	const viewDomId = $derived('solana-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaInstructionsView from '$/views/SolanaInstructionsView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
			signature: String(pendingEntity.signature ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaTransaction}>
			{#snippet Pending()}
				{@const signature0 = selection.entitySelector.signature ?? prefetched.signature}
				{#if signature0 !== undefined && signature0 !== null}
					<TruncatedValue value={String((signature0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const signature0 = resolvedEntity.signature}
				{#if signature0 !== undefined && signature0 !== null}
					<TruncatedValue value={String((signature0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTransaction}>
			{#snippet Pending()}
				{@const signature0 = selection.entitySelector.signature ?? prefetched.signature}
				{#if signature0 !== undefined && signature0 !== null}
					<TruncatedValue value={String((signature0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const signature0 = resolvedEntity.signature}
				{#if signature0 !== undefined && signature0 !== null}
					<TruncatedValue value={String((signature0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTransaction}>
			{#snippet Pending()}
				{@const status0 = prefetched.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const status0 = resolvedEntity.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signature = selection.entitySelector.signature ?? prefetched.signature}
							{#if signature !== undefined && signature !== null}
								<TruncatedValue value={String((signature) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signature = resolvedEntity.signature}
							{#if signature !== undefined && signature !== null}
								<TruncatedValue value={String((signature) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slot = prefetched.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeLamports: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeLamports = prefetched.feeLamports}
					{#if feeLamports !== undefined && feeLamports !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((feeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeLamports = resolvedEntity.feeLamports}
					{#if feeLamports !== undefined && feeLamports !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((feeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							computeUnitsConsumed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const computeUnitsConsumed = prefetched.computeUnitsConsumed}
					{#if computeUnitsConsumed !== undefined && computeUnitsConsumed !== null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{String((computeUnitsConsumed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const computeUnitsConsumed = resolvedEntity.computeUnitsConsumed}
					{#if computeUnitsConsumed !== undefined && computeUnitsConsumed !== null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{String((computeUnitsConsumed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaBlock, false>('$block')}
			>
				{#snippet children(solanaBlock)}
					{#if solanaBlock != null && solanaBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<SolanaBlockView
									selection={select(EntityType.SolanaBlock, solanaBlock[EntityMetaKey.Selector])}
									prefetched={solanaBlock}
									href={
										(solanaBlock[EntityMetaKey.Selector].$network !== undefined && solanaBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaBlock[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaBlock[EntityMetaKey.Selector].$network !== undefined && solanaBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaBlock[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaBlock[EntityMetaKey.Selector].slot !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/block/[slot]', {
											networkSlug: String(networkByCaip2[String(String(solanaBlock[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaBlock[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											slot: String(solanaBlock[EntityMetaKey.Selector].slot ?? ''),
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
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$feePayer')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Fee payer</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaAccount[EntityMetaKey.Selector].pubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(networkByCaip2[String(String(solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaAccount[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											pubkey: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
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

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<SolanaInstructionsView
				selection={selection[EntityProxyField]<EntityType.SolanaInstruction>('$$instructions')}
				title='Instructions'
				id='SolanaInstructionsView-$$instructions'
			/>
		{/if}
	{/snippet}
</EntityView>
