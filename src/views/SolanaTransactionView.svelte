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

	const solanaTransaction = $derived(selection({
		fields: {
			status: true,
			slot: true,
			feeLamports: true,
			computeUnitsConsumed: true,
			$block: true,
			$feePayer: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction')
	const viewDomId = $derived('solana-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaInstructionsView from '$/views/SolanaInstructionsView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			signature: String(({ ...selection.entitySelector, ...prefetched }).signature),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const signature0 = ({ ...selection.entitySelector, ...prefetched }).signature}
			{#if signature0 !== undefined && signature0 !== null}
				<TruncatedValue value={String(signature0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTransaction}>
				{#snippet Pending()}
					{@const signature0 = ({ ...selection.entitySelector, ...prefetched }).signature}
					{#if signature0 !== undefined && signature0 !== null}
						<TruncatedValue value={String(signature0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const signature0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).signature}
					{#if signature0 !== undefined && signature0 !== null}
						<TruncatedValue value={String(signature0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const signature0 = ({ ...selection.entitySelector, ...prefetched }).signature}
			{#if signature0 !== undefined && signature0 !== null}
				<TruncatedValue value={String(signature0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTransaction}>
				{#snippet Pending()}
					{@const signature0 = ({ ...selection.entitySelector, ...prefetched }).signature}
					{#if signature0 !== undefined && signature0 !== null}
						<TruncatedValue value={String(signature0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const signature0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).signature}
					{#if signature0 !== undefined && signature0 !== null}
						<TruncatedValue value={String(signature0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const status0 = prefetched.status}
			{#if status0 !== undefined && status0 !== null}
				<span data-text="muted">
					{String((status0) ?? '')}
				</span>
			{/if}
		{:else}
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
					{@const status0 = entity.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={solanaTransaction}>
				{#snippet Pending()}
					{@const slot = prefetched.slot ?? selection.entitySelector.slot}
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
					{@const slot = entity.slot ?? selection.entitySelector.slot ?? prefetched.slot}
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

			<ResourceBoundary resource={solanaTransaction}>
				{#snippet Pending()}
					{@const feeLamports = prefetched.feeLamports ?? selection.entitySelector.feeLamports}
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
					{@const feeLamports = entity.feeLamports ?? selection.entitySelector.feeLamports ?? prefetched.feeLamports}
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

			<ResourceBoundary resource={solanaTransaction}>
				{#snippet Pending()}
					{@const computeUnitsConsumed = prefetched.computeUnitsConsumed ?? selection.entitySelector.computeUnitsConsumed}
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
					{@const computeUnitsConsumed = entity.computeUnitsConsumed ?? selection.entitySelector.computeUnitsConsumed ?? prefetched.computeUnitsConsumed}
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
					{#if solanaBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<SolanaBlockView
									selection={select(EntityType.SolanaBlock, solanaBlock.entitySelector)}
									prefetched={solanaBlock}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/block/[slot]', {
											networkSlug: String(solanaBlock.entitySelector.$network.slug),
											slot: String(solanaBlock.entitySelector.slot),
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
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$feePayer')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Fee payer</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount.entitySelector)}
									prefetched={solanaAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(solanaAccount.entitySelector.$network.slug),
											pubkey: String(solanaAccount.entitySelector.pubkey),
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
