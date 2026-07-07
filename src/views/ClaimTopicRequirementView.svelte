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
			selection: EntityProxyResource<typeof schema, EntityType.ClaimTopicRequirement>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ClaimTopicRequirement>>
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
	const claimTopicRequirement = $derived(selection({}))
	const titleFallback = $derived('claim topic requirement')
	const viewDomId = $derived('claim-topic-requirement-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.ClaimTopicRequirement}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={claimTopicRequirement}>
			{#snippet Pending()}
				{title || 'claim topic requirement'}
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
				<dt>topic key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									topicKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const topicKey = selection.entitySelector.topicKey ?? prefetched.topicKey}
							{#if topicKey !== undefined && topicKey !== null}
								{String((topicKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const topicKey = resolvedEntity.topicKey}
							{#if topicKey !== undefined && topicKey !== null}
								{String((topicKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimTopic: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const claimTopic = prefetched.claimTopic}
					{#if claimTopic !== undefined && claimTopic !== null}
						<div>
							<dt>claim topic</dt>
							<dd>
								{String((claimTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const claimTopic = resolvedEntity.claimTopic}
					{#if claimTopic !== undefined && claimTopic !== null}
						<div>
							<dt>claim topic</dt>
							<dd>
								{String((claimTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							countryScope: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const countryScope = prefetched.countryScope}
					{#if countryScope !== undefined && countryScope !== null}
						<div>
							<dt>country scope</dt>
							<dd>
								{String((countryScope) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const countryScope = resolvedEntity.countryScope}
					{#if countryScope !== undefined && countryScope !== null}
						<div>
							<dt>country scope</dt>
							<dd>
								{String((countryScope) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
