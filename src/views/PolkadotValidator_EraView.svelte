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
			selection: RegisteredEntityProxyResource<EntityType.PolkadotValidator_Era>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.PolkadotValidator_Era>>
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
	const polkadotValidatorEra = $derived(selection({
		sources: selection.sources,
		fields: {
			active: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || 'polkadot validator era')
	const viewDomId = $derived('polkadot-validator-era-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotValidator_Era}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotValidatorEra}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.active) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotValidatorEra}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.active) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotValidatorEra}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<PolkadotValidatorView
						selection={select(EntityType.PolkadotValidator, selection.entitySelector.$validator, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>era index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									eraIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eraIndex = resolvedEntity.eraIndex}
							{#if eraIndex !== undefined && eraIndex !== null}
								{String((eraIndex) ?? '')}
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
				resource={selection.$controller}
			>
				{#snippet children(polkadotAccount)}
					{#if polkadotAccount != null && polkadotAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>controller</dt>
							<dd>
								<PolkadotAccountView
									selection={select(EntityType.PolkadotAccount, polkadotAccount[EntityMetaKey.Selector])}
									prefetched={polkadotAccount}
									href={
										(polkadotAccount[EntityMetaKey.Selector].accountId !== undefined && polkadotAccount[EntityMetaKey.Selector].$network !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
											network: String(caip2StringFromValue(polkadotAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : polkadotAccount[EntityMetaKey.Selector].accountId !== undefined && polkadotAccount[EntityMetaKey.Selector].$network !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
											network: String(polkadotAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
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
							slashed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slashed = resolvedEntity.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>slashed</dt>
							<dd>
								{slashed ? 'Yes' : 'No'}
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
						sources: selection.sources,
						fields: {
							commissionPerBillion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commissionPerBillion = resolvedEntity.commissionPerBillion}
					{#if commissionPerBillion !== undefined && commissionPerBillion !== null}
						<div>
							<dt>commission per billion</dt>
							<dd>
								{String((commissionPerBillion) ?? '')}
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
							totalStakePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalStakePlancks = resolvedEntity.totalStakePlancks}
					{#if totalStakePlancks !== undefined && totalStakePlancks !== null}
						<div>
							<dt>total stake plancks</dt>
							<dd>
								{String((totalStakePlancks) ?? '')}
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
							ownStakePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownStakePlancks = resolvedEntity.ownStakePlancks}
					{#if ownStakePlancks !== undefined && ownStakePlancks !== null}
						<div>
							<dt>own stake plancks</dt>
							<dd>
								{String((ownStakePlancks) ?? '')}
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
							nominatorStakePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nominatorStakePlancks = resolvedEntity.nominatorStakePlancks}
					{#if nominatorStakePlancks !== undefined && nominatorStakePlancks !== null}
						<div>
							<dt>nominator stake plancks</dt>
							<dd>
								{String((nominatorStakePlancks) ?? '')}
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
							nominatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nominatorCount = resolvedEntity.nominatorCount}
					{#if nominatorCount !== undefined && nominatorCount !== null}
						<div>
							<dt>nominator count</dt>
							<dd>
								{String((nominatorCount) ?? '')}
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
							rewardPoints: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardPoints = resolvedEntity.rewardPoints}
					{#if rewardPoints !== undefined && rewardPoints !== null}
						<div>
							<dt>reward points</dt>
							<dd>
								{String((rewardPoints) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
