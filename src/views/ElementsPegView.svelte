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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsPeg>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ElementsPeg>>
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
	const elementsPeg = $derived(selection({
		fields: {
			amountSats: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.direction ?? prefetched.direction) ?? ''), String((selection.entitySelector.pegTransactionId ?? prefetched.pegTransactionId) ?? '')].filter(Boolean).join(' ') || 'Elements peg')
	const viewDomId = $derived('elements-peg-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ElementsPeg_TimestampsView from '$/views/ElementsPeg_TimestampsView.svelte'
	import ElementsNetworkView from '$/views/ElementsNetworkView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsPeg}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={elementsPeg}>
			{#snippet Pending()}
				{[String((selection.entitySelector.direction ?? prefetched.direction) ?? ''), String((selection.entitySelector.pegTransactionId ?? prefetched.pegTransactionId) ?? '')].filter(Boolean).join(' ') || title || 'Elements peg'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.direction) ?? ''), String((resolvedEntity.pegTransactionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsPeg}>
			{#snippet Pending()}
				{@const amountSats0 = prefetched.amountSats}
				{#if amountSats0 !== undefined && amountSats0 !== null}
					<NumberValue value={Number(amountSats0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amountSats0 = resolvedEntity.amountSats}
				{#if amountSats0 !== undefined && amountSats0 !== null}
					<NumberValue value={Number(amountSats0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Direction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									direction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const direction = selection.entitySelector.direction ?? prefetched.direction}
							{#if direction !== undefined && direction !== null}
								{String((direction) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const direction = resolvedEntity.direction}
							{#if direction !== undefined && direction !== null}
								{String((direction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Peg transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pegTransactionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pegTransactionId = selection.entitySelector.pegTransactionId ?? prefetched.pegTransactionId}
							{#if pegTransactionId !== undefined && pegTransactionId !== null}
								<TruncatedValue value={String((pegTransactionId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pegTransactionId = resolvedEntity.pegTransactionId}
							{#if pegTransactionId !== undefined && pegTransactionId !== null}
								<TruncatedValue value={String((pegTransactionId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountSats = prefetched.amountSats}
					{#if amountSats !== undefined && amountSats !== null}
						<div>
							<dt>Amount sats</dt>
							<dd>
								<NumberValue value={Number(amountSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSats = resolvedEntity.amountSats}
					{#if amountSats !== undefined && amountSats !== null}
						<div>
							<dt>Amount sats</dt>
							<dd>
								<NumberValue value={Number(amountSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null && utxoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bitcoin transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									href={
										(utxoTransaction[EntityMetaKey.Selector].$network !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoTransaction[EntityMetaKey.Selector].$network !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2.reference !== undefined && utxoTransaction[EntityMetaKey.Selector].txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
											networkSlug: String(networkByCaip2[String(String(utxoTransaction[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoTransaction[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											txId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
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
				resource={selection.$elementsTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null && utxoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Elements transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									href={
										(utxoTransaction[EntityMetaKey.Selector].$network !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoTransaction[EntityMetaKey.Selector].$network !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoTransaction[EntityMetaKey.Selector].$network.caip2.reference !== undefined && utxoTransaction[EntityMetaKey.Selector].txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
											networkSlug: String(networkByCaip2[String(String(utxoTransaction[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoTransaction[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											txId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimScript: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const claimScript = prefetched.claimScript}
					{#if claimScript !== undefined && claimScript !== null}
						<div>
							<dt>Claim script</dt>
							<dd>
								<TruncatedValue value={String((claimScript) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const claimScript = resolvedEntity.claimScript}
					{#if claimScript !== undefined && claimScript !== null}
						<div>
							<dt>Claim script</dt>
							<dd>
								<TruncatedValue value={String((claimScript) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pakProof: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pakProof = prefetched.pakProof}
					{#if pakProof !== undefined && pakProof !== null}
						<div>
							<dt>PAK proof</dt>
							<dd>
								<TruncatedValue value={String((pakProof) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pakProof = resolvedEntity.pakProof}
					{#if pakProof !== undefined && pakProof !== null}
						<div>
							<dt>PAK proof</dt>
							<dd>
								<TruncatedValue value={String((pakProof) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ElementsPeg_TimestampsView
				selection={selection.$$timestamps}
				title='Observations'
				id='ElementsPeg_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
