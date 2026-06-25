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
		'$selector',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$selector',
				'timestampMs',
				'source',
				'reachable',
			],
			[
				{
					label: 'candidate signatures',
				},
				'filteredSignatureCount',
				'verifiedCandidateCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Selector',
				items: [
					{
						label: 'parent EvmSelector hash row',
					},
				],
			},
			{
				label: 'Candidates',
				items: [
					{
						label: 'candidate function signatures',
					},
					{
						label: 'ambiguity warnings',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Openchain lookup response',
					},
					{
						label: 'fallback catalog behavior',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmSelector_Timestamp>
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
	entityType={EntityType.EvmSelector_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
