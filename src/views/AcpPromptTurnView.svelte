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
			{
				label: 'session',
			},
			{
				label: 'turn id',
			},
			{
				label: 'stop reason',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'session',
					},
					{
						label: 'turn id',
					},
					{
						label: 'started/completed/cancelled at',
					},
				],
				[
					{
						label: 'stop reason',
					},
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
