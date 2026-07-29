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
	}: EntitySelectionViewProps<EntityType.SolanaAccount_Timestamp> = $props()

	const solanaAccountTimestamp = $derived(selection({
		fields: {
			lamports: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.slot)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaAccountTimestamp}>
			{#snippet children(entity)}
				{@const lamports = entity.lamports}
				{#if lamports != null}
					<NumberValue
						value={lamports}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaAccountTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<SolanaAccountView
						selection={select(EntityType.SolanaAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$ownerProgram}
			>
				{#snippet children(solanaProgram)}
					{#if solanaProgram != null}
						<div>
							<dt>Owner program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaProgram[EntityMetaKey.Selector])}
									prefetched={solanaProgram}
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
							executable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const executable = entity.executable}
					{#if executable != null}
						<div>
							<dt>Executable</dt>
							<dd>
								{executable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rentEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rentEpoch = entity.rentEpoch}
					{#if rentEpoch != null}
						<div>
							<dt>Rent epoch</dt>
							<dd>
								{rentEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spaceBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spaceBytes = entity.spaceBytes}
					{#if spaceBytes != null}
						<div>
							<dt>Space bytes</dt>
							<dd>
								{spaceBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataEncoding: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataEncoding = entity.dataEncoding}
					{#if dataEncoding != null}
						<div>
							<dt>Data encoding</dt>
							<dd>
								{dataEncoding}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
