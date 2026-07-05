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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadPayjoinSession>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadPayjoinSession>>
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
	const blockheadPayjoinSession = $derived(selection({
		fields: {
			status: true,
			role: true,
			amountSats: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || 'blockhead payjoin session')
	const viewDomId = $derived('blockhead-payjoin-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoNetworkView from '$/views/UtxoNetworkView.svelte'
	import PayjoinDirectoryView from '$/views/PayjoinDirectoryView.svelte'
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPayjoinSession}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadPayjoinSession}>
			{#snippet Pending()}
				{[String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead payjoin session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadPayjoinSession}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((prefetched.role) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead payjoin session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.role) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadPayjoinSession}>
			{#snippet Pending()}
				{@const amountSats0 = prefetched.amountSats}
				{#if amountSats0 !== undefined && amountSats0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountSats0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amountSats0 = resolvedEntity.amountSats}
				{#if amountSats0 !== undefined && amountSats0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountSats0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sessionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sessionId = selection.entitySelector.sessionId ?? prefetched.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sessionId = resolvedEntity.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>role</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									role: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const role = prefetched.role}
							{#if role !== undefined && role !== null}
								{String((role) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const role = resolvedEntity.role}
							{#if role !== undefined && role !== null}
								{String((role) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
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
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.UtxoNetwork, false>('$network')}
					>
						{#snippet children(utxoNetwork)}
							{#if utxoNetwork[EntityMetaKey.Selector] != null}
								<UtxoNetworkView
									selection={select(EntityType.UtxoNetwork, utxoNetwork[EntityMetaKey.Selector])}
									prefetched={utxoNetwork}
									href={
										(({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network !== undefined && ({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network.caip2 !== undefined && ({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network.caip2.namespace !== undefined && ({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network !== undefined && ({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network.caip2 !== undefined && ({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
											networkSlug: String(networkByCaip2[String(String(({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network.caip2.namespace) + ':' + String(({ ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }).$network.caip2.reference))].slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PayjoinDirectory, false>('$directory')}
			>
				{#snippet children(payjoinDirectory)}
					{#if payjoinDirectory != null && payjoinDirectory[EntityMetaKey.Selector] != null}
						<div>
							<dt>directory</dt>
							<dd>
								<PayjoinDirectoryView
									selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
									prefetched={payjoinDirectory}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PayjoinEndpoint, false>('$endpoint')}
			>
				{#snippet children(payjoinEndpoint)}
					{#if payjoinEndpoint != null && payjoinEndpoint[EntityMetaKey.Selector] != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<PayjoinEndpointView
									selection={select(EntityType.PayjoinEndpoint, payjoinEndpoint[EntityMetaKey.Selector])}
									prefetched={payjoinEndpoint}
									layout={EntityLayout.Title}
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
						fields: {
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endpointUrl = prefetched.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpointUrl = resolvedEntity.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bip21Uri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bip21Uri = prefetched.bip21Uri}
					{#if bip21Uri !== undefined && bip21Uri !== null}
						<div>
							<dt>bip21 URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bip21Uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bip21Uri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bip21Uri = resolvedEntity.bip21Uri}
					{#if bip21Uri !== undefined && bip21Uri !== null}
						<div>
							<dt>bip21 URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bip21Uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bip21Uri)} />
								</svelte:element>
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
							receiverAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receiverAddress = prefetched.receiverAddress}
					{#if receiverAddress !== undefined && receiverAddress !== null}
						<div>
							<dt>receiver address</dt>
							<dd>
								<TruncatedValue value={String((receiverAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receiverAddress = resolvedEntity.receiverAddress}
					{#if receiverAddress !== undefined && receiverAddress !== null}
						<div>
							<dt>receiver address</dt>
							<dd>
								<TruncatedValue value={String((receiverAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							<dt>amount sats</dt>
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
							<dt>amount sats</dt>
							<dd>
								<NumberValue value={Number(amountSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							disableOutputSubstitution: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const disableOutputSubstitution = prefetched.disableOutputSubstitution}
					{#if disableOutputSubstitution !== undefined && disableOutputSubstitution !== null}
						<div>
							<dt>disable output substitution</dt>
							<dd>
								{disableOutputSubstitution ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const disableOutputSubstitution = resolvedEntity.disableOutputSubstitution}
					{#if disableOutputSubstitution !== undefined && disableOutputSubstitution !== null}
						<div>
							<dt>disable output substitution</dt>
							<dd>
								{disableOutputSubstitution ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minFeeRateSatPerVbyte: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const minFeeRateSatPerVbyte = prefetched.minFeeRateSatPerVbyte}
					{#if minFeeRateSatPerVbyte !== undefined && minFeeRateSatPerVbyte !== null}
						<div>
							<dt>min fee rate sat per vbyte</dt>
							<dd>
								<NumberValue value={Number(minFeeRateSatPerVbyte)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minFeeRateSatPerVbyte = resolvedEntity.minFeeRateSatPerVbyte}
					{#if minFeeRateSatPerVbyte !== undefined && minFeeRateSatPerVbyte !== null}
						<div>
							<dt>min fee rate sat per vbyte</dt>
							<dd>
								<NumberValue value={Number(minFeeRateSatPerVbyte)} />
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
							additionalFeeOutputIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const additionalFeeOutputIndex = prefetched.additionalFeeOutputIndex}
					{#if additionalFeeOutputIndex !== undefined && additionalFeeOutputIndex !== null}
						<div>
							<dt>additional fee output index</dt>
							<dd>
								<NumberValue value={Number(additionalFeeOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const additionalFeeOutputIndex = resolvedEntity.additionalFeeOutputIndex}
					{#if additionalFeeOutputIndex !== undefined && additionalFeeOutputIndex !== null}
						<div>
							<dt>additional fee output index</dt>
							<dd>
								<NumberValue value={Number(additionalFeeOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxAdditionalFeeContributionSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxAdditionalFeeContributionSats = prefetched.maxAdditionalFeeContributionSats}
					{#if maxAdditionalFeeContributionSats !== undefined && maxAdditionalFeeContributionSats !== null}
						<div>
							<dt>max additional fee contribution sats</dt>
							<dd>
								<NumberValue value={Number(maxAdditionalFeeContributionSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxAdditionalFeeContributionSats = resolvedEntity.maxAdditionalFeeContributionSats}
					{#if maxAdditionalFeeContributionSats !== undefined && maxAdditionalFeeContributionSats !== null}
						<div>
							<dt>max additional fee contribution sats</dt>
							<dd>
								<NumberValue value={Number(maxAdditionalFeeContributionSats)} />
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
							originalPsbtHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const originalPsbtHash = prefetched.originalPsbtHash}
					{#if originalPsbtHash !== undefined && originalPsbtHash !== null}
						<div>
							<dt>original psbt hash</dt>
							<dd>
								<TruncatedValue value={String((originalPsbtHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const originalPsbtHash = resolvedEntity.originalPsbtHash}
					{#if originalPsbtHash !== undefined && originalPsbtHash !== null}
						<div>
							<dt>original psbt hash</dt>
							<dd>
								<TruncatedValue value={String((originalPsbtHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proposalPsbtHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proposalPsbtHash = prefetched.proposalPsbtHash}
					{#if proposalPsbtHash !== undefined && proposalPsbtHash !== null}
						<div>
							<dt>proposal psbt hash</dt>
							<dd>
								<TruncatedValue value={String((proposalPsbtHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proposalPsbtHash = resolvedEntity.proposalPsbtHash}
					{#if proposalPsbtHash !== undefined && proposalPsbtHash !== null}
						<div>
							<dt>proposal psbt hash</dt>
							<dd>
								<TruncatedValue value={String((proposalPsbtHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalTransactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const finalTransactionId = prefetched.finalTransactionId}
					{#if finalTransactionId !== undefined && finalTransactionId !== null}
						<div>
							<dt>final transaction ID</dt>
							<dd>
								<TruncatedValue value={String((finalTransactionId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalTransactionId = resolvedEntity.finalTransactionId}
					{#if finalTransactionId !== undefined && finalTransactionId !== null}
						<div>
							<dt>final transaction ID</dt>
							<dd>
								<TruncatedValue value={String((finalTransactionId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.UtxoTransaction, false>('$finalTransaction')}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null && utxoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>final transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									href={
										(({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network !== undefined && ({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network.caip2 !== undefined && ({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network.caip2.namespace !== undefined && ({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network !== undefined && ({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network.caip2 !== undefined && ({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network.caip2.reference !== undefined && ({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
											networkSlug: String(networkByCaip2[String(String(({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network.caip2.namespace) + ':' + String(({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).$network.caip2.reference))].slug ?? ''),
											txId: String(({ ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }).txId ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
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
							errorCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const errorCode = prefetched.errorCode}
					{#if errorCode !== undefined && errorCode !== null}
						<div>
							<dt>error code</dt>
							<dd>
								{String((errorCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const errorCode = resolvedEntity.errorCode}
					{#if errorCode !== undefined && errorCode !== null}
						<div>
							<dt>error code</dt>
							<dd>
								{String((errorCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = prefetched.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const completedAt = prefetched.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
