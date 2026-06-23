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
				label: 'sector',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'sector',
					},
					{
						label: 'observation time',
					},
					'source',
					'height',
					{
						label: 'tipset key',
					},
					{
						label: 'sealed CID',
					},
					{
						label: 'activation epoch',
					},
					{
						label: 'expiration epoch',
					},
					{
						label: 'deal count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Sector',
					items: [
						{
							label: 'parent Filecoin sector',
						},
					],
				},
				{
					label: 'Tipset',
					items: [
						{
							label: 'Filecoin tipset when resolved',
						},
					],
				},
				{
					label: 'Deals',
					items: [
						{
							label: 'Filecoin deals from deal ids',
						},
					],
				},
				{
					label: 'Source',
					items: [
						{
							label: 'StateMinerSectors/StateMinerActiveSectors payload evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinSector_Timestamp>
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
	entityType={EntityType.FilecoinSector_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
