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
			label: 'network',
		},
		{
			label: 'log entry id',
		},
		{
			label: 'sequence number',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'log entry id',
				},
				{
					label: 'sequence number',
				},
				'commitment',
				{
					label: 'data blob',
				},
				{
					label: 'consensus network',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Data blob',
				items: [
					{
						label: 'linked data-root blob',
					},
				],
			},
			{
				label: 'Consensus',
				items: [
					{
						label: 'linked consensus-network identity',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent 0G network',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageLogEntry>
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
	entityType={EntityType.ZeroGStorageLogEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
