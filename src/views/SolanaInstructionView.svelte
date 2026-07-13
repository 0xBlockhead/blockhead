<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaInstruction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaInstruction>>
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
	const solanaInstruction = $derived(selection({}))
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
		href ?? (pendingEntity.instructionKind !== undefined && pendingEntity.instructionKind === 'Instruction' && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
			transactionId: String(pendingEntity.$transaction.signature ?? ''),
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
		}) : pendingEntity.instructionKind !== undefined && pendingEntity.instructionKind === 'InnerInstruction' && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined && pendingEntity.$transaction.signature !== undefined && pendingEntity.instructionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.indexInInstruction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
			transactionId: String(pendingEntity.$transaction.signature ?? ''),
			instructionKind: String(pendingEntity.instructionKind ?? ''),
			indexInTransaction: String(pendingEntity.indexInTransaction ?? ''),
			indexInInstruction: String(pendingEntity.indexInInstruction ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaInstruction}>
			{#snippet Pending()}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaInstruction}>
			{#snippet Pending()}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<SolanaTransactionView
					selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
					href={
						(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
							transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaInstruction}>
			{#snippet Pending()}
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
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instruction kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									instructionKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const instructionKind = pendingEntity.instructionKind}
							{#if instructionKind !== undefined && instructionKind !== null}
								{String((instructionKind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTransaction = pendingEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexInInstruction: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const indexInInstruction = pendingEntity.indexInInstruction}
					{#if indexInInstruction !== undefined && indexInInstruction !== null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue value={Number(indexInInstruction)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexInInstruction = resolvedEntity.indexInInstruction}
					{#if indexInInstruction !== undefined && indexInInstruction !== null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue value={Number(indexInInstruction)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parsedType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parsedType = pendingEntity.parsedType}
					{#if parsedType !== undefined && parsedType !== null}
						<div>
							<dt>Parsed type</dt>
							<dd>
								{String((parsedType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							stackHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stackHeight = pendingEntity.stackHeight}
					{#if stackHeight !== undefined && stackHeight !== null}
						<div>
							<dt>Stack height</dt>
							<dd>
								{String((stackHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(solanaProgram)}
					{#if solanaProgram != null && solanaProgram[EntityMetaKey.Selector] != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaProgram[EntityMetaKey.Selector])}
									prefetched={solanaProgram}
									href={
										(solanaProgram[EntityMetaKey.Selector].$network !== undefined && solanaProgram[EntityMetaKey.Selector].$network.slug !== undefined && solanaProgram[EntityMetaKey.Selector].programId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
											network: String(solanaProgram[EntityMetaKey.Selector].$network.slug ?? ''),
											programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
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
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
								transactionId: String(selection.entitySelector.$transaction.signature ?? ''),
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
