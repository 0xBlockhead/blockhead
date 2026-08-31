<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensUsernameNamespace> = $props()

	const lensUsernameNamespace = $derived(selection({
		fields: {
			namespace: true,
			tokenName: true,
			totalUsernames: true,
		},
	}))
	const titleFallback = $derived([(prefetched.namespace ?? ''), (prefetched.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensUsernameNamespaceRulesView from '$/views/LensUsernameNamespaceRulesView.svelte'
	import LensUsernamesView from '$/views/LensUsernamesView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsernameNamespace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]',
				{
					address: selection.entitySelector.address,
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
		<ResourceBoundary resource={lensUsernameNamespace}>
			{#snippet children(entity)}
				{[entity.namespace, (entity.tokenName ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensUsernameNamespace}>
			{#snippet children(entity)}
				{@const totalUsernames = entity.totalUsernames}
				{#if totalUsernames != null}
					<span data-text="muted">
						{totalUsernames}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={lensUsernameNamespace}
					>
						{#snippet children(entity)}
							{entity.namespace}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={lensUsernameNamespace}
			>
				{#snippet children(entity)}
					{@const tokenName = entity.tokenName}
					{#if tokenName != null}
						<div>
							<dt>Token name</dt>
							<dd>
								{tokenName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenSymbol = entity.tokenSymbol}
					{#if tokenSymbol != null}
						<div>
							<dt>Token symbol</dt>
							<dd>
								{tokenSymbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lensUsernameNamespace}
			>
				{#snippet children(entity)}
					{@const totalUsernames = entity.totalUsernames}
					{#if totalUsernames != null}
						<div>
							<dt>Total usernames</dt>
							<dd>
								{totalUsernames}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Owner account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
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
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const rulesResource = selection.$$rules}
		<ResourceBoundary
			resource={rulesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensUsernameNamespaceRulesView
						selection={rulesResource}
						countResource={rulesResource.count}
						title='Rules'
						id='rules'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const usernamesResource = selection.$$usernames}
		<ResourceBoundary
			resource={usernamesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensUsernamesView
						selection={usernamesResource}
						countResource={usernamesResource.count}
						title='Usernames'
						id='usernames'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
