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
			'catalogId',
		],
		content: {
			dl: [
				[
					'catalogId',
					'label',
					'catalogKind',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'providers',
					when: 'open',
					items: [
						'$$providers',
					],
				},
				{
					label: 'catalog entries',
					when: 'open',
					items: [
						'$$catalogEntries',
					],
				},
				{
					label: 'models',
					when: 'open',
					items: [
						'$$models',
					],
				},
				{
					label: 'datasets',
					when: 'open',
					items: [
						'$$datasets',
					],
				},
				{
					label: 'benchmarks',
					when: 'open',
					items: [
						'$$benchmarks',
					],
				},
				{
					label: 'evaluations',
					when: 'open',
					items: [
						'$$evaluations',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiModelCatalog>
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
	entityType={EntityType._GlobalAiModelCatalog}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
