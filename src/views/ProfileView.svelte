<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId: farcasterUserId,
		href = resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
			userId: String(farcasterUserId.fid),
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterUser>
			href?: string
			open?: boolean
		},
		never
	> = $props()

	const farcasterUser = useEntity(entityCollectionsContext, EntityType.FarcasterUser,
		farcasterUserId,
		({ sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			], fields: { username: true, displayName: true, $icon: true, bio: true, url: true, $primaryEvmAccount: true, $$verifiedAddresses: true } }),
	)


	// (Derived)
	const farcasterUserRow = $derived(
		farcasterUser.ready ? farcasterUser.current : undefined,
	)


	// Components
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entityId={farcasterUserId}
	href={href}
	bind:open
	title="Profile"
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.fields.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.fields.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(farcasterUserId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{farcasterUser.fields.displayName
					?? farcasterUser.fields.username
					?? String(farcasterUserId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.fields.username !== undefined
					&& farcasterUser.fields.username !== (
						farcasterUser.fields.displayName
						?? farcasterUser.fields.username
						?? String(farcasterUserId.fid)
					)
				)}
					<span data-text="muted">
						@{farcasterUser.fields.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.fields.bio != null && farcasterUser.fields.bio !== ''}
					<p>
						<TruncatedValue
							value={farcasterUser.fields.bio}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">

			{#if farcasterUserRow?.fields.url != null}
				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								<a
									href={farcasterUser.fields.url}
									data-text="muted"
								>{farcasterUser.fields.url}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if farcasterUserRow?.fields.$primaryEvmAccount != null}
				<div>
					<dt>Primary EVM account</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.fields.$primaryEvmAccount != null}
									<EvmAccountView
										entityId={farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Id]}
										href={resolve('/account/[address]', {
											address: farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Verified addresses</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterUser}
						placeholderText="Loading profile…"
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser.fields.$$verifiedAddresses?.values.length}
									<ul data-column="gap-2">
										{#each farcasterUser.fields.$$verifiedAddresses.values as verification (String(verification[EntityMetaKey.Id].protocol) + ':' + verification[EntityMetaKey.Id].address)}
											<li>
												{#if verification.$evmAccount}
													<EvmAccountView
														entityId={verification.$evmAccount[EntityMetaKey.Id]}
														href={resolve('/account/[address]', {
															address: verification.$evmAccount[EntityMetaKey.Id].address,
														})}
														layout={EntityLayout.Title}
														open={false}
													/>
												{:else if verification.$solanaAccount}
													<SolanaAccountView
														entityId={verification.$solanaAccount[EntityMetaKey.Id]}
														layout={EntityLayout.Title}
														open={false}
													/>
												{:else}
													<span data-text="mono muted">
														{verification[EntityMetaKey.Id].protocol}:{verification[EntityMetaKey.Id].address}
													</span>
												{/if}
											</li>
									{/each}
								</ul>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if (
				open
				&& farcasterUserRow?.fields.displayName != null
			)}
				<div>
					<dt>Display name</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.fields.displayName}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& farcasterUserRow?.fields.username != null
			)}
				<div>
					<dt>Username</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.fields.username}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}

	{/snippet}
</EntityView>
