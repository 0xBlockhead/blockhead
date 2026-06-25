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
		'operationId',
		'operationKind',
	],
	content: {
		dl: [
			[
				'$session',
				'operationId',
				'operationKind',
				'path',
			],
			[
				{
					label: 'line range',
				},
				{
					label: 'content hash algorithm/hash',
				},
				'timestampMs',
				'status',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Session',
				items: [
					{
						label: 'AcpSession',
					},
				],
			},
			{
				label: 'File access',
				items: [
					'path',
					{
						label: 'start/end line',
					},
					'status',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpFileOperation>
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
	entityType={EntityType.AcpFileOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
