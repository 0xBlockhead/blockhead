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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotValidator_Era>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotValidator_Era>>
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
		fields: {
			active: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.eraIndex ?? prefetched.eraIndex) ?? '')].filter(Boolean).join(' ') || 'polkadot validator era')
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
		<ResourceBoundary resource={polkadotValidatorEra}>
			{#snippet Pending()}
				{[String((selection.entitySelector.eraIndex ?? prefetched.eraIndex) ?? '')].filter(Boolean).join(' ') || title || 'polkadot validator era'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotValidatorEra}>
			{#snippet Pending()}
				{[String((prefetched.active) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.eraIndex ?? prefetched.eraIndex) ?? '')].filter(Boolean).join(' ') || title || 'polkadot validator era'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.active) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.eraIndex) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotValidatorEra}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<PolkadotValidatorView
						selection={select(EntityType.PolkadotValidator, selection.entitySelector.$validator)}
						href={
							(selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.caip2 !== undefined && selection.entitySelector.$validator.$network.caip2.namespace !== undefined && selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.caip2 !== undefined && selection.entitySelector.$validator.$network.caip2.reference !== undefined && selection.entitySelector.$validator.stashAccountId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/validator/[stashAccountId]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$validator.$network.caip2.namespace) + ':' + String(selection.entitySelector.$validator.$network.caip2.reference))].slug ?? ''),
								stashAccountId: String(selection.entitySelector.$validator.stashAccountId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
								fields: {
									eraIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eraIndex = selection.entitySelector.eraIndex ?? prefetched.eraIndex}
							{#if eraIndex !== undefined && eraIndex !== null}
								{String((eraIndex) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.PolkadotAccount, false>('$controller')}
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
										(({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network !== undefined && ({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network.caip2 !== undefined && ({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network.caip2.namespace !== undefined && ({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network !== undefined && ({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network.caip2 !== undefined && ({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network.caip2.reference !== undefined && ({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).accountId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
											networkSlug: String(networkByCaip2[String(String(({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network.caip2.namespace) + ':' + String(({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).$network.caip2.reference))].slug ?? ''),
											accountId: String(({ ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }).accountId ?? ''),
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = prefetched.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							slashed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slashed = prefetched.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>slashed</dt>
							<dd>
								{slashed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							commissionPerBillion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commissionPerBillion = prefetched.commissionPerBillion}
					{#if commissionPerBillion !== undefined && commissionPerBillion !== null}
						<div>
							<dt>commission per billion</dt>
							<dd>
								{String((commissionPerBillion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							totalStakePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalStakePlancks = prefetched.totalStakePlancks}
					{#if totalStakePlancks !== undefined && totalStakePlancks !== null}
						<div>
							<dt>total stake plancks</dt>
							<dd>
								{String((totalStakePlancks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							ownStakePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownStakePlancks = prefetched.ownStakePlancks}
					{#if ownStakePlancks !== undefined && ownStakePlancks !== null}
						<div>
							<dt>own stake plancks</dt>
							<dd>
								{String((ownStakePlancks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							nominatorStakePlancks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nominatorStakePlancks = prefetched.nominatorStakePlancks}
					{#if nominatorStakePlancks !== undefined && nominatorStakePlancks !== null}
						<div>
							<dt>nominator stake plancks</dt>
							<dd>
								{String((nominatorStakePlancks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							nominatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nominatorCount = prefetched.nominatorCount}
					{#if nominatorCount !== undefined && nominatorCount !== null}
						<div>
							<dt>nominator count</dt>
							<dd>
								{String((nominatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							rewardPoints: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rewardPoints = prefetched.rewardPoints}
					{#if rewardPoints !== undefined && rewardPoints !== null}
						<div>
							<dt>reward points</dt>
							<dd>
								{String((rewardPoints) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
