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
		'packHash',
		'objectFormat',
		'objectCount',
	],
	content: {
		dl: [
			[
				'packHash',
				'objectFormat',
				'objectCount',
				'packSizeBytes',
				'indexHash',
				'$repository',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Objects',
				items: [
					{
						label: 'packed-object storage observations',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'repository availability context',
					},
				],
			},
			{
				label: 'Fetches',
				items: [
					{
						label: 'fetch observations that captured the pack',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitPackfile>
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
	entityType={EntityType.GitPackfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
