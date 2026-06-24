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
			'serverKey',
		],
		content: {
			dl: [
				[
					'serverKey',
					'transportKind',
					'endpointUrl',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'tools',
					when: 'open',
					items: [
						'$$tools',
					],
				},
				{
					label: 'resources',
					when: 'open',
					items: [
						'$$resources',
					],
				},
				{
					label: 'resource templates',
					when: 'open',
					items: [
						'$$resourceTemplates',
					],
				},
				{
					label: 'prompts',
					when: 'open',
					items: [
						'$$prompts',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpServer>
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
	entityType={EntityType.McpServer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
