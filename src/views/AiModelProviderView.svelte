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
			'domain',
		],
		content: {
			dl: [
				[
					'domain',
					'providerId',
					'label',
					'organizationKind',
					'homepageUrl',
					'docsUrl',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'catalog entries',
					when: 'open',
					items: [
						'$$catalogEntries',
					],
				},
				{
					label: 'api operations',
					when: 'open',
					items: [
						'$$apiOperations',
					],
				},
				{
					label: 'models',
					when: 'open',
					items: [
						'$$models',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiModelProvider>
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
	entityType={EntityType.AiModelProvider}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
