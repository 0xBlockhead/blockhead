<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ArweaveManifestPath>, 'prefetched'> = $props()

	const manifest = $derived(selection.entitySelector.$manifest)
	const arweaveManifestPath = $derived(selection({
		fields: {
			targetTransactionId: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveManifestPath}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.path || 'Arweave manifest path')}
	href={
		href === undefined ?
			resolve(
				'/(arweave)/arweave/manifest-path/[transactionId=stringSegment]/[contentPath=stringSegment]/[path=stringSegment]',
				{
					transactionId: manifest.transactionId,
					contentPath: manifest.contentPath,
					path: selection.entitySelector.path,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={arweaveManifestPath}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.targetTransactionId} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>manifest</dt>
				<dd>
					<ArweaveResourceView
						selection={select(EntityType.ArweaveResource, selection.entitySelector.$manifest)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					{selection.entitySelector.path}
				</dd>
			</div>

			<div>
				<dt>target transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={arweaveManifestPath}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.targetTransactionId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>target resource</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$resource}
					>
						{#snippet children(arweaveResource)}
							{@const arweaveResourceInitial = untrack(() => arweaveResource)}
							<ArweaveResourceView
								selection={select(EntityType.ArweaveResource, (arweaveResource ?? arweaveResourceInitial)[EntityMetaKey.Selector])}
								prefetched={arweaveResource ?? arweaveResourceInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
