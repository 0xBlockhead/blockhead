<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CelestiaBlobOccurrence>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)
	const namespace = $derived(selection.entitySelector.$namespace)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CelestiaBlockView from '$/views/CelestiaBlockView.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
	import CelestiaBlobView from '$/views/CelestiaBlobView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaBlobOccurrence}
	entitySelector={selection.entitySelector}
	title={title ?? `Blob occurrence #${selection.entitySelector.index}`}
	idDragPlainText={String(selection.entitySelector.index)}
	href={
		href === undefined ?
			(
				block !== undefined
				&& block.height !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/block-height/[height=nonNegativeBigInt]/(celestiaBlock)/occurrence/[index=nonNegativeInteger]',
						{
							network: (
								block.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(block.$network.$network.caip2)
								:
									block.$network.$network.slug
							),
							height: String(block.height),
							index: String(selection.entitySelector.index),
						}
					)
				:
					selection.entitySelector.height !== undefined
					&& namespace !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/occurrence/[height=nonNegativeBigInt]/[index=nonNegativeInteger]',
							{
								network: (
									namespace.$network.$network.caip2 !== undefined ?
										caip2StringFromValue(namespace.$network.$network.caip2)
									:
										namespace.$network.$network.slug
								),
								namespaceId: namespace.namespaceId,
								height: String(selection.entitySelector.height),
								index: String(selection.entitySelector.index),
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Blob occurrence </span>
			<span data-badge="small">
				#{selection.entitySelector.index}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.index}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(celestiaBlock)}
				{@const celestiaBlockInitial = untrack(() => celestiaBlock)}
				<span data-text="muted">
					<CelestiaBlockView
						selection={select(EntityType.CelestiaBlock, (celestiaBlock ?? celestiaBlockInitial)[EntityMetaKey.Selector])}
						prefetched={celestiaBlock ?? celestiaBlockInitial}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(celestiaBlock)}
							{@const celestiaBlockInitial = untrack(() => celestiaBlock)}
							<CelestiaBlockView
								selection={select(EntityType.CelestiaBlock, (celestiaBlock ?? celestiaBlockInitial)[EntityMetaKey.Selector])}
								prefetched={celestiaBlock ?? celestiaBlockInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>EDS share index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.index}
					/>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$namespace}
					>
						{#snippet children(celestiaNamespace)}
							{@const celestiaNamespaceInitial = untrack(() => celestiaNamespace)}
							<CelestiaNamespaceView
								selection={select(EntityType.CelestiaNamespace, (celestiaNamespace ?? celestiaNamespaceInitial)[EntityMetaKey.Selector])}
								prefetched={celestiaNamespace ?? celestiaNamespaceInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.height}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>blob content</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$blob}
					>
						{#snippet children(celestiaBlob)}
							<CelestiaBlobView
								selection={select(EntityType.CelestiaBlob, celestiaBlob[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
