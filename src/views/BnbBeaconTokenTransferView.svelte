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
				label: 'transaction',
			},
			{
				label: 'transfer index',
			},
			{
				label: 'token symbol',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'transfer index',
					},
					{
						label: 'token symbol',
					},
					{
						label: 'from',
					},
					{
						label: 'to',
					},
					'amount',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent Beacon transaction',
						},
					],
				},
				{
					label: 'Token',
					items: [
						{
							label: 'linked Beacon token when symbol resolves',
						},
					],
				},
				{
					label: 'Effect',
					items: [
						{
							label: 'from',
						},
						{
							label: 'to',
						},
						'amount',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'archive/API/explorer transfer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconTokenTransfer>
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
	entityType={EntityType.BnbBeaconTokenTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
