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
		'height',
		'hash',
		{
			label: 'timestamp',
		},
	],
	content: {
		dl: [
			[
				'height',
				'hash',
				{
					label: 'timestamp',
				},
				{
					label: 'proposer',
				},
				{
					label: 'transaction count',
				},
				{
					label: 'app hash',
				},
				{
					label: 'validators hash',
				},
				{
					label: 'header hashes',
				},
				{
					label: 'validator/proposer context',
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
				label: 'Network',
				items: [
					{
						label: 'BnbBeaconNetwork',
					},
				],
			},
			{
				label: 'Header',
				items: [
					'height',
					'hash',
					{
						label: 'timestamp',
					},
					{
						label: 'proposer',
					},
					{
						label: 'app/data/validator hashes',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'BnbBeaconTransaction list',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'archive/API/explorer block payload by height or hash',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconBlock>
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
	entityType={EntityType.BnbBeaconBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
