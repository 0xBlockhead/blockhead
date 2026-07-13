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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaAccount_Timestamp>>
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
	const solanaAccountTimestamp = $derived(selection({
		fields: {
			lamports: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.slot) ?? '')].filter(Boolean).join(' ') || 'solana account timestamp')
	const viewDomId = $derived('solana-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaAccountTimestamp}>
			{#snippet Pending()}
				{@const slot0 = pendingEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const slot0 = resolvedEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaAccountTimestamp}>
			{#snippet Pending()}
				{@const lamports0 = pendingEntity.lamports}
				{#if lamports0 !== undefined && lamports0 !== null}
					<NumberValue value={Number(lamports0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const lamports0 = resolvedEntity.lamports}
				{#if lamports0 !== undefined && lamports0 !== null}
					<NumberValue value={Number(lamports0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaAccountTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<SolanaAccountView
						selection={select(EntityType.SolanaAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined && selection.entitySelector.$account.pubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
								network: String(selection.entitySelector.$account.$network.slug ?? ''),
								accountId: String(selection.entitySelector.$account.pubkey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							ownerProgramId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownerProgramId = pendingEntity.ownerProgramId}
					{#if ownerProgramId !== undefined && ownerProgramId !== null}
						<div>
							<dt>Owner program ID</dt>
							<dd>
								{String((ownerProgramId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownerProgramId = resolvedEntity.ownerProgramId}
					{#if ownerProgramId !== undefined && ownerProgramId !== null}
						<div>
							<dt>Owner program ID</dt>
							<dd>
								{String((ownerProgramId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							executable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const executable = pendingEntity.executable}
					{#if executable !== undefined && executable !== null}
						<div>
							<dt>Executable</dt>
							<dd>
								{executable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const executable = resolvedEntity.executable}
					{#if executable !== undefined && executable !== null}
						<div>
							<dt>Executable</dt>
							<dd>
								{executable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							rentEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rentEpoch = pendingEntity.rentEpoch}
					{#if rentEpoch !== undefined && rentEpoch !== null}
						<div>
							<dt>Rent epoch</dt>
							<dd>
								{String((rentEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rentEpoch = resolvedEntity.rentEpoch}
					{#if rentEpoch !== undefined && rentEpoch !== null}
						<div>
							<dt>Rent epoch</dt>
							<dd>
								{String((rentEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spaceBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spaceBytes = pendingEntity.spaceBytes}
					{#if spaceBytes !== undefined && spaceBytes !== null}
						<div>
							<dt>Space bytes</dt>
							<dd>
								{String((spaceBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spaceBytes = resolvedEntity.spaceBytes}
					{#if spaceBytes !== undefined && spaceBytes !== null}
						<div>
							<dt>Space bytes</dt>
							<dd>
								{String((spaceBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
						],
						fields: {
							dataEncoding: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataEncoding = pendingEntity.dataEncoding}
					{#if dataEncoding !== undefined && dataEncoding !== null}
						<div>
							<dt>Data encoding</dt>
							<dd>
								{String((dataEncoding) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataEncoding = resolvedEntity.dataEncoding}
					{#if dataEncoding !== undefined && dataEncoding !== null}
						<div>
							<dt>Data encoding</dt>
							<dd>
								{String((dataEncoding) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
