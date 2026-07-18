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
			selection: RegisteredEntityProxyResource<EntityType.SolanaValidator_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SolanaValidator_Timestamp>>
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
	const solanaValidatorTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			delinquent: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.slot) ?? '')].filter(Boolean).join(' ') || 'solana validator timestamp')
	const viewDomId = $derived('solana-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaValidator_Timestamp}
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
					{@const slot0 = pendingEntity.slot}
					{#if slot0 !== undefined && slot0 !== null}
						<NumberValue
							value={slot0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={solanaValidatorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot0 = resolvedEntity.slot}
					{#if slot0 !== undefined && slot0 !== null}
						<NumberValue
							value={slot0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.delinquent) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.slot) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={solanaValidatorTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.delinquent) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.slot) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaValidatorTimestamp}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Validator</dt>
				<dd>
					<SolanaValidatorView
						selection={select(EntityType.SolanaValidator, selection.entitySelector.$validator, {})}
						href={
							(selection.entitySelector.$validator.votePubkey !== undefined && selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
								validatorId: String(selection.entitySelector.$validator.votePubkey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$validator.$network.caip2) ?? ''),
							}) : selection.entitySelector.$validator.votePubkey !== undefined && selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
								validatorId: String(selection.entitySelector.$validator.votePubkey ?? ''),
								network: String(selection.entitySelector.$validator.$network.slug ?? ''),
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							nodePubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodePubkey = resolvedEntity.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>Node public key</dt>
							<dd>
								{String((nodePubkey) ?? '')}
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
							activatedStakeLamports: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							commission: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							lastVoteSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastVoteSlot = resolvedEntity.lastVoteSlot}
					{#if lastVoteSlot !== undefined && lastVoteSlot !== null}
						<div>
							<dt>Last vote slot</dt>
							<dd>
								{String((lastVoteSlot) ?? '')}
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
							rootSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rootSlot = resolvedEntity.rootSlot}
					{#if rootSlot !== undefined && rootSlot !== null}
						<div>
							<dt>Root slot</dt>
							<dd>
								{String((rootSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
