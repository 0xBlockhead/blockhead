<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadWallet> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWallet = $derived(viewSelection({
		fields: {
			name: true,
			protocol: true,
			discoveryKind: true,
			transportKind: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'blockhead wallet')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import WalletConnectionMethodView from '$/views/WalletConnectionMethodView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWallet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/wallet/[id=stringSegment]',
				{
					id: selection.entitySelector.id,
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
		<ResourceBoundary resource={blockheadWallet}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWallet}>
			{#snippet children(entity)}
				{entity.protocol || entity.name || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWallet}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>protocol</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWallet}
					>
						{#snippet children(entity)}
							{entity.protocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>discovery kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWallet}
					>
						{#snippet children(entity)}
							{entity.discoveryKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWallet}
					>
						{#snippet children(entity)}
							{entity.transportKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>connection method</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$connectionMethod}
					>
						{#snippet children(walletConnectionMethod)}
							{@const walletConnectionMethodInitial = untrack(() => walletConnectionMethod)}
							<WalletConnectionMethodView
								selection={select(EntityType.WalletConnectionMethod, (walletConnectionMethod ?? walletConnectionMethodInitial)[EntityMetaKey.Selector])}
								prefetched={walletConnectionMethod ?? walletConnectionMethodInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>icon</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									icon: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.icon}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rdns: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rdns = entity.rdns}
					{#if rdns != null}
						<div>
							<dt>rdns</dt>
							<dd>
								{rdns}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>capabilities</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									capabilities: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.capabilities.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
