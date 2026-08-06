<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.XmtpParticipant>, 'prefetched'> = $props()


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpParticipant}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.inboxId || 'XMTP participant')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.inboxId} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.inboxId} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Conversation</dt>
				<dd>
					<XmtpConversationView
						selection={select(EntityType.XmtpConversation, selection.entitySelector.$conversation)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Inbox ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.inboxId} />
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
