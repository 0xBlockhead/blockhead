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
		'symbol',
		{
			label: 'original symbol',
		},
		{
			label: 'name',
		},
	],
	content: {
		dl: [
			[
				'symbol',
				{
					label: 'original symbol',
				},
				{
					label: 'name',
				},
				{
					label: 'owner',
				},
				{
					label: 'token type',
				},
				{
					label: 'latest supply/mintability',
				},
			],
			[
				{
					label: 'mapped contract observation',
				},
				{
					label: 'mint/burn/freeze effects',
				},
				{
					label: 'migration records',
				},
				{
					label: 'archive source evidence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped token metadata/supply observations',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'archived Beacon token transfer rows',
					},
				],
			},
			{
				label: 'Migrations',
				items: [
					{
						label: 'Beacon-to-target token migration records',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent BNB Beacon network',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconToken>
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
	entityType={EntityType.BnbBeaconToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
