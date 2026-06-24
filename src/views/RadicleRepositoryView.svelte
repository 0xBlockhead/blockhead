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
			'rid',
		],
		content: {
			dl: [
				[
					'rid',
					'name',
					'description',
					'visibility',
					'defaultBranch',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'delegates',
					when: 'open',
					items: [
						'$$delegates',
					],
				},
				{
					label: 'signed refs',
					when: 'open',
					items: [
						'$$signedRefs',
					],
				},
				{
					label: 'issues',
					when: 'open',
					items: [
						'$$issues',
					],
				},
				{
					label: 'patches',
					when: 'open',
					items: [
						'$$patches',
					],
				},
				{
					label: 'seed observations',
					when: 'open',
					items: [
						'$$seedObservations',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleRepository>
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
	entityType={EntityType.RadicleRepository}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
