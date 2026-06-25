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
		'turnId',
		'stopReason',
	],
	content: {
		dl: [
			[
				'$session',
				'turnId',
				{
					label: 'started/completed/cancelled at',
				},
			],
			[
				'stopReason',
				{
					label: 'message/tool/file/permission refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Messages',
				items: [
					{
						label: 'AcpMessage list',
					},
				],
			},
			{
				label: 'Tool calls',
				items: [
					{
						label: 'AcpToolCall list',
					},
				],
			},
			{
				label: 'File operations',
				items: [
					{
						label: 'AcpFileOperation list',
					},
				],
			},
			{
				label: 'Permission requests',
				items: [
					{
						label: 'AcpPermissionRequest list',
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
			id: 'messages',
			label: 'messages',
			field: '$$messages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'tool-calls',
			label: 'tool calls',
			field: '$$toolCalls',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'file-operations',
			label: 'file operations',
			field: '$$fileOperations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'permission-requests',
			label: 'permission requests',
			field: '$$permissionRequests',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpPromptTurn>
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
	entityType={EntityType.AcpPromptTurn}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
