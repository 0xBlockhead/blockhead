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
		'$task',
		'configId',
		'url',
	],
	content: {
		dl: [
			[
				'$task',
				'configId',
				'url',
			],
			[
				'authKind',
				{
					label: 'created/deleted at',
				},
				'status',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Task',
				items: [
					{
						label: 'A2aTask',
					},
				],
			},
			{
				label: 'Delivery',
				items: [
					{
						label: 'URL/auth/status',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aPushNotificationConfig>
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
	entityType={EntityType.A2aPushNotificationConfig}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
