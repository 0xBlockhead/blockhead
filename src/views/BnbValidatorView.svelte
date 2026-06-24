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
			label: 'operator address',
		},
		{
			label: 'consensus address',
		},
		'moniker',
	],
	content: {
		dl: [
			[
				{
					label: 'operator address',
				},
				{
					label: 'consensus address',
				},
				'moniker',
				{
					label: 'latest voting power',
				},
				{
					label: 'status',
				},
				{
					label: 'jailed flag',
				},
				{
					label: 'produced block count',
				},
				{
					label: 'proposed blocks',
				},
				{
					label: 'archive evidence',
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
				label: 'Identity',
				items: [
					{
						label: 'operator address',
					},
					{
						label: 'consensus address',
					},
					'moniker',
				],
			},
			{
				label: 'Status history',
				items: [
					{
						label: 'BnbValidator_Timestamp list',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'proposed/produced block evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'archive/API/explorer validator payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbValidator>
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
	entityType={EntityType.BnbValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
