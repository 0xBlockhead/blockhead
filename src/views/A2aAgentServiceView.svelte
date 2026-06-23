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
				label: 'card',
			},
			{
				label: 'protocol binding',
			},
			{
				label: 'endpoint',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'card',
					},
					{
						label: 'protocol binding',
					},
					{
						label: 'endpoint URL',
					},
				],
				[
					{
						label: 'transport kind',
					},
					{
						label: 'auth kind',
					},
					{
						label: 'task refs',
					},
					{
						label: 'latest health',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Tasks',
					items: [
						{
							label: 'A2aTask list',
						},
					],
				},
				{
					label: 'Health',
					items: [
						{
							label: 'A2aAgentService_Timestamp list',
						},
					],
				},
				{
					label: 'Card',
					items: [
						{
							label: 'A2aAgentCard',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentService>
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
	entityType={EntityType.A2aAgentService}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
