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
			selection: RegisteredEntityProxyResource<EntityType.BeaconWithdrawal>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BeaconWithdrawal>>
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
	const beaconWithdrawal = $derived(selection({
		sources: selection.sources,
		fields: {
			amountGwei: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInSlot) ?? '') ? 'Withdrawal #' + String((pendingEntity.indexInSlot) ?? '') : '') || 'beacon withdrawal')
	const viewDomId = $derived('beacon-withdrawal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconWithdrawal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInSlot ?? '')}
	href={
		href ?? (pendingEntity.slot !== undefined && pendingEntity.indexInSlot !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
			slot: String(pendingEntity.slot ?? ''),
			index: String(pendingEntity.indexInSlot ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.slot !== undefined && pendingEntity.indexInSlot !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
			slot: String(pendingEntity.slot ?? ''),
			index: String(pendingEntity.indexInSlot ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.indexInSlot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Withdrawal </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const amountGwei0 = pendingEntity.amountGwei}
					{#if amountGwei0 !== undefined && amountGwei0 !== null}
						<NumberValue
							value={amountGwei0}
						/>

						<span> gwei</span>
					{/if}
		{:else}
			<ResourceBoundary resource={beaconWithdrawal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountGwei0 = resolvedEntity.amountGwei}
					{#if amountGwei0 !== undefined && amountGwei0 !== null}
						<NumberValue
							value={amountGwei0}
						/>

						<span> gwei</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const slot0 = pendingEntity.slot}
			{#if slot0 !== undefined && slot0 !== null}
				<span data-text="muted">
					<span>Slot </span>
					<NumberValue
						value={slot0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={beaconWithdrawal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot0 = resolvedEntity.slot}
					{#if slot0 !== undefined && slot0 !== null}
						<span data-text="muted">
							<span>Slot </span>
							<NumberValue
								value={slot0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInSlot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInSlot = resolvedEntity.indexInSlot}
							{#if indexInSlot !== undefined && indexInSlot !== null}
								<NumberValue
									value={indexInSlot}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									slot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slot = resolvedEntity.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue
									value={slot}
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
							validatorIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validatorIndex = resolvedEntity.validatorIndex}
					{#if validatorIndex !== undefined && validatorIndex !== null}
						<div>
							<dt>Validator index</dt>
							<dd>
								<NumberValue
									value={validatorIndex}
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
							amountGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountGwei = resolvedEntity.amountGwei}
					{#if amountGwei !== undefined && amountGwei !== null}
						<div>
							<dt>Amount</dt>
							<dd>
								<NumberValue
									value={amountGwei}
								/>

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$validator}
			>
				{#snippet children(beaconValidator)}
					{#if beaconValidator != null && beaconValidator[EntityMetaKey.Selector] != null}
						<div>
							<dt>Validator</dt>
							<dd>
								<BeaconValidatorView
									selection={select(EntityType.BeaconValidator, beaconValidator[EntityMetaKey.Selector])}
									prefetched={beaconValidator}
									href={
										(beaconValidator[EntityMetaKey.Selector].indexInNetwork !== undefined && beaconValidator[EntityMetaKey.Selector].$network !== undefined && beaconValidator[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
											validatorId: String(beaconValidator[EntityMetaKey.Selector].indexInNetwork ?? ''),
											network: String(caip2StringFromValue(beaconValidator[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : beaconValidator[EntityMetaKey.Selector].indexInNetwork !== undefined && beaconValidator[EntityMetaKey.Selector].$network !== undefined && beaconValidator[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
											validatorId: String(beaconValidator[EntityMetaKey.Selector].indexInNetwork ?? ''),
											network: String(beaconValidator[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$account}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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
