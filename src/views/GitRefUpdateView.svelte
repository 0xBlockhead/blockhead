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
		'$repository',
		'refName',
		'oldObjectId',
	],
	content: {
		dl: [
			[
				'$repository',
				'refName',
				'oldObjectId',
				'newObjectId',
				'updateKind',
			],
			[
				'actorSelector',
				'timestampMs',
				'$signature',
				'source',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ref',
				items: [
					{
						label: 'affected Git ref',
					},
				],
			},
			{
				label: 'Old target',
				items: [
					{
						label: 'old target Git object',
					},
				],
			},
			{
				label: 'New target',
				items: [
					{
						label: 'new target Git object',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'signature/audit/reflog payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRefUpdate>
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
	entityType={EntityType.GitRefUpdate}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
