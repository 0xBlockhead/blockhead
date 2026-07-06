<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HederaScheduleSignature>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaScheduleSignature>>
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
	const hederaScheduleSignature = $derived(selection({}))
	const titleFallback = $derived('hedera schedule signature')
	const viewDomId = $derived('hedera-schedule-signature-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaScheduleSignature}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaScheduleSignature}>
			{#snippet Pending()}
				{title || 'hedera schedule signature'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>schedule</dt>
				<dd>
					<HederaScheduleView
						selection={select(EntityType.HederaSchedule, selection.entitySelector.$schedule)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>public key prefix</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									publicKeyPrefix: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const publicKeyPrefix = selection.entitySelector.publicKeyPrefix ?? prefetched.publicKeyPrefix}
							{#if publicKeyPrefix !== undefined && publicKeyPrefix !== null}
								{String((publicKeyPrefix) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const publicKeyPrefix = resolvedEntity.publicKeyPrefix}
							{#if publicKeyPrefix !== undefined && publicKeyPrefix !== null}
								{String((publicKeyPrefix) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusTimestamp = prefetched.consensusTimestamp}
					{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{String((consensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusTimestamp = resolvedEntity.consensusTimestamp}
					{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{String((consensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signature: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signature = prefetched.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature = resolvedEntity.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HederaAccount, false>('$account')}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null && hederaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, hederaAccount[EntityMetaKey.Selector])}
									prefetched={hederaAccount}
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
</EntityView>
