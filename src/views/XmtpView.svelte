<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	const entityId = {
		scope: 'XmtpNetwork' as const,
	}

	const networkIdKey = stringify(entityId)

	const network = useEntity(
		EntityType.XmtpNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
		},
	)

	const registry = useEntity(
		EntityType._Global,
		{},
		{
			$: [Source.Local_Internal],
			$$actors: {},
			$$xmtpConversations: {},
		},
	)

	let open = $bindable(true)


	// Components
	import ActorsView from '$/views/ActorsView.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpNetwork}
	{entityId}
	href={resolve('/(social)/xmtp')}
	bind:open
	title="XMTP"
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<ResourceBoundary resource={registry}>
				{#snippet children(g)}
					<div>
						<dt>Accounts</dt>
						<dd>{String(g['$$actors'].length)}</dd>
					</div>
					<div>
						<dt>Conversations</dt>
						<dd>{String(g['$$xmtpConversations'].length)}</dd>
					</div>
				{/snippet}
			</ResourceBoundary>
			{#if open}
				<ResourceBoundary resource={network}>
					{#snippet children(loaded)}
						<div>
							<dt>Protocol name</dt>
							<dd>{loaded.protocolName}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={loaded.homeUrl}>
									{loaded.homeUrl}
								</a>
							</dd>
						</div>
						{#if loaded.docsUrl != null}
							{#if loaded.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={loaded.docsUrl}>
											{loaded.docsUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XmtpNetwork}
			{entityId}
		/>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Local network state
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Accounts">
						<ActorsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$actors',
							}}
							href={resolve('/(social)/(xmtp)/xmtp/accounts')}
							id={`${networkIdKey}:accounts`}
							open={false}
							title="Accounts"
						/>
					</section>

					<section data-scroll-marker-label="Conversations">
						<XmtpConversationsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$xmtpConversations',
							}}
							href={resolve('/(social)/(xmtp)/xmtp/conversations')}
							id={`${networkIdKey}:conversations`}
							open={false}
						/>
					</section>
				</div>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
