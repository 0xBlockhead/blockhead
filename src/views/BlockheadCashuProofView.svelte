<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuProof> = $props()

	const blockheadCashuProof = $derived(selection({
		fields: {
			amount: true,
			unit: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCashuProof_TimestampsView from '$/views/BlockheadCashuProof_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuProof}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.secretHash || 'blockhead Cashu proof')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.secretHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuProof}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amount}
				/>

				<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					{selection.entitySelector.walletId}
				</dd>
			</div>

			<div>
				<dt>mint</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(cashuMint)}
							<CashuMintView
								selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
								prefetched={cashuMint}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>mint URL</dt>
				<dd>
					<a
						href={selection.entitySelector.mintUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.mintUrl} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$keyset}
			>
				{#snippet children(cashuKeyset)}
					{#if cashuKeyset != null}
						<div>
							<dt>keyset</dt>
							<dd>
								<CashuKeysetView
									selection={select(EntityType.CashuKeyset, cashuKeyset[EntityMetaKey.Selector])}
									prefetched={cashuKeyset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>keyset ID</dt>
				<dd>
					{selection.entitySelector.keysetId}
				</dd>
			</div>

			<div>
				<dt>secret hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.secretHash} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>amount</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadCashuProof}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amount}
							/>

							<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signature = entity.signature}
					{#if signature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={signature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dleqJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dleqJson = entity.dleqJson}
					{#if dleqJson != null}
						<div>
							<dt>dleq JSON</dt>
							<dd>
								{dleqJson}
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
							receivedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedAt = entity.receivedAt}
					{#if receivedAt != null}
						<div>
							<dt>received AT</dt>
							<dd>
								<Timestamp timestamp={receivedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceTokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceTokenId = entity.sourceTokenId}
					{#if sourceTokenId != null}
						<div>
							<dt>source token ID</dt>
							<dd>
								{sourceTokenId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuProof_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
