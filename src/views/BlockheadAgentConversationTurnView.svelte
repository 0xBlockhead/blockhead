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
			'status',
			'createdAt',
			'providerId',
		],
		content: {
			dl: [
				[
					'status',
					'createdAt',
					'providerId',
					'promptVersion',
					'parentId',
					'$acpPromptTurn',
					'$a2aTaskEvent',
					'$$providerCalls',
					'error',
				],
			],
			blocks: [
				[
					'userPrompt',
					'assistantText',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Prompt',
					items: [
						'userPrompt',
					],
				},
				{
					label: 'Response',
					items: [
						'assistantText',
					],
				},
				{
					label: 'Provider calls',
					items: [
						'$$providerCalls',
					],
				},
				{
					label: 'Protocol refs',
					items: [
						'$acpPromptTurn',
						'$a2aTaskEvent',
					],
				},
				{
					label: 'Branching',
					items: [
						'parentId',
						{
							slot: 'BranchContext',
							label: 'Parent/child transcript context',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConversationTurn>
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
	entityType={EntityType.BlockheadAgentConversationTurn}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
