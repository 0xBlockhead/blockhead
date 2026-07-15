<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BlockheadWallet>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadWallet>>
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
	const blockheadWallet = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			protocol: true,
			discoveryKind: true,
			transportKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet')
	const viewDomId = $derived('blockhead-wallet-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import WalletConnectionMethodView from '$/views/WalletConnectionMethodView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWallet}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWallet}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWallet}>
			{#snippet Pending()}
				{[String((pendingEntity.protocol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.protocol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = pendingEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const name = pendingEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									protocol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const protocol = pendingEntity.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocol = resolvedEntity.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>discovery kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									discoveryKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const discoveryKind = pendingEntity.discoveryKind}
							{#if discoveryKind !== undefined && discoveryKind !== null}
								{String((discoveryKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const discoveryKind = resolvedEntity.discoveryKind}
							{#if discoveryKind !== undefined && discoveryKind !== null}
								{String((discoveryKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transportKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transportKind = pendingEntity.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transportKind = resolvedEntity.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connectionMethod}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(walletConnectionMethod)}
					{#if walletConnectionMethod != null && walletConnectionMethod[EntityMetaKey.Selector] != null}
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
							selection({
								fields: {
									icon: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const icon = pendingEntity.icon}
							{#if icon !== undefined && icon !== null}
								{String((icon) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const icon = resolvedEntity.icon}
							{#if icon !== undefined && icon !== null}
								{String((icon) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rdns: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rdns = pendingEntity.rdns}
					{#if rdns !== undefined && rdns !== null}
						<div>
							<dt>rdns</dt>
							<dd>
								{String((rdns) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rdns = resolvedEntity.rdns}
					{#if rdns !== undefined && rdns !== null}
						<div>
							<dt>rdns</dt>
							<dd>
								{String((rdns) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							websiteUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const websiteUrl = pendingEntity.websiteUrl}
					{#if websiteUrl !== undefined && websiteUrl !== null}
						<div>
							<dt>website URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(websiteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(websiteUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const websiteUrl = resolvedEntity.websiteUrl}
					{#if websiteUrl !== undefined && websiteUrl !== null}
						<div>
							<dt>website URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(websiteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(websiteUrl)} />
								</svelte:element>
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
							selection({
								fields: {
									capabilities: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const capabilities = pendingEntity.capabilities}
							{#if capabilities !== undefined && capabilities !== null}
								{capabilities == null ? '' : String(((capabilities).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const capabilities = resolvedEntity.capabilities}
							{#if capabilities !== undefined && capabilities !== null}
								{capabilities == null ? '' : String(((capabilities).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							adapterId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const adapterId = pendingEntity.adapterId}
					{#if adapterId !== undefined && adapterId !== null}
						<div>
							<dt>adapter ID</dt>
							<dd>
								{String((adapterId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const adapterId = resolvedEntity.adapterId}
					{#if adapterId !== undefined && adapterId !== null}
						<div>
							<dt>adapter ID</dt>
							<dd>
								{String((adapterId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWalletKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWalletKey = pendingEntity.sourceWalletKey}
					{#if sourceWalletKey !== undefined && sourceWalletKey !== null}
						<div>
							<dt>source wallet key</dt>
							<dd>
								{String((sourceWalletKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWalletKey = resolvedEntity.sourceWalletKey}
					{#if sourceWalletKey !== undefined && sourceWalletKey !== null}
						<div>
							<dt>source wallet key</dt>
							<dd>
								{String((sourceWalletKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							detectedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const detectedAt = pendingEntity.detectedAt}
					{#if detectedAt !== undefined && detectedAt !== null}
						<div>
							<dt>detected AT</dt>
							<dd>
								<Timestamp timestamp={Number(detectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const detectedAt = resolvedEntity.detectedAt}
					{#if detectedAt !== undefined && detectedAt !== null}
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
