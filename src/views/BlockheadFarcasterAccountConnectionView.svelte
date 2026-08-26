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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadFarcasterAccountConnection>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadFarcasterAccountConnection = $derived(viewSelection({
		fields: {
			authMethod: true,
			selected: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selection.entitySelector}
	title={title ?? 'Verified Farcaster connection'}
	href={
		href === undefined ?
			resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/account/[connectionId=stringSegment]',
				{
					connectionId: selection.entitySelector.connectionId,
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
		<ResourceBoundary
			resource={selection.$user}
		>
			{#snippet children(farcasterUser)}
				{@const farcasterUserInitial = untrack(() => farcasterUser)}
				<FarcasterUserView
					selection={select(EntityType.FarcasterUser, (farcasterUser ?? farcasterUserInitial)[EntityMetaKey.Selector])}
					prefetched={farcasterUser ?? farcasterUserInitial}
					href={null}
					layout={EntityLayout.Value}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadFarcasterAccountConnection}>
			{#snippet children(entity)}
				{@const authMethod = entity.authMethod}
				{#if authMethod != null}
					<span data-text="muted">
						{authMethod}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Farcaster user</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$user}
					>
						{#snippet children(farcasterUser)}
							{@const farcasterUserInitial = untrack(() => farcasterUser)}
							<FarcasterUserView
								selection={select(EntityType.FarcasterUser, (farcasterUser ?? farcasterUserInitial)[EntityMetaKey.Selector])}
								prefetched={farcasterUser ?? farcasterUserInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Verified signer</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									signerAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signerAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadFarcasterAccountConnection}
			>
				{#snippet children(entity)}
					{@const authMethod = entity.authMethod}
					{#if authMethod != null}
						<div>
							<dt>Auth method</dt>
							<dd>
								{authMethod}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Verified</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									verifiedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.verifiedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Expires</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									expiresAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.expiresAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Association fingerprint</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									associationFingerprint: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.associationFingerprint} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Selected viewer</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadFarcasterAccountConnection}
					>
						{#snippet children(entity)}
							{entity.selected ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
