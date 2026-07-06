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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotAccount_Timestamp>>
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
	const polkadotAccountTimestamp = $derived(selection({
		fields: {
			freeBalancePlancks: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'Polkadot account timestamp')
	const viewDomId = $derived('polkadot-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$account !== undefined && pendingEntity.$account.$network !== undefined && pendingEntity.$account.$network.caip2 !== undefined && pendingEntity.$account.$network.caip2.namespace !== undefined && pendingEntity.$account !== undefined && pendingEntity.$account.$network !== undefined && pendingEntity.$account.$network.caip2 !== undefined && pendingEntity.$account.$network.caip2.reference !== undefined && pendingEntity.$account !== undefined && pendingEntity.$account.accountId !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]/observation/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$account.$network.caip2.namespace) + ':' + String(pendingEntity.$account.$network.caip2.reference))].slug ?? ''),
			accountId: String(pendingEntity.$account.accountId ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotAccountTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot account timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotAccountTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot account timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotAccountTimestamp}>
			{#snippet Pending()}
				{@const nonce0 = prefetched.nonce}
				{#if nonce0 !== undefined && nonce0 !== null}
					<span data-text="muted">
						{String((nonce0) ?? '')}
					</span>
				{/if}
				{@const timestampMs1 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs1 !== undefined && timestampMs1 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs1)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const nonce0 = resolvedEntity.nonce}
				{#if nonce0 !== undefined && nonce0 !== null}
					<span data-text="muted">
						{String((nonce0) ?? '')}
					</span>
				{/if}
				{@const timestampMs1 = resolvedEntity.timestampMs}
				{#if timestampMs1 !== undefined && timestampMs1 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs1)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
								{String((nonce) ?? '')}
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
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freeBalancePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freeBalancePlancks = prefetched.freeBalancePlancks}
					{#if freeBalancePlancks !== undefined && freeBalancePlancks !== null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								{String((freeBalancePlancks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeBalancePlancks = resolvedEntity.freeBalancePlancks}
					{#if freeBalancePlancks !== undefined && freeBalancePlancks !== null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								{String((freeBalancePlancks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<PolkadotAccountView
						selection={select(EntityType.PolkadotAccount, selection.entitySelector.$account)}
						href={
							(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.namespace !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.reference !== undefined && selection.entitySelector.$account.accountId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$account.$network.caip2.namespace) + ':' + String(selection.entitySelector.$account.$network.caip2.reference))].slug ?? ''),
								accountId: String(selection.entitySelector.$account.accountId ?? ''),
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
