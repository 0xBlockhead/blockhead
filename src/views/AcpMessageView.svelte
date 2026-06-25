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
		'$session',
		'messageId',
		'role',
	],
	content: {
		dl: [
			[
				'$session',
				'messageId',
				'role',
				'createdAt',
			],
			[
				{
					label: 'part refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parts',
				items: [
					{
						label: 'AcpMessagePart list',
					},
				],
			},
			{
				label: 'Session',
				items: [
					{
						label: 'AcpSession',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'parts',
			label: 'parts',
			field: '$$parts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AcpMessage>
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
	entityType={EntityType.AcpMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
