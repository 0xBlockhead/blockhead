<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroRingMember>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MoneroRingMember>>
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
	const moneroRingMember = $derived(selection({
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
		fields: {
			globalOutputIndex: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.memberIndex ?? prefetched.memberIndex) ?? '')].filter(Boolean).join(' ') || 'monero ring member')
	const viewDomId = $derived('monero-ring-member-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={moneroRingMember}>
			{#snippet Pending()}
				{@const memberIndex0 = selection.entitySelector.memberIndex ?? prefetched.memberIndex}
				{#if memberIndex0 !== undefined && memberIndex0 !== null}
					<NumberValue value={Number(memberIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const memberIndex0 = resolvedEntity.memberIndex}
				{#if memberIndex0 !== undefined && memberIndex0 !== null}
					<NumberValue value={Number(memberIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroRingMember}>
			{#snippet Pending()}
				{@const globalOutputIndex0 = prefetched.globalOutputIndex}
				{#if globalOutputIndex0 !== undefined && globalOutputIndex0 !== null}
					<NumberValue value={Number(globalOutputIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const globalOutputIndex0 = resolvedEntity.globalOutputIndex}
				{#if globalOutputIndex0 !== undefined && globalOutputIndex0 !== null}
					<NumberValue value={Number(globalOutputIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
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
								fields: {
									memberIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const memberIndex = selection.entitySelector.memberIndex ?? prefetched.memberIndex}
							{#if memberIndex !== undefined && memberIndex !== null}
								<NumberValue value={Number(memberIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const memberIndex = resolvedEntity.memberIndex}
							{#if memberIndex !== undefined && memberIndex !== null}
								<NumberValue value={Number(memberIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							globalOutputIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const globalOutputIndex = prefetched.globalOutputIndex}
					{#if globalOutputIndex !== undefined && globalOutputIndex !== null}
						<div>
							<dt>Global output index</dt>
							<dd>
								<NumberValue value={Number(globalOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const globalOutputIndex = resolvedEntity.globalOutputIndex}
					{#if globalOutputIndex !== undefined && globalOutputIndex !== null}
						<div>
							<dt>Global output index</dt>
							<dd>
								<NumberValue value={Number(globalOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
