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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaValidator>>
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
	const solanaValidator = $derived(selection({
		fields: {
			delinquent: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator')
	const viewDomId = $derived('solana-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaValidator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.votePubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
			network: String(pendingEntity.$network.slug ?? ''),
			validatorId: String(pendingEntity.votePubkey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaValidator}>
			{#snippet Pending()}
				{@const votePubkey0 = pendingEntity.votePubkey}
				{#if votePubkey0 !== undefined && votePubkey0 !== null}
					<TruncatedValue value={String((votePubkey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const votePubkey0 = resolvedEntity.votePubkey}
				{#if votePubkey0 !== undefined && votePubkey0 !== null}
					<TruncatedValue value={String((votePubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaValidator}>
			{#snippet Pending()}
				{@const votePubkey0 = pendingEntity.votePubkey}
				{#if votePubkey0 !== undefined && votePubkey0 !== null}
					<TruncatedValue value={String((votePubkey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const votePubkey0 = resolvedEntity.votePubkey}
				{#if votePubkey0 !== undefined && votePubkey0 !== null}
					<TruncatedValue value={String((votePubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaValidator}>
			{#snippet Pending()}
				{@const delinquent0 = pendingEntity.delinquent}
				{#if delinquent0 !== undefined && delinquent0 !== null}
					<span data-text="muted">
						{delinquent0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const delinquent0 = resolvedEntity.delinquent}
				{#if delinquent0 !== undefined && delinquent0 !== null}
					<span data-text="muted">
						{delinquent0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Vote public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									votePubkey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const votePubkey = pendingEntity.votePubkey}
							{#if votePubkey !== undefined && votePubkey !== null}
								<TruncatedValue value={String((votePubkey) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const votePubkey = resolvedEntity.votePubkey}
							{#if votePubkey !== undefined && votePubkey !== null}
								<TruncatedValue value={String((votePubkey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodePubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodePubkey = pendingEntity.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>Node public key</dt>
							<dd>
								<TruncatedValue value={String((nodePubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodePubkey = resolvedEntity.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>Node public key</dt>
							<dd>
								<TruncatedValue value={String((nodePubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activatedStakeLamports: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activatedStakeLamports = pendingEntity.activatedStakeLamports}
					{#if activatedStakeLamports !== undefined && activatedStakeLamports !== null}
						<div>
							<dt>Activated stake</dt>
							<dd>
								{String((activatedStakeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activatedStakeLamports = resolvedEntity.activatedStakeLamports}
					{#if activatedStakeLamports !== undefined && activatedStakeLamports !== null}
						<div>
							<dt>Activated stake</dt>
							<dd>
								{String((activatedStakeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commission: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commission = pendingEntity.commission}
					{#if commission !== undefined && commission !== null}
						<div>
							<dt>Commission</dt>
							<dd>
								{String((commission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commission = resolvedEntity.commission}
					{#if commission !== undefined && commission !== null}
						<div>
							<dt>Commission</dt>
							<dd>
								{String((commission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delinquent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delinquent = pendingEntity.delinquent}
					{#if delinquent !== undefined && delinquent !== null}
						<div>
							<dt>Delinquent</dt>
							<dd>
								{delinquent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delinquent = resolvedEntity.delinquent}
					{#if delinquent !== undefined && delinquent !== null}
						<div>
							<dt>Delinquent</dt>
							<dd>
								{delinquent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>
	{/snippet}
</EntityView>
