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
				label: 'node state',
			},
			{
				label: 'data root',
			},
			{
				label: 'chunk index',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'node state',
					},
					{
						label: 'data root',
					},
					{
						label: 'chunk index',
					},
					{
						label: 'chunk root',
					},
					{
						label: 'size',
					},
					{
						label: 'file path',
					},
					{
						label: 'present flag',
					},
					{
						label: 'last checked time',
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
							label: 'linked public data-root blob',
						},
					],
				},
				{
					label: 'Public chunk',
					items: [
						{
							label: 'public data chunk when available',
						},
					],
				},
				{
					label: 'Proofs',
					items: [
						{
							label: 'local proof material rows for this chunk',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStoredChunk>
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
	entityType={EntityType.BlockheadZeroGStoredChunk}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
