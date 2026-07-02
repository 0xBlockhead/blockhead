<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.Network>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Network>>
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

	const network = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			namespace: true,
			environment: true,
			$icon: true,
			$$nativeAssets: true,
			$$blockExplorerUrls: true,
			$$faucetUrls: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [selection.entitySelector.caip2 == null ? '' : String((`${(selection.entitySelector.caip2).namespace}:${(selection.entitySelector.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network')
	const viewDomId = $derived('network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (({ ...selection.entitySelector, ...prefetched })?.caip2 != null && ({ ...selection.entitySelector, ...prefetched })?.caip2?.namespace != null && ({ ...selection.entitySelector, ...prefetched })?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
		}) : ({ ...selection.entitySelector, ...prefetched })?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).slug),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [selection.entitySelector.caip2 == null ? '' : String((`${(selection.entitySelector.caip2).namespace}:${(selection.entitySelector.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network'}
		{:else}
			<ResourceBoundary resource={network}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [selection.entitySelector.caip2 == null ? '' : String((`${(selection.entitySelector.caip2).namespace}:${(selection.entitySelector.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const caip20 = ({ ...selection.entitySelector, ...prefetched }).caip2}
			{#if caip20 !== undefined && caip20 !== null}
				<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={network}>
				{#snippet Pending()}
					{@const caip20 = ({ ...selection.entitySelector, ...prefetched }).caip2}
					{#if caip20 !== undefined && caip20 !== null}
						<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const caip20 = ({ ...selection.entitySelector, ...prefetched, ...entity }).caip2}
					{#if caip20 !== undefined && caip20 !== null}
						<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A blockchain, ledger, or protocol network with its own identity and supporting metadata.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary resource={network}>
						{#snippet Pending()}
							{@const namespace = prefetched.namespace ?? selection.entitySelector.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const namespace = entity.namespace ?? selection.entitySelector.namespace ?? prefetched.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Environment</dt>
				<dd>
					<ResourceBoundary resource={network}>
						{#snippet Pending()}
							{@const environment = prefetched.environment ?? selection.entitySelector.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const environment = entity.environment ?? selection.entitySelector.environment ?? prefetched.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<Network_TimestampsView
				selection={selection[EntityProxyField]<EntityType.Network_Timestamp>('$$timestamps')}
				title='Observations'
				id='Network_TimestampsView-$$timestamps'
			/>

			<AssetInstancesView
				selection={selection[EntityProxyField]<EntityType.AssetInstance>('$$nativeAssets')}
				title='Native assets'
				id='AssetInstancesView-$$nativeAssets'
			/>

			<UrlsView
				selection={selection[EntityProxyField]<EntityType.Url>('$$blockExplorerUrls')}
				title='Block explorer URLs'
				id='UrlsView-$$blockExplorerUrls'
			/>

			<UrlsView
				selection={selection[EntityProxyField]<EntityType.Url>('$$faucetUrls')}
				title='Faucet URLs'
				id='UrlsView-$$faucetUrls'
			/>
		{/if}
	{/snippet}
</EntityView>
