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
				label: 'linked base Network',
			},
			{
				label: 'linked EVM network',
			},
			{
				label: 'linked Cosmos network',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked base Network',
					},
					{
						label: 'linked EVM network',
					},
					{
						label: 'linked Cosmos network',
					},
					{
						label: 'chain kind',
					},
					{
						label: 'consensus kind',
					},
					{
						label: 'EVM chain id',
					},
					{
						label: 'Cosmos chain id',
					},
					{
						label: 'bech32 prefix',
					},
					{
						label: 'Cosmos SDK head',
					},
					{
						label: 'IBC channels',
					},
					{
						label: 'validators through Cosmos network',
					},
					{
						label: 'timestamp history',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network facets',
					items: [
						{
							label: 'base Network row',
						},
						{
							label: 'EVM network row',
						},
						{
							label: 'Cosmos network row',
						},
					],
				},
				{
					label: 'Identifiers',
					items: [
						{
							label: 'EVM chain id',
						},
						{
							label: 'Cosmos chain id',
						},
						{
							label: 'bech32 prefix',
						},
					],
				},
				{
					label: 'IBC',
					items: [
						{
							label: 'IBC channel rows',
						},
					],
				},
				{
					label: 'Observations',
					items: [
						{
							label: 'timestamped network/head observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'chain registry',
						},
						{
							label: 'CometBFT/Cosmos SDK',
						},
						{
							label: 'Cronos explorer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CronosNetworkProfile>
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
	entityType={EntityType.CronosNetworkProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
