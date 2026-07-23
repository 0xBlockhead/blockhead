<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyResource<EntityType.EnsReverseRecord>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EnsReverseRecord>
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
	const ensReverseRecord = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'ENS reverse record'
	const viewDomId = $derived('ens-reverse-record-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$name') && prefetched.$name != null && Object.hasOwn(prefetched, '$account') && prefetched.$account != null}
			{@const ensName0 = pendingEntity.$name}
			{#if ensName0 != null && selection.entitySelector.$name != null}
				<EnsNameView
					selection={select(EntityType.EnsName, selection.entitySelector.$name, { sources: selection.sources })}
					prefetched={ensName0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={ensReverseRecord}>
				{#snippet children(entity)}
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$name') && prefetched.$name != null && Object.hasOwn(prefetched, '$account') && prefetched.$account != null}
			{@const account0 = pendingEntity.$account}
			{#if account0 != null && selection.entitySelector.$account != null}
				<AccountView
					selection={select(EntityType.Account, selection.entitySelector.$account, { sources: selection.sources })}
					prefetched={account0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={ensReverseRecord}>
				{#snippet children(entity)}
					<AccountView
						selection={select(EntityType.Account, selection.entitySelector.$account)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<AccountView
						selection={select(EntityType.Account, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href={
							(
								selection.entitySelector.$name != null && 'name' in selection.entitySelector.$name
								&& selection.entitySelector.$name.name != null ?
									resolve('/ens/name/[ensName=stringSegment]', {
								ensName: encodeURIComponent(String(selection.entitySelector.$name.name ?? '')),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const ensReverseRecordEnsReverseRecordTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={ensReverseRecordEnsReverseRecordTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<EnsReverseRecord_TimestampsView
					selection={ensReverseRecordEnsReverseRecordTimestampsViewTimestampsResource}
					countResource={ensReverseRecordEnsReverseRecordTimestampsViewTimestampsResource.count}
					title='Timestamps'
					id='EnsReverseRecord_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
