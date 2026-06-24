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
			label: 'miner',
		},
		{
			label: 'sector number',
		},
		{
			label: 'sealed CID',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'miner',
				},
				{
					label: 'sector number',
				},
				{
					label: 'sealed CID',
				},
				{
					label: 'activation epoch',
				},
			],
			[
				{
					label: 'expiration epoch',
				},
				{
					label: 'deal count',
				},
				{
					label: 'latest observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Miner',
				items: [
					{
						label: 'parent Filecoin miner',
					},
				],
			},
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped sector lifecycle observations',
					},
				],
			},
			{
				label: 'Deals',
				items: [
					{
						label: 'Filecoin deals from sector deal ids when available',
					},
				],
			},
			{
				label: 'Proof/deadline state',
				items: [
					{
						label: 'sector proof/deadline/partition fields only when a source provides concrete selectors',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'StateMinerSectors',
					},
					{
						label: 'indexer sector payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinSector>
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
	entityType={EntityType.FilecoinSector}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
