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
			selection: EntityProxyResource<typeof schema, EntityType.EnsReverseRecord>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EnsReverseRecord>>
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
	const ensReverseRecord = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = $derived('ENS reverse record')
	const viewDomId = $derived('ens-reverse-record-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EnsReverseRecord_TimestampsView from '$/views/EnsReverseRecord_TimestampsView.svelte'
	import AccountView from '$/views/AccountView.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsReverseRecord}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ensReverseRecord}>
			{#snippet Pending()}
				<EnsNameView
					selection={select(EntityType.EnsName, selection.entitySelector.$name)}
					href={
						(selection.entitySelector.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
							ensName: String(selection.entitySelector.$name.name ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EnsNameView
					selection={select(EntityType.EnsName, selection.entitySelector.$name)}
					href={
						(selection.entitySelector.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
							ensName: String(selection.entitySelector.$name.name ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ensReverseRecord}>
			{#snippet Pending()}
				<AccountView
					selection={select(EntityType.Account, selection.entitySelector.$account)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AccountView
					selection={select(EntityType.Account, selection.entitySelector.$account)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<AccountView
						selection={select(EntityType.Account, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name, {})}
						href={
							(selection.entitySelector.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
								ensName: String(selection.entitySelector.$name.name ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EnsReverseRecord_TimestampsView
				selection={selection.$$timestamps}
				title='Timestamps'
				emptyText='No ENS reverse record observations.'
				id='EnsReverseRecord_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
