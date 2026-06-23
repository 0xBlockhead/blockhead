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
				label: 'token',
			},
			{
				label: 'observation time',
			},
			{
				label: 'total supply',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'token',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'total supply',
					},
					{
						label: 'mintable flag',
					},
					{
						label: 'mapped contract address',
					},
				],
				[
					{
						label: 'holder count',
					},
					{
						label: 'transfer count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Token',
					items: [
						{
							label: 'parent BNB Beacon token',
						},
					],
				},
				{
					label: 'Migrations',
					items: [
						{
							label: 'migration records near the same source/window',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'archived token metadata',
						},
						{
							label: 'explorer/indexer token stats',
						},
						{
							label: 'fusion mapping payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconToken_Timestamp>
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
	entityType={EntityType.BnbBeaconToken_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
