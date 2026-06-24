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
			'scope',
		],
		content: {
			dl: [
				[
					'scope',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'source window networks',
					when: 'open',
					items: [
						'$$sourceWindowNetworks',
					],
				},
				{
					label: 'source window blocks',
					when: 'open',
					items: [
						'$$sourceWindowBlocks',
					],
				},
				{
					label: 'source window transactions',
					when: 'open',
					items: [
						'$$sourceWindowTransactions',
					],
				},
				{
					label: 'source window resources',
					when: 'open',
					items: [
						'$$sourceWindowResources',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalArweaveNetwork>
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
	entityType={EntityType._GlobalArweaveNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
