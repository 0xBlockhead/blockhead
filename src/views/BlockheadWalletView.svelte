<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadWallet> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived((pendingEntity.name ?? '') || 'blockhead wallet')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import WalletConnectionMethodView from '$/views/WalletConnectionMethodView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWallet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{pendingEntity.id}
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

			<ResourceBoundary
				resource={selection.$connectionMethod}
			>
				{#snippet children(walletConnectionMethod)}
					{#if walletConnectionMethod != null}
						<div>
							<dt>connection method</dt>
							<dd>
								<WalletConnectionMethodView
									selection={select(EntityType.WalletConnectionMethod, walletConnectionMethod[EntityMetaKey.Selector])}
									prefetched={walletConnectionMethod}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							websiteUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const websiteUrl = entity.websiteUrl}
					{#if websiteUrl != null}
						<div>
							<dt>website URL</dt>
							<dd>
								<a
									href={String(websiteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(websiteUrl)} />
								</a>
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							adapterId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const adapterId = entity.adapterId}
					{#if adapterId != null}
						<div>
							<dt>adapter ID</dt>
							<dd>
								{adapterId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceWalletKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceWalletKey = entity.sourceWalletKey}
					{#if sourceWalletKey != null}
						<div>
							<dt>source wallet key</dt>
							<dd>
								{sourceWalletKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							detectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const detectedAt = entity.detectedAt}
					{#if detectedAt != null}
						<div>
							<dt>detected AT</dt>
							<dd>
								<Timestamp timestamp={Number(detectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
