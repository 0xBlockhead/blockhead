<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'topic',
			'peerInboxId',
			'id',
		],
		content: {
			dl: [
				[
					'consentState',
					'peerInboxId',
					'topic',
					'createdAtMs',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							slot: 'XmtpNetwork',
							label: 'XMTP network',
						},
					],
				},
				{
					label: 'Messages',
					items: [
						{
							slot: 'Messages',
							label: 'XMTP messages when a live/local message source exists',
						},
					],
				},
				{
					label: 'Participants',
					items: [
						{
							slot: 'Participants',
							label: 'Inbox identities and installations when modeled',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XmtpConversation>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.XmtpConversation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
