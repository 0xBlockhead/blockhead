<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuToken> = $props()

	const blockheadCashuToken = $derived(selection({
		fields: {
			status: true,
			totalAmount: true,
			unit: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuToken}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.id || 'blockhead Cashu token')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.id || 'blockhead Cashu token'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuToken}>
			{#snippet children(entity)}
				{entity.status}
				{@const totalAmount = entity.totalAmount}
				{#if totalAmount != null}
					<NumberValue
						value={totalAmount}
					/>

					<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>token version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tokenVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.tokenVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadCashuToken}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadCashuToken}
			>
				{#snippet children(entity)}
					{@const unit = entity.unit}
					{#if unit != null}
						<div>
							<dt>unit</dt>
							<dd>
								{unit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mintUrl = entity.mintUrl}
					{#if mintUrl != null}
						<div>
							<dt>mint URL</dt>
							<dd>
								<a
									href={mintUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={mintUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$mint}
			>
				{#snippet children(cashuMint)}
					{#if cashuMint != null}
						<div>
							<dt>mint</dt>
							<dd>
								<CashuMintView
									selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
									prefetched={cashuMint}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofCount = entity.proofCount}
					{#if proofCount != null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue
									value={proofCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadCashuToken}
			>
				{#snippet children(entity)}
					{@const totalAmount = entity.totalAmount}
					{#if totalAmount != null}
						<div>
							<dt>total amount</dt>
							<dd>
								<NumberValue
									value={totalAmount}
								/>

								<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>imported AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									importedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.importedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							redeemedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const redeemedAt = entity.redeemedAt}
					{#if redeemedAt != null}
						<div>
							<dt>redeemed AT</dt>
							<dd>
								<Timestamp timestamp={redeemedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						encodedToken: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const encodedToken = entity.encodedToken}
				{#if encodedToken != null && encodedToken !== ''}
					<code>{encodedToken}</code>
				{:else}
					<p data-text="muted">No encoded token available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const proofsResource = selection.$$proofs}
		<ResourceBoundary
			resource={proofsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuProofsView
						selection={proofsResource}
						countResource={proofsResource.count}
						title='proofs'
						id='proofs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
