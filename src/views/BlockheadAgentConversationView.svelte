<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	actions: [
		{
			id: 'pin-conversation',
			label: 'Pin conversation',
			kind: 'createLocal',
			slot: 'PinConversationAction',
		},
		{
			id: 'delete-conversation',
			label: 'Delete conversation',
			kind: 'deleteLocal',
			slot: 'DeleteConversationAction',
		},
	],
	forms: [
		{
			id: 'new-turn',
			label: 'New turn',
			kind: 'createLocal',
			fields: [
				{
					name: 'prompt',
					label: 'Prompt',
					kind: 'textarea',
				},
			],
			slot: 'CreateConversationTurnForm',
		},
	],
	closed: [
		'name',
		'id',
		'pinned',
		{
			slot: 'LastActivity',
			label: 'Last activity',
		},
	],
	content: {
		dl: [
			[
				'name',
				'id',
				'pinned',
				'createdAt',
				'updatedAt',
				'defaultConnectionId',
				'defaultModelId',
				'$profile',
				'$acpSession',
				'$a2aTask',
			],
			[
				'systemPrompt',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Turns',
				items: [
					'$$turns',
				],
			},
			{
				label: 'Preferences',
				items: [
					'defaultConnectionId',
					'defaultModelId',
				],
			},
			{
				label: 'Protocol refs',
				items: [
					'$acpSession',
					'$a2aTask',
				],
			},
			{
				label: 'Profile',
				items: [
					'$profile',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConversation>
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
	entityType={EntityType.BlockheadAgentConversation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
