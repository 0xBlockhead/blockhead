<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensFeedRule> = $props()

	const lensFeedRule = $derived(selection({
		fields: {
			ruleType: true,
			requirement: true,
			address: true,
		},
	}))
	const titleFallback = $derived((prefetched.ruleType ?? '') || 'Lens feed rule')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensFeedView from '$/views/LensFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.LensFeedRule}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]/(lensFeed)/rule/[ruleId=stringSegment]',
				{
					address: selection.entitySelector.$feed.address,
					ruleId: selection.entitySelector.ruleId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensFeedRule}>
			{#snippet children(entity)}
				{entity.ruleType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensFeedRule}>
			{#snippet children(entity)}
				{[entity.requirement, entity.address].filter(Boolean).join(' ') || entity.ruleType || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<LensFeedView
						selection={select(EntityType.LensFeed, selection.entitySelector.$feed)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Rule ID</dt>
				<dd>
					{selection.entitySelector.ruleId}
				</dd>
			</div>

			<div>
				<dt>Rule type</dt>
				<dd>
					<ResourceBoundary
						resource={lensFeedRule}
					>
						{#snippet children(entity)}
							{entity.ruleType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Requirement</dt>
				<dd>
					<ResourceBoundary
						resource={lensFeedRule}
					>
						{#snippet children(entity)}
							{entity.requirement}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Rule address</dt>
				<dd>
					<ResourceBoundary
						resource={lensFeedRule}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Executes on</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									executesOn: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.executesOn.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Configuration kinds</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									configurationKinds: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.configurationKinds.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
