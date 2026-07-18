<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.TrustedIssuer>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TrustedIssuer>>
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
	const trustedIssuer = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('trusted issuer')
	const viewDomId = $derived('trusted-issuer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.TrustedIssuer}
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
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={trustedIssuer}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>profile</dt>
				<dd>
					<RegulatedAssetProfileView
						selection={select(EntityType.RegulatedAssetProfile, selection.entitySelector.$profile, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>issuer key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									issuerKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const issuerKey = resolvedEntity.issuerKey}
							{#if issuerKey !== undefined && issuerKey !== null}
								<TruncatedValue value={String((issuerKey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>claim topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									claimTopics: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const claimTopics = resolvedEntity.claimTopics}
							{#if claimTopics !== undefined && claimTopics !== null}
								{claimTopics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
