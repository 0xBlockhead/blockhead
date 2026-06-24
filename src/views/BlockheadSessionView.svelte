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
			id: 'lock-session',
			label: 'Lock session',
			kind: 'createLocal',
			slot: 'LockSessionAction',
		},
		{
			id: 'delete-session',
			label: 'Delete session',
			kind: 'deleteLocal',
			slot: 'DeleteSessionAction',
		},
	],
	forms: [
		{
			id: 'create-action',
			label: 'Create action',
			kind: 'createLocal',
			fields: [
				{
					name: 'actionType',
					label: 'Action type',
					kind: 'select',
				},
				{
					name: 'params',
					label: 'Parameters',
					kind: 'textarea',
				},
			],
			slot: 'CreateSessionActionForm',
		},
	],
	closed: [
		{
			label: 'id/name',
		},
		'status',
		{
			label: 'created/updated/locked timestamps',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'id/name',
				},
				'status',
				{
					label: 'created/updated/locked timestamps',
				},
				{
					label: 'simulation count',
				},
				{
					label: 'latest simulation when linked',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Actions',
				items: [
					{
						label: 'ordered BlockheadSessionAction list',
					},
				],
			},
			{
				label: 'Invocations',
				items: [
					{
						label: 'accepted or recorded BlockheadIntentInvocation rows',
					},
				],
			},
			{
				label: 'Simulations',
				items: [
					{
						label: 'BlockheadSessionSimulation list',
					},
				],
			},
			{
				label: 'Intents',
				items: [
					{
						label: 'typed swap/bridge/transfer intent rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSession>
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
	entityType={EntityType.BlockheadSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
