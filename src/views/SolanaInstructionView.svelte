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
			selection: RegisteredEntityProxyResource<EntityType.SolanaInstruction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SolanaInstruction>>
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
	const solanaInstruction = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('solana instruction')
	const viewDomId = $derived('solana-instruction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.instructionKind === 'Instruction' && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$transaction.signature ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$transaction.$network.caip2) ?? ''),
		}) : pendingEntity.instructionKind === 'Instruction' && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$transaction.signature ?? ''),
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
		}) : pendingEntity.instructionKind === 'InnerInstruction' && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.indexInInstruction !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			indexInInstruction: String(pendingEntity.indexInInstruction ?? ''),
			transactionId: String(pendingEntity.$transaction.signature ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$transaction.$network.caip2) ?? ''),
		}) : pendingEntity.instructionKind === 'InnerInstruction' && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.indexInInstruction !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			indexInInstruction: String(pendingEntity.indexInInstruction ?? ''),
			transactionId: String(pendingEntity.$transaction.signature ?? ''),
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
						(selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
						}) : selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
						(selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
						}) : selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
						(selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
						}) : selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						href={
						(selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
						}) : selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const instructionKind0 = pendingEntity.instructionKind}
			{#if instructionKind0 !== undefined && instructionKind0 !== null}
				<span data-text="muted">
					{String((instructionKind0) ?? '')}
				</span>
			{/if}
			{@const indexInTransaction1 = pendingEntity.indexInTransaction}
			{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
				<span data-text="muted">
					{String((indexInTransaction1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaInstruction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instructionKind0 = resolvedEntity.instructionKind}
					{#if instructionKind0 !== undefined && instructionKind0 !== null}
						<span data-text="muted">
							{String((instructionKind0) ?? '')}
						</span>
					{/if}
					{@const indexInTransaction1 = resolvedEntity.indexInTransaction}
					{#if indexInTransaction1 !== undefined && indexInTransaction1 !== null}
						<span data-text="muted">
							{String((indexInTransaction1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instruction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									instructionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const instructionKind = resolvedEntity.instructionKind}
							{#if instructionKind !== undefined && instructionKind !== null}
								{String((instructionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue
									value={indexInTransaction}
								/>
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
							indexInInstruction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexInInstruction = resolvedEntity.indexInInstruction}
					{#if indexInInstruction !== undefined && indexInInstruction !== null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue
									value={indexInInstruction}
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
							parsedType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parsedType = resolvedEntity.parsedType}
					{#if parsedType !== undefined && parsedType !== null}
						<div>
							<dt>Parsed type</dt>
							<dd>
								{String((parsedType) ?? '')}
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
							stackHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stackHeight = resolvedEntity.stackHeight}
					{#if stackHeight !== undefined && stackHeight !== null}
						<div>
							<dt>Stack height</dt>
							<dd>
								{String((stackHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$program}
			>
				{#snippet children(solanaProgram)}
					{#if solanaProgram != null && solanaProgram[EntityMetaKey.Selector] != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaProgram[EntityMetaKey.Selector])}
									prefetched={solanaProgram}
									href={
										(solanaProgram[EntityMetaKey.Selector].programId !== undefined && solanaProgram[EntityMetaKey.Selector].$network !== undefined && solanaProgram[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
											programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
											network: String(caip2StringFromValue(solanaProgram[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaProgram[EntityMetaKey.Selector].programId !== undefined && solanaProgram[EntityMetaKey.Selector].$network !== undefined && solanaProgram[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
											programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
											network: String(solanaProgram[EntityMetaKey.Selector].$network.slug ?? ''),
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
				<dt>Transaction</dt>
				<dd>
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
							}) : selection.entitySelector.$transaction.signature !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
								network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						data: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const data = resolvedEntity.data}
				{#if data !== undefined && data !== null && data !== ''}
					<code>{String((data) ?? '')}</code>
				{:else}
					<p data-text="muted">No instruction data available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<SolanaAccountsView
				selection={
						selection.$$accounts({
							sources: [
								Source.Solana_JsonRpc,
							],
							count: true,
						})
					}
				title='Accounts'
				emptyText='No instruction accounts.'
				id='SolanaAccountsView-accounts'
			/>
		{/if}
	{/snippet}
</EntityView>
