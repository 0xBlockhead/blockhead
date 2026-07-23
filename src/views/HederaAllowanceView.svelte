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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.HederaAllowance>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.HederaAllowance>
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
	const hederaAllowance = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.allowanceKind) ?? '')].filter(Boolean).join(' ') || 'hedera allowance')
	const viewDomId = $derived('hedera-allowance-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaAllowance_TimestampsView from '$/views/HederaAllowance_TimestampsView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAllowance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaAllowance}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.allowanceKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hederaAllowance}>
			{#snippet children(entity)}
				<HederaAccountView
					selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaAllowance}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$token}
				>
					{#snippet children(hederaToken)}
						{#if hederaToken != null && hederaToken[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									prefetched={hederaToken}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const serialNumber1 = resolvedEntity.serialNumber}
				{#if serialNumber1 !== undefined && serialNumber1 !== null}
					<span data-text="muted">
						<NumberValue
							value={serialNumber1}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>owner</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$owner)}
						href={
							(
								selection.entitySelector.$owner != null && 'accountId' in selection.entitySelector.$owner
								&& selection.entitySelector.$owner.accountId != null
								&& selection.entitySelector.$owner != null && '$network' in selection.entitySelector.$owner ?
									selection.entitySelector.$owner.$network != null && 'caip2' in selection.entitySelector.$owner.$network
									&& selection.entitySelector.$owner.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
									accountId: String(selection.entitySelector.$owner.accountId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$owner.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$owner.$network != null && 'slug' in selection.entitySelector.$owner.$network
										&& selection.entitySelector.$owner.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
										accountId: String(selection.entitySelector.$owner.accountId ?? ''),
										network: String(selection.entitySelector.$owner.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>spender</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
						href={
							(
								selection.entitySelector.$spender != null && 'accountId' in selection.entitySelector.$spender
								&& selection.entitySelector.$spender.accountId != null
								&& selection.entitySelector.$spender != null && '$network' in selection.entitySelector.$spender ?
									selection.entitySelector.$spender.$network != null && 'caip2' in selection.entitySelector.$spender.$network
									&& selection.entitySelector.$spender.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
									accountId: String(selection.entitySelector.$spender.accountId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$spender.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$spender.$network != null && 'slug' in selection.entitySelector.$spender.$network
										&& selection.entitySelector.$spender.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
										accountId: String(selection.entitySelector.$spender.accountId ?? ''),
										network: String(selection.entitySelector.$spender.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>allowance kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									allowanceKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const allowanceKind = resolvedEntity.allowanceKind}
							{#if allowanceKind !== undefined && allowanceKind !== null}
								{String((allowanceKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null && hederaToken[EntityMetaKey.Selector] != null}
						<div>
							<dt>token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									prefetched={hederaToken}
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
						sources: selection.sources,
						fields: {
							serialNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serialNumber = resolvedEntity.serialNumber}
					{#if serialNumber !== undefined && serialNumber !== null}
						<div>
							<dt>serial number</dt>
							<dd>
								<NumberValue
									value={serialNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nft}
			>
				{#snippet children(hederaNft)}
					{#if hederaNft != null && hederaNft[EntityMetaKey.Selector] != null}
						<div>
							<dt>NFT</dt>
							<dd>
								<HederaNftView
									selection={select(EntityType.HederaNft, hederaNft[EntityMetaKey.Selector])}
									prefetched={hederaNft}
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
		{@const hederaAllowanceHederaAllowanceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={hederaAllowanceHederaAllowanceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<HederaAllowance_TimestampsView
					selection={hederaAllowanceHederaAllowanceTimestampsViewTimestampsResource}
					countResource={hederaAllowanceHederaAllowanceTimestampsViewTimestampsResource.count}
					title='Observations'
					id='HederaAllowance_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
