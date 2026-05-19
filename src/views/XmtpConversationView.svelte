<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.XmtpConversation>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const conversation = useEntity(
		EntityType.XmtpConversation,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	{entityId}
	{href}
	{open}
	title={titleProp ?? 'Conversation'}
	{...entityViewRest}
>
	{#snippet Heading()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Thread id in XMTP labels a double‑ratchet conversation between provisioned wallet identities.
				</p>
				<p>
					Ciphertext and session state live off-chain; explorers cannot reconstruct transcripts from calldata alone.
				</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: _contentOpen,
	})}
		<dl data-column-item="center">
			<div>
				<dt>Conversation id</dt>
				<dd>
					<TruncatedValue
						value={entityId.id}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.XmtpConversation}
				{entityId}
			>
				<ResourceBoundary
					resource={conversation}
					placeholderText="Loading conversation…"
				>
					{#snippet children()}
						<div data-text="muted">
							Encrypted conversation metadata is not available yet.
						</div>
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>

