<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.MoneroRingMember>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.MoneroRingMember>
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
	const moneroRingMember = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			globalOutputIndex: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			globalOutputIndex: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.memberIndex) ?? '')].filter(Boolean).join(' ') || 'monero ring member')
	const viewDomId = $derived('monero-ring-member-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRingMember}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'globalOutputIndex')}
			{@const memberIndex0 = pendingEntity.memberIndex}
			{#if memberIndex0 !== undefined && memberIndex0 !== null}
				<NumberValue
					value={memberIndex0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={moneroRingMember}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memberIndex0 = resolvedEntity.memberIndex}
					{#if memberIndex0 !== undefined && memberIndex0 !== null}
						<NumberValue
							value={memberIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'globalOutputIndex')}
			{@const globalOutputIndex0 = pendingEntity.globalOutputIndex}
			{#if globalOutputIndex0 !== undefined && globalOutputIndex0 !== null}
				<NumberValue
					value={globalOutputIndex0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={moneroRingMember}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const globalOutputIndex0 = resolvedEntity.globalOutputIndex}
					{#if globalOutputIndex0 !== undefined && globalOutputIndex0 !== null}
						<NumberValue
							value={globalOutputIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Ring</dt>
				<dd>
					<MoneroRingView
						selection={select(EntityType.MoneroRing, selection.entitySelector.$ring)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Member index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									memberIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const memberIndex = resolvedEntity.memberIndex}
							{#if memberIndex !== undefined && memberIndex !== null}
								<NumberValue
									value={memberIndex}
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
							globalOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const globalOutputIndex = resolvedEntity.globalOutputIndex}
					{#if globalOutputIndex !== undefined && globalOutputIndex !== null}
						<div>
							<dt>Global output index</dt>
							<dd>
								<NumberValue
									value={globalOutputIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
