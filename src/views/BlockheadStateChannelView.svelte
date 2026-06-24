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
			label: 'channel id or participant pair',
		},
		{
			label: 'network',
		},
		{
			label: 'participant accounts',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'channel id or participant pair',
				},
				{
					label: 'network',
				},
				{
					label: 'participant accounts',
				},
				{
					label: 'asset',
				},
				{
					label: 'linked room',
				},
				{
					label: 'created timestamp',
				},
				{
					label: 'latest channel state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped channel state observations',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'local channel transfers',
					},
				],
			},
			{
				label: 'States',
				items: [
					{
						label: 'signed channel state rows',
					},
				],
			},
			{
				label: 'Deposits',
				items: [
					{
						label: 'per-account deposit slices',
					},
				],
			},
			{
				label: 'Room',
				items: [
					{
						label: 'linked local room',
					},
				],
			},
			{
				label: 'Settlement evidence',
				items: [
					{
						label: 'linked EVM transactions/contracts if later modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannel>
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
	entityType={EntityType.BlockheadStateChannel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
