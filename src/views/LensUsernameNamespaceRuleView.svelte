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
	}: EntitySelectionViewProps<EntityType.LensUsernameNamespaceRule> = $props()

	const lensUsernameNamespaceRule = $derived(selection({
		fields: {
			ruleType: true,
			requirement: true,
			address: true,
		},
	}))
	const titleFallback = $derived((prefetched.ruleType ?? '') || 'Lens username namespace rule')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensUsernameNamespaceView from '$/views/LensUsernameNamespaceView.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsernameNamespaceRule}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]/(lensUsernameNamespace)/rule/[ruleId=stringSegment]',
				{
					address: selection.entitySelector.$namespace.address,
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
		<ResourceBoundary resource={lensUsernameNamespaceRule}>
			{#snippet children(entity)}
				{entity.ruleType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensUsernameNamespaceRule}>
			{#snippet children(entity)}
				{[entity.requirement, entity.address].filter(Boolean).join(' ') || entity.ruleType || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<LensUsernameNamespaceView
						selection={select(EntityType.LensUsernameNamespace, selection.entitySelector.$namespace)}
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
						resource={lensUsernameNamespaceRule}
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
						resource={lensUsernameNamespaceRule}
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
						resource={lensUsernameNamespaceRule}
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
						resource={selection.executesOn}
					>
						{#snippet children(executesOn)}
							{executesOn.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Configuration kinds</dt>
				<dd>
					<ResourceBoundary
						resource={selection.configurationKinds}
					>
						{#snippet children(configurationKinds)}
							{configurationKinds.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
