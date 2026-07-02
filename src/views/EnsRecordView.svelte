<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsRecord>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EnsRecord>>
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

	const ensRecord = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			recordKind: true,
			coinType: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record')
	const viewDomId = $derived('ens-record-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsRecord}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).recordKey) ?? '')].filter(Boolean).join(' ') || title || 'ENS record'}
		{:else}
			<ResourceBoundary resource={ensRecord}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).recordKey) ?? '')].filter(Boolean).join(' ') || title || 'ENS record'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.recordKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EnsNameView
				selection={select(EntityType.EnsName, selection.entitySelector.$name)}
				href={
						resolve('/(explore)/(ens)/ens/name/[ensName]', {
							ensName: String(selection.entitySelector.$name.name),
						})
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={ensRecord}>
				{#snippet Pending()}
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href={
							resolve('/(explore)/(ens)/ens/name/[ensName]', {
								ensName: String(selection.entitySelector.$name.name),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href={
							resolve('/(explore)/(ens)/ens/name/[ensName]', {
								ensName: String(selection.entitySelector.$name.name),
							})
						}
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
				<dt>Record kind</dt>
				<dd>
					<ResourceBoundary resource={ensRecord}>
						{#snippet Pending()}
							{@const recordKind = prefetched.recordKind ?? selection.entitySelector.recordKind}
							{#if recordKind !== undefined && recordKind !== null}
								{String((recordKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const recordKind = entity.recordKind ?? selection.entitySelector.recordKind ?? prefetched.recordKind}
							{#if recordKind !== undefined && recordKind !== null}
								{String((recordKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={ensRecord}>
				{#snippet Pending()}
					{@const coinType = prefetched.coinType ?? selection.entitySelector.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>Coin type</dt>
							<dd>
								<NumberValue value={Number(coinType)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const coinType = entity.coinType ?? selection.entitySelector.coinType ?? prefetched.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>Coin type</dt>
							<dd>
								<NumberValue value={Number(coinType)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
