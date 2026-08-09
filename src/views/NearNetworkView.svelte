<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NearNetwork> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearNetwork = $derived(viewSelection({
		fields: {
			name: true,
			environment: true,
			namespace: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), selection.entitySelector.slug].filter(Boolean).join(' ') || 'near network')
	const viewDomId = $derived('near-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/near/[slug=networkSlug]',
				{
					slug: selection.entitySelector.slug,
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
		<ResourceBoundary resource={nearNetwork}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), selection.entitySelector.slug].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearNetwork}>
			{#snippet children(entity)}
				{entity.environment || [(entity.name ?? ''), selection.entitySelector.slug].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearNetwork}>
			{#snippet children(entity)}
				{@const namespace = entity.namespace}
				{#if namespace != null}
					<span data-text="muted">
						{namespace}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>RPC endpoints</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.rpcEndpoints.values.map((value) => value.url).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-near-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'near-chain-observations',
						label: 'Observations',
					},
					{
						id: 'near-chain-blocks',
						label: 'Blocks',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNearChainObservations({ id, label })}
				<NearNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNearChainBlocks({ id, label })}
				<NearBlocksView
					selection={
						selection
						.$$blocks({
							sources: [
								Source.NearBlocks_Rest,
								Source.NearRpc_JsonRpc,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-near-validators'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'near-validator-list',
						label: 'Validators',
					},
				]
			}
			data-card
			class='network-view-collapsible-validators'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Validators</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNearValidatorList({ id, label })}
				<NearValidatorsView
					selection={selection.$$validators}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
