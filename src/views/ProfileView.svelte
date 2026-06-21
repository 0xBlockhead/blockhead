<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(`/farcaster/user/${String(selection.entitySelector.fid)}`),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterUser>
			href?: string
			open?: boolean
	},
		never
	> = $props()

	const farcasterUser = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
		],
		fields: {
			username: true,
			displayName: true,
			$icon: {
				sources: [
					Source.Snapchain_Rest,
				],
			},
			bio: true,
			url: true,
			$primaryEvmAccount: true,
			$$verifiedAddresses: true,
		},
	}))

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
	entitySelector={selection.entitySelector}
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
				{#if farcasterUser.fields.$icon?.[EntityMetaKey.Selector].url !== undefined}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.fields.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(selection.entitySelector.fid)}
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
					?? String(selection.entitySelector.fid)}
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
						?? String(selection.entitySelector.fid)
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

			<ResourceBoundary
				resource={farcasterUser}
				placeholderText="Loading profile…"
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser.fields.url != null}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={farcasterUser.fields.url}
									rel="noreferrer noopener"
									target="_blank"
									data-text="muted"
								>{farcasterUser.fields.url}</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={farcasterUser}
				placeholderText="Loading profile…"
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser.fields.$primaryEvmAccount != null}
						<div>
							<dt>Primary EVM account</dt>
							<dd>
										<EvmAccountView
											selection={select(EntityType.EvmAccount, farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Selector])}
											href={resolve(`/account/${farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Selector].address}`)}
											layout={EntityLayout.Title}

									/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
										{#each farcasterUser.fields.$$verifiedAddresses.values as verification (String(verification[EntityMetaKey.Selector].protocol) + ':' + verification[EntityMetaKey.Selector].address)}
											<li>
												{#if verification.$evmAccount}
														<EvmAccountView
															selection={select(EntityType.EvmAccount, verification.$evmAccount[EntityMetaKey.Selector])}
															href={resolve(`/account/${verification[EntityMetaKey.Selector].address}`)}
															layout={EntityLayout.Title}

													/>
												{:else if verification.$solanaAccount}
													<SolanaAccountView
														selection={select(EntityType.SolanaAccount, verification.$solanaAccount[EntityMetaKey.Selector])}
														layout={EntityLayout.Title}

													/>
												{:else}
													<span data-text="mono muted">
														{verification[EntityMetaKey.Selector].protocol}:{verification[EntityMetaKey.Selector].address}
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

			<ResourceBoundary
				resource={farcasterUser}
				placeholderText="Loading profile…"
			>
				{#snippet children(farcasterUser)}
					{#if open && farcasterUser.fields.displayName != null}
						<div>
							<dt>Display name</dt>
							<dd>
								{farcasterUser.fields.displayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={farcasterUser}
				placeholderText="Loading profile…"
			>
				{#snippet children(farcasterUser)}
					{#if open && farcasterUser.fields.username != null}
						<div>
							<dt>Username</dt>
							<dd>
								{farcasterUser.fields.username}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

		</dl>
	{/snippet}

</EntityView>
